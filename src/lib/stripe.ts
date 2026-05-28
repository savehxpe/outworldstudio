import Stripe from "stripe"

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error("Missing STRIPE_SECRET_KEY")
    _stripe = new Stripe(key)
  }
  return _stripe
}

export const CREDIT_PACKAGES = [
  { id: "starter", credits: 100, price: 12, label: "Starter" },
  { id: "pro", credits: 500, price: 49, label: "Pro" },
  { id: "studio", credits: 2000, price: 149, label: "Studio" },
] as const

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  credits: number
) {
  const s = getStripe()
  return s.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId, credits: String(credits) },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?credits=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  })
}
