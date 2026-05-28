"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export function useAudioPlayer(url?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (!url) return
    const audio = new Audio(url)
    audioRef.current = audio

    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration))
    audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime))
    audio.addEventListener("ended", () => setIsPlaying(false))

    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [url])

  const play = useCallback(() => {
    audioRef.current?.play().then(() => setIsPlaying(true)).catch(console.error)
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  return { isPlaying, currentTime, duration, play, pause, toggle, seek }
}
