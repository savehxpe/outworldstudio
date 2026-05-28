"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Bell, CreditCard, Palette, Key, LogOut, ExternalLink, Check } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAppStore } from "@/store/use-app-store"
import { formatCredits } from "@/lib/utils"
import { SUBSCRIPTION_TIERS } from "@/types"

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "api", label: "API Keys", icon: Key },
] as const

type SectionId = (typeof sections)[number]["id"]

export default function SettingsPage() {
  const { user } = useAppStore()
  const [activeSection, setActiveSection] = useState<SectionId>("profile")

  const credits = user?.credits ?? 0
  const tier = user?.tier ?? "free"
  const tierConfig = SUBSCRIPTION_TIERS.find((t) => t.id === tier)
  const subStatus = user?.subscriptionStatus
  const trialEnd = user?.trialEndsAt

  return (
    <>
      <Navbar />
      <main className="pt-24 px-8 pb-16 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-display text-on-surface font-semibold tracking-tight mb-2">
            Settings
          </h1>
          <p className="text-on-surface-variant">Manage your account and preferences.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-panel border-0 md:col-span-1">
            <div className="p-4 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono transition-all ${
                    activeSection === section.id
                      ? "text-primary bg-primary/10"
                      : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
              <Separator className="my-2 bg-white/5" />
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono text-red-500 hover:bg-red-500/10 transition-all">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </Card>

          <div className="md:col-span-3 space-y-6">
            {activeSection === "profile" && (
              <Card className="glass-panel border-0">
                <div className="p-6">
                  <h2 className="text-sm font-mono tracking-wider text-on-surface uppercase mb-6">Profile</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-mono text-on-surface-variant">Name</Label>
                        <Input
                          defaultValue={user?.name ?? ""}
                          className="mt-1.5 bg-surface-container border-outline-variant/30 text-on-surface font-mono text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-mono text-on-surface-variant">Email</Label>
                        <Input
                          defaultValue={user?.email ?? ""}
                          className="mt-1.5 bg-surface-container border-outline-variant/30 text-on-surface font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button className="bg-primary text-background font-mono text-xs tracking-widest uppercase px-6 py-2.5 rounded-lg hover:shadow-[0_0_20px_rgba(0,219,233,0.3)] transition-all">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === "billing" && (
              <>
                <Card className="glass-panel border-0">
                  <div className="p-6">
                    <h2 className="text-sm font-mono tracking-wider text-on-surface uppercase mb-6">
                      Plan & Usage
                    </h2>

                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-lg font-display text-on-surface font-semibold">
                          {tierConfig?.label ?? "Free"} Plan
                        </p>
                        <p className="text-xs font-mono text-on-surface-variant mt-1">
                          {tier === "free"
                            ? "10 one-time credits"
                            : `${formatCredits(tierConfig?.monthlyCredits ?? 0)} credits per month`
                          }
                        </p>
                      </div>
                      {tier !== "free" && (
                        <span className={`text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider ${
                          subStatus === "trialing"
                            ? "bg-primary/10 text-primary"
                            : subStatus === "active"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}>
                          {subStatus === "trialing" ? "Trial" : subStatus === "active" ? "Active" : subStatus}
                        </span>
                      )}
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between text-xs font-mono mb-2">
                        <span className="text-outline">Credits Balance</span>
                        <span className="text-primary">{formatCredits(credits)}</span>
                      </div>
                      <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                          style={{ width: `${Math.min(100, (credits / Math.max(tierConfig?.monthlyCredits ?? 100, 100)) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {tier !== "free" && (
                      <div className="space-y-2 mb-6">
                        {trialEnd && subStatus === "trialing" && (
                          <p className="text-xs font-mono text-on-surface-variant">
                            Trial ends {new Date(trialEnd).toLocaleDateString()}
                          </p>
                        )}
                        {tierConfig?.features.map((f) => (
                          <div key={f} className="flex items-center gap-2">
                            <Check className="w-3 h-3 text-primary" />
                            <span className="text-xs text-on-surface-variant">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      {user?.stripeCustomerId ? (
                        <a
                          href={`/api/stripe/portal?userId=${user.id}`}
                          className="inline-flex items-center gap-2 bg-primary text-background font-mono text-xs tracking-widest uppercase px-6 py-2.5 rounded-lg hover:shadow-[0_0_20px_rgba(0,219,233,0.3)] transition-all"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Manage on Stripe
                        </a>
                      ) : (
                        <a
                          href="/pricing"
                          className="inline-flex items-center gap-2 border border-primary/30 text-primary font-mono text-xs tracking-widest uppercase px-6 py-2.5 rounded-lg hover:bg-primary/10 transition-all"
                        >
                          View Plans
                        </a>
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="glass-panel border-0">
                  <div className="p-6">
                    <h2 className="text-sm font-mono tracking-wider text-on-surface uppercase mb-6">Billing History</h2>
                    <p className="text-xs text-on-surface-variant">
                      Past invoices and payment history are available in the{" "}
                      <a
                        href={user?.stripeCustomerId ? `/api/stripe/portal?userId=${user.id}` : "/pricing"}
                        className="text-primary hover:underline"
                      >
                        Stripe Customer Portal
                      </a>.
                    </p>
                  </div>
                </Card>
              </>
            )}

            {activeSection === "api" && (
              <Card className="glass-panel border-0">
                <div className="p-6">
                  <h2 className="text-sm font-mono tracking-wider text-on-surface uppercase mb-6">API Keys</h2>
                  <p className="text-xs text-on-surface-variant mb-4">
                    Generate API keys for programmatic access to the Outworld processing engine.
                  </p>
                  <button className="border border-outline-variant text-on-surface hover:text-primary hover:border-primary font-mono text-xs tracking-widest uppercase px-6 py-2.5 rounded-lg transition-all">
                    Generate Key
                  </button>
                </div>
              </Card>
            )}

            {activeSection !== "profile" && activeSection !== "billing" && activeSection !== "api" && (
              <Card className="glass-panel border-0">
                <div className="p-6">
                  <h2 className="text-sm font-mono tracking-wider text-on-surface uppercase mb-6">
                    {sections.find((s) => s.id === activeSection)?.label}
                  </h2>
                  <p className="text-xs text-on-surface-variant">Coming soon.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
