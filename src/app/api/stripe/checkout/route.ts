import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { createSubscriptionCheckout } from "@/lib/stripe"
import { SUBSCRIPTION_TIERS } from "@/types"
import type { Tier } from "@/types"

export async function POST(req: NextRequest) {
  try {
    const { tier, userId } = await req.json()

    if (!tier || !userId) {
      return NextResponse.json({ error: "Missing tier or userId" }, { status: 400 })
    }

    const validTier = SUBSCRIPTION_TIERS.find((t) => t.id === tier)
    if (!validTier || validTier.id === "free") {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
    }

    const { data: user } = await getSupabaseAdmin()
      .from("users")
      .select("email, stripe_customer_id")
      .eq("id", userId)
      .single()

    const session = await createSubscriptionCheckout(
      userId,
      tier as Tier,
      user?.email ?? undefined
    )

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    )
  }
}
