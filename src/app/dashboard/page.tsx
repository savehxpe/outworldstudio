"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Layers, BarChart3, Clock } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Waveform } from "@/components/studio/waveform"
import { useAppStore } from "@/store/use-app-store"
import { formatCredits } from "@/lib/utils"

const recentProjects = [
  { id: "1", title: "Summer Heat Remix", status: "completed", date: "2h ago", stems: 4 },
  { id: "2", title: "Vocal Isolation - Track 3", status: "completed", date: "5h ago", stems: 2 },
  { id: "3", title: "Podcast Cleanup Ep.42", status: "processing", date: "now", stems: 3 },
  { id: "4", title: "Bassline Extraction", status: "completed", date: "1d ago", stems: 1 },
]

export default function DashboardPage() {
  const { user } = useAppStore()

  const credits = user?.credits ?? 0
  const tier = user?.tier ?? "free"

  const stats = [
    { label: "Credits Remaining", value: formatCredits(credits), icon: BarChart3 },
    { label: "Tier", value: tier.charAt(0).toUpperCase() + tier.slice(1), icon: Clock },
  ]

  return (
    <>
      <Navbar />
      <main className="pt-24 px-8 pb-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-display text-on-surface font-semibold tracking-tight mb-2">
            Studio Dashboard
          </h1>
          <p className="text-on-surface-variant">Welcome back. Your sonic command center.</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-12 max-w-md">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-mono text-outline uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-2xl font-display text-on-surface font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 glass-panel rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-mono tracking-wider text-on-surface uppercase">Recent Projects</h2>
              <Link href="/projects" className="text-xs font-mono text-primary tracking-wider uppercase flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      project.status === "processing" ? "bg-primary animate-pulse" : "bg-green-500"
                    }`} />
                    <div>
                      <p className="text-sm text-on-surface group-hover:text-primary transition-colors">{project.title}</p>
                      <p className="text-xs font-mono text-outline">{project.date} · {project.stems} stems</p>
                    </div>
                  </div>
                  <span className={`text-xs font-mono tracking-wider uppercase ${
                    project.status === "processing" ? "text-primary" : "text-outline"
                  }`}>
                    {project.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-sm font-mono tracking-wider text-on-surface uppercase mb-4">Activity</h2>
            <Waveform />
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-outline">Processing Load</span>
                <span className="text-primary">23%</span>
              </div>
              <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full w-[23%] bg-primary rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/studio"
            className="group inline-flex items-center gap-2 bg-primary text-background font-mono text-xs tracking-widest uppercase px-8 py-4 rounded hover:shadow-[0_0_20px_rgba(0,219,233,0.4)] transition-all"
          >
            <Layers className="w-4 h-4" />
            New Processing Job
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </main>
    </>
  )
}
