"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Download, Play, Pause, Music, Mic, Drum, Guitar } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Waveform } from "@/components/studio/waveform"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AudioPreview } from "@/components/studio/audio-preview"

const stemIcons: Record<string, typeof Music> = {
  vocals: Mic,
  drums: Drum,
  bass: Guitar,
  other: Music,
  instrumental: Music,
}

const stems = [
  { id: "1", type: "vocals", label: "Lead Vocals", url: "", duration: "3:24" },
  { id: "2", type: "drums", label: "Drums", url: "", duration: "3:24" },
  { id: "3", type: "bass", label: "Bass", url: "", duration: "3:24" },
  { id: "4", type: "other", label: "Harmonic Elements", url: "", duration: "3:24" },
  { id: "5", type: "instrumental", label: "Full Instrumental", url: "", duration: "3:24" },
]

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Navbar />
      <main className="pt-24 px-8 pb-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-outline hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Library
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="border-green-500/30 text-green-500 font-mono text-[10px]">
                  completed
                </Badge>
                <span className="text-xs font-mono text-outline">May 28, 2026</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-display text-on-surface font-semibold tracking-tight">
                Summer Heat Remix
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">Original: summer_heat_final.mp3 · 3:24 · 8.2 MB</p>
            </div>
            <button className="bg-primary text-background font-mono text-xs tracking-widest uppercase px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,219,233,0.3)] transition-all flex items-center gap-2 self-start">
              <Download className="w-4 h-4" />
              Download All
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="glass-panel border-0">
              <div className="p-6">
                <h2 className="text-xs font-mono tracking-wider text-on-surface uppercase mb-4">Original Waveform</h2>
                <Waveform />
              </div>
            </Card>

            <Card className="glass-panel border-0">
              <div className="p-6">
                <h2 className="text-xs font-mono tracking-wider text-on-surface uppercase mb-4">Isolated Stems</h2>
                <div className="space-y-2">
                  {stems.map((stem) => {
                    const Icon = stemIcons[stem.type] || Music
                    return (
                      <div key={stem.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 text-primary ml-0.5" />
                        </div>
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="text-xs font-mono text-on-surface flex-1">{stem.label}</span>
                        <span className="text-xs font-mono text-outline">{stem.duration}</span>
                        <button className="p-1.5 rounded hover:bg-surface-container-highest text-outline transition-colors opacity-0 group-hover:opacity-100">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="glass-panel border-0">
              <div className="p-6">
                <h3 className="text-xs font-mono tracking-wider text-on-surface uppercase mb-4">Project Info</h3>
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-outline">Status</span>
                    <span className="text-green-500">Completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Stems</span>
                    <span className="text-on-surface">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Duration</span>
                    <span className="text-on-surface">3:24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Credits Used</span>
                    <span className="text-primary">25 cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Format</span>
                    <span className="text-on-surface">MP3 320kbps</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass-panel border-0">
              <div className="p-6">
                <h3 className="text-xs font-mono tracking-wider text-on-surface uppercase mb-4">Processing Log</h3>
                <div className="space-y-2">
                  {[
                    { time: "14:32:01", msg: "Upload received", ok: true },
                    { time: "14:32:05", msg: "Queued for processing", ok: true },
                    { time: "14:32:30", msg: "Neural model loaded", ok: true },
                    { time: "14:33:12", msg: "Stem separation complete", ok: true },
                    { time: "14:33:15", msg: "Results stored", ok: true },
                  ].map((entry) => (
                    <div key={entry.msg} className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="text-outline w-14">{entry.time}</span>
                      <span className={entry.ok ? "text-green-500" : "text-red-500"}>●</span>
                      <span className="text-on-surface-variant">{entry.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
