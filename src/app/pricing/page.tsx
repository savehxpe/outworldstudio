"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Sparkles, Shield, ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Card } from "@/components/ui/card"
import { SUBSCRIPTION_TIERS } from "@/types"
import { useAppStore } from "@/store/use-app-store"
import type { Tier } from "@/types"

const tierColors: Record<Tier, { border: string; badge: string; button: string }> = {
  free: { border: "border-outline-variant/30", badge: "text-on-surface-variant", button: "border-outline-variant text-on-surface hover:text-primary hover:border-primary" },
  hobby: { border: "", badge: "text-primary", button: "bg-primary text-background hover:shadow-[0_0_20px_rgba(0,219,233,0.4)]" },
  pro: { border: "ring-1 ring-primary/50", badge: "text-primary", button: "bg-primary text-background hover:shadow-[0_0_20px_rgba(0,219,233,0.4)]" },
  studio: { border: "", badge: "text-secondary", button: "bg-secondary text-background hover:shadow-[0_0_20px_rgba(200,100,255,0.4)]" },
}

export default function PricingPage() {
  const { user } = useAppStore()
  const [loading, setLoading] = useState<Tier | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleStartTrial = async (tier: Tier) => {
    if (!user) return
    setLoading(tier)
    setError(null)

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, userId: user.id }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Checkout failed")

      window.location.assign(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(null)
    }
  }

  const paidTiers = SUBSCRIPTION_TIERS.filter((t) => t.id !== "free")
  const currentTier = user?.tier ?? "free"

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
            <span className="text-xs font-mono tracking-widest text-primary uppercase">Subscription Plans</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display text-on-surface font-bold tracking-tight mb-4">
            Start Free, Upgrade When You Grow.
          </h1>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Every paid plan comes with a <span className="text-primary font-semibold">7-day free trial</span>.
            No risk. Cancel anytime.
          </p>
        </motion.div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono text-center">
            {error}
          </div>
        )}

        {/* Free tier card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto mb-12"
        >
          <Card className={`glass-panel border-0 p-6 ${tierColors.free.border}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-mono tracking-wider text-on-surface uppercase">Free</h3>
                <p className="text-xs text-on-surface-variant mt-1">10 one-time credits &middot; Vocal removal only</p>
              </div>
              {currentTier === "free" && (
                <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                  Current Plan
                </span>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Paid tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {paidTiers.map((tier, i) => {
            const color = tierColors[tier.id]
            const isCurrent = currentTier === tier.id

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <Card className={`glass-panel border-0 p-8 h-full relative flex flex-col ${color.border}`}>
                  {tier.id === "pro" && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-background text-[10px] font-mono tracking-widest uppercase whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-sm font-mono tracking-wider text-on-surface uppercase mb-2">
                      {tier.label}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-display text-on-surface font-bold">${tier.price}</span>
                      <span className="text-sm font-mono text-outline">/ month</span>
                    </div>
                    <p className="text-xs font-mono text-primary mt-1">
                      {tier.monthlyCredits.toLocaleString()} credits every month
                    </p>
                  </div>

                  <div className="space-y-3 mb-8 flex-1">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-xs text-on-surface-variant">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {isCurrent ? (
                    <div className="w-full text-center font-mono text-xs tracking-widest uppercase py-3.5 rounded-lg border border-primary/30 text-primary">
                      Current Plan
                    </div>
                  ) : user ? (
                    <button
                      onClick={() => handleStartTrial(tier.id)}
                      disabled={loading === tier.id}
                      className={`w-full text-center font-mono text-xs tracking-widest uppercase py-3.5 rounded-lg transition-all disabled:opacity-50 ${color.button}`}
                    >
                      {loading === tier.id ? "Redirecting..." : "Start 7-Day Free Trial"}
                    </button>
                  ) : (
                    <a
                      href="/auth/callback"
                      className="block w-full text-center font-mono text-xs tracking-widest uppercase py-3.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                    >
                      Sign In to Start Trial
                    </a>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-outline text-xs font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>All payments processed via Stripe &middot; Cancel anytime &middot; Credits roll over</span>
          </div>
        </motion.div>

        {user && currentTier !== "free" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <a
              href={`/api/stripe/portal?userId=${user.id}`}
              className="inline-flex items-center gap-2 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Manage subscription via Stripe
            </a>
          </motion.div>
        )}
      </main>
    </>
  )
}
