import type Stripe from "stripe"
import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { getSupabaseAdmin } from "@/lib/supabase"

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

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const credits = parseInt(session.metadata?.credits || "0")

      if (userId && credits > 0) {
        const admin = getSupabaseAdmin()
        await admin.rpc("add_credits", {
          user_id: userId,
          amount: credits,
        })

        await admin.from("billing").insert({
          user_id: userId,
          stripe_session_id: session.id,
          stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
          amount: session.amount_total,
          credits_purchased: credits,
          status: "completed",
        })
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
