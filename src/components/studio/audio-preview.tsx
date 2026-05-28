"use client"

import { motion } from "framer-motion"
import { Play, Pause, Loader2 } from "lucide-react"
import { useAudioPlayer } from "@/hooks/use-audio-player"
import { formatDuration } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface AudioPreviewProps {
  url: string
  className?: string
}

export function AudioPreview({ url, className }: AudioPreviewProps) {
  const { isPlaying, currentTime, duration, toggle } = useAudioPlayer(url)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        onClick={toggle}
        className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 text-primary" />
        ) : (
          <Play className="w-3.5 h-3.5 text-primary ml-0.5" />
        )}
      </button>
      <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          style={{ width: `${progress}%` }}
          layout
        />
      </div>
      <span className="text-xs font-mono text-outline min-w-[60px] text-right">
        {formatDuration(currentTime)} / {formatDuration(duration)}
      </span>
    </div>
  )
}
