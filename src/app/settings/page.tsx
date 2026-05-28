"use client"

import { motion } from "framer-motion"
import { User, Bell, CreditCard, Palette, Key, LogOut } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "api", label: "API Keys", icon: Key },
]

export default function SettingsPage() {
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
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
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
            <Card className="glass-panel border-0">
              <div className="p-6">
                <h2 className="text-sm font-mono tracking-wider text-on-surface uppercase mb-6">Profile</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-mono text-on-surface-variant">Name</Label>
                      <Input
                        defaultValue="User"
                        className="mt-1.5 bg-surface-container border-outline-variant/30 text-on-surface font-mono text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-mono text-on-surface-variant">Email</Label>
                      <Input
                        defaultValue="user@outworld.studio"
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
          </div>
        </div>
      </main>
    </>
  )
}
