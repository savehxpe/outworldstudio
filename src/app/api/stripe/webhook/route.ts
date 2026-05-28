import { NextRequest, NextResponse } from "next/server"
import { getStripe, getTierFromPriceId } from "@/lib/stripe"
import { getSupabaseAdmin } from "@/lib/supabase"
import { SUBSCRIPTION_TIERS } from "@/types"
import type { Tier } from "@/types"

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get("stripe-signature")
    if (!sig) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    const body = await req.text()
    const s = getStripe()
    const event = s.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    const admin = getSupabaseAdmin()

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const userId = session.metadata?.userId as string | undefined
        const tier = session.metadata?.tier as Tier | undefined
        const subscriptionId = session.subscription as string | undefined

        if (!userId || !tier || !subscriptionId) break

        const tierConfig = SUBSCRIPTION_TIERS.find((t) => t.id === tier)
        if (!tierConfig) break

        const customerId = typeof session.customer === "string"
          ? session.customer
          : session.customer?.id

        await admin
          .from("users")
          .update({
            tier,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId ?? undefined,
            subscription_status: "trialing",
            trial_ends_at: new Date(Date.now() + 7 * 86400000).toISOString(),
            monthly_credits: tierConfig.monthlyCredits,
            credits_last_refreshed_at: new Date().toISOString(),
          })
          .eq("id", userId)

        await admin.rpc("add_credits", {
          user_id: userId,
          amount: tierConfig.monthlyCredits,
        })

        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as unknown as Record<string, unknown>
        const subscriptionId = invoice.subscription as string | undefined
        if (!subscriptionId) break

        const { data: user } = await admin
          .from("users")
          .select("id, monthly_credits")
          .eq("stripe_subscription_id", subscriptionId)
          .single()

        if (!user) break

        await admin.rpc("add_credits", {
          user_id: user.id,
          amount: user.monthly_credits,
        })

        await admin
          .from("users")
          .update({ credits_last_refreshed_at: new Date().toISOString() })
          .eq("id", user.id)

        await admin.from("billing").insert({
          user_id: user.id,
          tier: user.monthly_credits >= 2000 ? "studio" : user.monthly_credits >= 500 ? "pro" : "hobby",
          stripe_subscription_id: subscriptionId,
          stripe_session_id: invoice.id as string,
          amount: (invoice.total as number) ?? 0,
          credits_purchased: user.monthly_credits,
          status: "completed",
        })

        break
      }

      case "customer.subscription.updated": {
        const sub = event.data.object
        const subId = sub.id
        const status = sub.status

        await admin
          .from("users")
          .update({ subscription_status: status })
          .eq("stripe_subscription_id", subId)

        if (status === "past_due" || status === "incomplete") break

        const priceId = sub.items.data[0]?.price.id
        if (!priceId) break

        const newTier = getTierFromPriceId(priceId)
        if (!newTier) break

        const tierConfig = SUBSCRIPTION_TIERS.find((t) => t.id === newTier)
        if (!tierConfig) break

        const { data: user } = await admin
          .from("users")
          .select("id, tier")
          .eq("stripe_subscription_id", subId)
          .single()

        if (!user || user.tier === newTier) break

        await admin
          .from("users")
          .update({
            tier: newTier,
            monthly_credits: tierConfig.monthlyCredits,
            credits_last_refreshed_at: new Date().toISOString(),
          })
          .eq("id", user.id)

        break
      }

      case "customer.subscription.deleted": {
        const deletedSub = event.data.object
        const deletedSubId = deletedSub.id

        await admin
          .from("users")
          .update({
            tier: "free",
            stripe_subscription_id: null,
            subscription_status: "canceled",
            trial_ends_at: null,
            monthly_credits: 0,
          })
          .eq("stripe_subscription_id", deletedSubId)

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error:", error)
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    )
  }
}
