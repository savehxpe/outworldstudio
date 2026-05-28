import { NextRequest, NextResponse } from "next/server"
import { getStripe, CREDIT_PACKAGES } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId } = await req.json()

    const pkg = CREDIT_PACKAGES.find((p) => p.id === priceId)
    if (!pkg) {
      return NextResponse.json({ error: "Invalid price tier" }, { status: 400 })
    }

    const s = getStripe()
    const session = await s.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${pkg.label} — ${pkg.credits} Credits`,
              description: `Outworld Studio compute credit package`,
            },
            unit_amount: pkg.price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        credits: String(pkg.credits),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?credits=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
