"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Check, AlertCircle, Music, Mic, Drum, Guitar } from "lucide-react"
import { toast } from "sonner"
import { Navbar } from "@/components/layout/navbar"
import { FileUpload } from "@/components/studio/file-upload"
import { Waveform } from "@/components/studio/waveform"
import { AudioPreview } from "@/components/studio/audio-preview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type ProcessingMode = "separate_vocal" | "split_stem"
type StemType = "drums" | "bass" | "vocals" | "other"

const stemOptions: { type: StemType; label: string; icon: typeof Music }[] = [
  { type: "vocals", label: "Vocals", icon: Mic },
  { type: "drums", label: "Drums", icon: Drum },
  { type: "bass", label: "Bass", icon: Guitar },
  { type: "other", label: "Other", icon: Music },
]

export default function StudioPage() {
  const [mode, setMode] = useState<ProcessingMode>("separate_vocal")
  const [selectedStem, setSelectedStem] = useState<StemType>("drums")
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setProcessing(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("audio", file)
      formData.append("mode", mode)

      if (mode === "split_stem") {
        formData.append("stem", selectedStem)
      }

      const res = await fetch("/api/suno/generate", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Processing failed")
      }

      const data = await res.json()
      setResult(data.audioUrl)
      toast.success("Processing complete")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Processing failed")
    } finally {
      setProcessing(false)
    }
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
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-primary uppercase">SYS.ENGINE.ONLINE</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-on-surface font-semibold tracking-tight mb-2">
            Audio Engine
          </h1>
          <p className="text-on-surface-variant">Upload audio and process with neural stem separation.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="glass-panel border-0">
              <div className="p-6">
                <Tabs
                  value={mode}
                  onValueChange={(v) => setMode(v as ProcessingMode)}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 mb-6 bg-surface-container">
                    <TabsTrigger value="separate_vocal" className="font-mono text-xs tracking-wider">
                      Vocal Removal
                    </TabsTrigger>
                    <TabsTrigger value="split_stem" className="font-mono text-xs tracking-wider">
                      Stem Splitter
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="separate_vocal">
                    <p className="text-sm text-on-surface-variant mb-4 font-mono">
                      Removes lead vocals while preserving instrumental backing. Mode: SEPARATE_VOCAL
                    </p>
                  </TabsContent>

                  <TabsContent value="split_stem">
                    <p className="text-sm text-on-surface-variant mb-4 font-mono">
                      Isolate individual instruments. Select the stem to extract: Mode: SPLIT_STEM
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {stemOptions.map((stem) => (
                        <button
                          key={stem.type}
                          onClick={() => setSelectedStem(stem.type)}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                            selectedStem === stem.type
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-outline-variant/30 text-on-surface-variant hover:border-primary/50"
                          }`}
                        >
                          <stem.icon className="w-4 h-4" />
                          <span className="text-xs font-mono tracking-wider">{stem.label}</span>
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <FileUpload onUpload={handleUpload} />
              </div>
            </Card>

            {processing && (
              <Card className="glass-panel border-0">
                <div className="p-6 flex items-center gap-4">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <div>
                    <p className="text-sm text-on-surface">Processing on neural grid...</p>
                    <p className="text-xs font-mono text-outline">This may take 30-60 seconds</p>
                  </div>
                </div>
              </Card>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass-panel border-0">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-mono text-green-500 tracking-wider uppercase">Processing Complete</span>
                    </div>
                    <AudioPreview url={result} />
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-panel border-0">
              <div className="p-6">
                <h3 className="text-xs font-mono tracking-wider text-on-surface uppercase mb-4">Credit Cost</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">Vocal Removal</span>
                    <Badge variant="outline" className="font-mono border-primary/30 text-primary">10 cr</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">Stem Split</span>
                    <Badge variant="outline" className="font-mono border-secondary/30 text-secondary">25 cr</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass-panel border-0">
              <div className="p-6">
                <h3 className="text-xs font-mono tracking-wider text-on-surface uppercase mb-4">Waveform Preview</h3>
                <Waveform />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
