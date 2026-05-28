"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface WaveformProps {
  peaks?: number[]
  progress?: number
  className?: string
}

const defaultPeaks = Array.from({ length: 60 }, () => Math.random() * 60 + 8)

export function Waveform({ peaks = defaultPeaks, progress = 0, className }: WaveformProps) {
  return (
    <div className={cn("flex items-end gap-[2px] h-20", className)}>
      {peaks.map((height, i) => {
        const isProcessed = i / peaks.length < progress
        return (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height }}
            transition={{ duration: 0.5, delay: i * 0.01 }}
            className={cn(
              "w-[3px] rounded-t-sm transition-colors duration-300",
              isProcessed ? "bg-primary" : "bg-surface-container-highest"
            )}
            style={{ height: `${height}%` }}
          />
        )
      })}
    </div>
  )
}
