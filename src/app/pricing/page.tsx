"use client"

import { motion } from "framer-motion"
import { Check, Sparkles, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Card } from "@/components/ui/card"

const plans = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    price: 12,
    popular: false,
    features: [
      "100 compute credits",
      "Vocal removal",
      "Stem splitting (4 stems)",
      "Standard processing speed",
      "48-hour retention",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    credits: 500,
    price: 49,
    popular: true,
    features: [
      "500 compute credits",
      "Vocal removal",
      "Stem splitting (4 stems)",
      "Priority processing",
      "30-day retention",
      "Batch processing",
      "WAV export",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    credits: 2000,
    price: 149,
    popular: false,
    features: [
      "2000 compute credits",
      "Vocal removal",
      "Stem splitting (8 stems)",
      "Real-time priority",
      "Unlimited retention",
      "Batch & parallel processing",
      "WAV + FLAC export",
      "API access",
      "Dedicated support",
    ],
  },
]

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 px-8 pb-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono tracking-widest text-primary uppercase">Compute Credits</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display text-on-surface font-bold tracking-tight mb-4">
            Processing Power, On Demand.
          </h1>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            No subscriptions. Purchase compute credits and allocate them directly to neural processing tasks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className={`glass-panel border-0 p-8 h-full relative ${
                plan.popular ? "ring-1 ring-primary/50" : ""
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-background text-[10px] font-mono tracking-widest uppercase">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-sm font-mono tracking-wider text-on-surface uppercase mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display text-on-surface font-bold">${plan.price}</span>
                    <span className="text-sm font-mono text-outline">/ one-time</span>
                  </div>
                  <p className="text-xs font-mono text-primary mt-1">{plan.credits} compute credits</p>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-xs text-on-surface-variant">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/api/stripe/checkout"
                  className={`block w-full text-center font-mono text-xs tracking-widest uppercase py-3.5 rounded-lg transition-all ${
                    plan.popular
                      ? "bg-primary text-background hover:shadow-[0_0_20px_rgba(0,219,233,0.4)]"
                      : "border border-outline-variant text-on-surface hover:text-primary hover:border-primary"
                  }`}
                >
                  Purchase {plan.credits} Credits
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 text-outline text-xs font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>All transactions encrypted via Stripe · Credits never expire</span>
          </div>
        </motion.div>
      </main>
    </>
  )
}
