import Stripe from "stripe"
import type { Tier } from "@/types"
import { SUBSCRIPTION_TIERS } from "@/types"

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error("Missing STRIPE_SECRET_KEY")
    _stripe = new Stripe(key)
  }
  return _stripe
}

function getPriceId(tier: Tier): string {
  const t = SUBSCRIPTION_TIERS.find((t) => t.id === tier)
  if (!t || !t.priceIdEnv) throw new Error(`No price ID for tier: ${tier}`)
  const id = process.env[t.priceIdEnv]
  if (!id) throw new Error(`Missing env var: ${t.priceIdEnv}`)
  return id
}

export function getTierFromPriceId(priceId: string): Tier | null {
  for (const t of SUBSCRIPTION_TIERS) {
    if (!t.priceIdEnv) continue
    if (process.env[t.priceIdEnv] === priceId) return t.id
  }
  return null
}

export async function createSubscriptionCheckout(
  userId: string,
  tier: Tier,
  customerEmail?: string
) {
  const s = getStripe()
  const priceId = getPriceId(tier)

  return s.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: customerEmail,
    subscription_data: {
      trial_period_days: 7,
      metadata: { userId, tier },
    },
    metadata: { userId, tier },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  })
}

export async function createPortalSession(customerId: string) {
  const s = getStripe()
  return s.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  })
}

export async function getCustomerIdFromSubscription(subscriptionId: string) {
  const s = getStripe()
  const sub = await s.subscriptions.retrieve(subscriptionId)
  return typeof sub.customer === "string" ? sub.customer : sub.customer.id
}
