"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Download, Music, Mic, Drum, Guitar, Volume1, VolumeX, Scissors } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Waveform } from "@/components/studio/waveform"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { AudioPreview } from "@/components/studio/audio-preview"

interface StemTrack {
  id: string
  type: "vocals" | "drums" | "bass" | "other"
  label: string
  icon: typeof Music
  muted: boolean
  solo: boolean
  url: string
}

const initialStems: StemTrack[] = [
  { id: "1", type: "vocals", label: "Lead Vocals", icon: Mic, muted: false, solo: false, url: "" },
  { id: "2", type: "drums", label: "Drums", icon: Drum, muted: false, solo: false, url: "" },
  { id: "3", type: "bass", label: "Bass", icon: Guitar, muted: false, solo: false, url: "" },
  { id: "4", type: "other", label: "Harmonic Elements", icon: Music, muted: false, solo: false, url: "" },
]

export default function RemixLabPage() {
  const [stems, setStems] = useState(initialStems)
  const [playing, setPlaying] = useState<string | null>(null)
  const [bpm, setBpm] = useState(128)

  const toggleMute = (id: string) => {
    setStems(stems.map((s) => (s.id === id ? { ...s, muted: !s.muted, solo: false } : s)))
  }

  const toggleSolo = (id: string) => {
    setStems(stems.map((s) => (s.id === id ? { ...s, solo: !s.solo, muted: false } : s)))
  }

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
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-secondary uppercase">SYS.REMIX.ONLINE</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-on-surface font-semibold tracking-tight mb-2">
            Remix Lab
          </h1>
          <p className="text-on-surface-variant">Arrange, mix, and export your isolated stems.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <Card className="glass-panel border-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-mono tracking-wider text-on-surface uppercase">Stem Tracks</h2>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <Play className="w-4 h-4 text-primary ml-0.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {stems.map((stem) => (
                    <div
                      key={stem.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors group"
                    >
                      <button
                        onClick={() => setPlaying(playing === stem.id ? null : stem.id)}
                        className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        {playing === stem.id ? (
                          <Pause className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-primary ml-0.5" />
                        )}
                      </button>

                      <stem.icon className={`w-4 h-4 ${stem.muted ? "text-outline" : "text-primary"}`} />

                      <span className={`text-xs font-mono flex-1 ${stem.muted ? "text-outline line-through" : "text-on-surface"}`}>
                        {stem.label}
                      </span>

                      <button
                        onClick={() => toggleMute(stem.id)}
                        className={`p-1.5 rounded transition-colors ${
                          stem.muted ? "bg-red-500/20 text-red-500" : "hover:bg-surface-container-highest text-outline"
                        }`}
                      >
                        <VolumeX className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => toggleSolo(stem.id)}
                        className={`p-1.5 rounded transition-colors ${
                          stem.solo ? "bg-primary/20 text-primary" : "hover:bg-surface-container-highest text-outline"
                        }`}
                      >
                        <Volume1 className="w-3.5 h-3.5" />
                      </button>

                      <button className="p-1.5 rounded hover:bg-surface-container-highest text-outline transition-colors opacity-0 group-hover:opacity-100">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="glass-panel border-0">
              <div className="p-6">
                <h2 className="text-xs font-mono tracking-wider text-on-surface uppercase mb-4">Master Timeline</h2>
                <Waveform />
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="glass-panel border-0">
              <div className="p-6">
                <h3 className="text-xs font-mono tracking-wider text-on-surface uppercase mb-4">Mix Controls</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-2">
                      <span className="text-outline">Master Volume</span>
                      <span className="text-primary">-2.4 dB</span>
                    </div>
                    <Slider defaultValue={[75]} max={100} className="[&>span]:bg-primary" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-2">
                      <span className="text-outline">BPM</span>
                      <span className="text-primary">{bpm}</span>
                    </div>
                    <Slider
                      defaultValue={[128]}
                      min={60}
                      max={200}
                      onValueChange={(v) => setBpm(Array.isArray(v) ? v[0] : v)}
                      className="[&>span]:bg-secondary"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass-panel border-0">
              <div className="p-6">
                <h3 className="text-xs font-mono tracking-wider text-on-surface uppercase mb-4">Actions</h3>
                <div className="space-y-2">
                  <button className="w-full bg-primary text-background font-mono text-xs tracking-widest uppercase py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,219,233,0.3)] transition-all flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Stems
                  </button>
                  <button className="w-full border border-outline-variant text-on-surface hover:text-primary hover:border-primary font-mono text-xs tracking-widest uppercase py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                    <Scissors className="w-4 h-4" />
                    Trim Regions
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
