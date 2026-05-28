"use client"

import { motion } from "framer-motion"
import { Users, CreditCard, BarChart3, Activity, AlertTriangle, RefreshCw, TrendingUp, DollarSign } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Card } from "@/components/ui/card"

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 px-8 pb-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-red-500 uppercase">Admin Panel</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-on-surface font-semibold tracking-tight mb-2">
            System Administration
          </h1>
          <p className="text-on-surface-variant">Monitor platform analytics, jobs, and revenue.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: "1,247", icon: Users, change: "+12%", color: "text-primary" },
            { label: "Revenue", value: "$24,580", icon: DollarSign, change: "+8%", color: "text-green-500" },
            { label: "Jobs Processed", value: "8,432", icon: Activity, change: "+23%", color: "text-secondary" },
            { label: "Failed Jobs", value: "23", icon: AlertTriangle, change: "-5%", color: "text-red-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs font-mono text-outline uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-2xl font-display text-on-surface font-bold">{stat.value}</p>
              <span className={`text-xs font-mono ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                {stat.change} vs last month
              </span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-panel border-0">
            <div className="p-6">
              <h2 className="text-xs font-mono tracking-wider text-on-surface uppercase mb-4">Queue Monitoring</h2>
              <div className="space-y-3">
                {[
                  { queue: "vocal-removal", pending: 12, processing: 3, failed: 1 },
                  { queue: "stem-split", pending: 8, processing: 2, failed: 0 },
                  { queue: "webhooks", pending: 0, processing: 1, failed: 2 },
                ].map((q) => (
                  <div key={q.queue} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                    <div>
                      <span className="text-xs font-mono text-on-surface">{q.queue}</span>
                      <div className="flex gap-3 mt-1">
                        <span className="text-[10px] font-mono text-outline">{q.pending} pending</span>
                        <span className="text-[10px] font-mono text-primary">{q.processing} active</span>
                        {q.failed > 0 && (
                          <span className="text-[10px] font-mono text-red-500">{q.failed} failed</span>
                        )}
                      </div>
                    </div>
                    <RefreshCw className="w-4 h-4 text-outline" />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="glass-panel border-0">
            <div className="p-6">
              <h2 className="text-xs font-mono tracking-wider text-on-surface uppercase mb-4">Credit Usage</h2>
              <div className="space-y-3">
                {[
                  { user: "user@example.com", credits: 340, used: 160 },
                  { user: "producer@example.com", credits: 1200, used: 800 },
                  { user: "studio@example.com", credits: 5000, used: 2300 },
                ].map((u) => (
                  <div key={u.user} className="p-3 rounded-lg bg-surface-container-low">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono text-on-surface">{u.user}</span>
                      <span className="text-xs font-mono text-outline">{u.used}/{u.credits} cr</span>
                    </div>
                    <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(u.used / u.credits) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </>
  )
}
