"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles, Layers, MicOff, Shuffle, Waves, Shield, Zap } from "lucide-react"

const features = [
  {
    icon: Layers,
    title: "Hyper-Spectral Stem Extraction",
    desc: "Isolate drums, bass, vocals, and harmonic elements with zero phase-cancellation artifacts.",
    sys: "SYS.NODE.01",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    icon: MicOff,
    title: "Phase-Aligned Vocal Suppression",
    desc: "Surgically remove dialogue or lead vocals while leaving ambient room tone perfectly intact.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/20",
  },
  {
    icon: Shuffle,
    title: "Generative Re-Synthesis",
    desc: "Feed isolated stems into the synthesizer module to generate new harmonic variations.",
    color: "text-surface-tint",
    bgColor: "bg-surface-tint/10",
    borderColor: "border-surface-tint/20",
  },
  {
    icon: Zap,
    title: "Neural Processing Grid",
    desc: "Distributed AI compute clusters for real-time audio processing at unprecedented speeds.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    desc: "End-to-end encrypted audio processing with zero retention policies on source material.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/20",
  },
  {
    icon: Waves,
    title: "Real-Time Waveform Analytics",
    desc: "Visualize frequency spectra, phase correlation, and dynamic range with precision tools.",
    color: "text-surface-tint",
    bgColor: "bg-surface-tint/10",
    borderColor: "border-surface-tint/20",
  },
]

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-8 pt-24"
      >
        <CanvasVisualizer />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-primary uppercase animate-subtle-pulse">
              Engine v4.2 Online
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display text-on-surface mb-6 drop-shadow-[0_0_30px_rgba(0,219,233,0.15)] leading-tight font-bold tracking-tighter"
          >
            ISOLATE{" "}
            <span className="text-primary opacity-90">THE INFINITE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg text-on-surface-variant max-w-2xl mb-12 leading-relaxed"
          >
            High-fidelity spatial audio manipulation powered by neural networks.
            Extract stems, remove artifacts, and rebuild your cinematic soundscapes
            with unprecedented precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <Link
              href="/studio"
              className="group bg-primary text-background font-mono text-xs tracking-widest uppercase px-8 py-4 rounded hover:shadow-[0_0_20px_rgba(0,219,233,0.4)] transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
            >
              Initialize Engine
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="border border-outline-variant text-on-surface hover:text-primary hover:border-primary font-mono text-xs tracking-widest uppercase px-8 py-4 rounded bg-surface/30 backdrop-blur-sm transition-all duration-300"
            >
              View Pricing
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="px-8 py-32 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-display text-on-surface mb-3 font-semibold tracking-tight">
              Architectural Audio Control.
            </h2>
            <p className="text-on-surface-variant">
              Modular processing nodes for absolute sonic authority.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-panel rounded-xl p-8 relative overflow-hidden group hover:glass-panel-active transition-all duration-500 ${
                  i === 0 || i === 3
                    ? "md:col-span-8"
                    : "md:col-span-4"
                }`}
              >
                <div className="inner-glow" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between mb-8">
                    <div className={`p-3 rounded-lg border ${feature.borderColor} ${feature.bgColor} group-hover:shadow-[0_0_15px_rgba(0,219,233,0.3)] transition-all`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <span className="text-xs font-mono text-outline">{feature.sys || `SYS.NODE.0${i + 1}`}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-display text-on-surface mb-3 font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed max-w-md">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="px-8 py-32 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-secondary-container/10 via-background to-background pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display text-on-surface mb-4 font-semibold tracking-tight">
              Compute-Based Processing.
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              No subscriptions. No artificial limits. Purchase compute credits and
              allocate them directly to heavy neural processing tasks.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-xl p-1 md:p-2 border border-outline-variant/30"
          >
            <div className="bg-surface-container-low rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <span className="text-xs font-mono tracking-widest text-on-surface uppercase">
                    Standard Grid
                  </span>
                </div>
                <div className="text-5xl md:text-6xl font-display text-on-surface mb-2 font-bold tracking-tighter">
                  $49 <span className="text-2xl font-display text-on-surface-variant">/ 500 cr</span>
                </div>
                <p className="text-sm font-mono text-outline-variant">
                  ~100 minutes of stem extraction
                </p>
              </div>
              <div className="w-full md:w-px h-px md:h-32 bg-outline-variant/30" />
              <div className="flex flex-col gap-4 w-full md:w-auto">
                <Link
                  href="/pricing"
                  className="bg-on-surface text-background font-mono text-xs tracking-widest uppercase px-8 py-4 rounded hover:bg-primary transition-colors text-center"
                >
                  Purchase Node
                </Link>
                <div className="flex items-center justify-center gap-2 text-outline text-xs font-mono">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Encrypted transaction</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex justify-between items-center px-8 py-4 bg-surface-container-high/90 backdrop-blur-lg border-t border-primary/20">
        <div className="text-xs font-mono tracking-wider text-on-surface uppercase">
          &copy; 2124 OUTWORLD AUDIO SYSTEMS.
        </div>
        <div className="hidden md:flex gap-6">
          <span className="text-xs font-mono text-on-surface-variant hover:text-primary transition-all cursor-pointer">Terms</span>
          <span className="text-xs font-mono text-on-surface-variant hover:text-primary transition-all cursor-pointer">Privacy</span>
          <span className="text-xs font-mono text-on-surface-variant hover:text-primary transition-all cursor-pointer">API</span>
          <span className="text-xs font-mono text-on-surface-variant hover:text-primary transition-all cursor-pointer">Docs</span>
        </div>
      </footer>

      <div className="h-8 bg-background" />
    </div>
  )
}

function CanvasVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const c: CanvasRenderingContext2D = ctx

    let width = 0
    let height = 0
    const particles: { x: number; h: number; speed: number; dir: number }[] = []

    function resize() {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resize)
    resize()

    const numBars = Math.floor(width / 15)
    for (let i = 0; i < numBars; i++) {
      particles.push({
        x: i * 15,
        h: Math.random() * (height * 0.4),
        speed: 0.2 + Math.random() * 0.5,
        dir: Math.random() > 0.5 ? 1 : -1,
      })
    }

    function draw() {
      c.clearRect(0, 0, width, height)
      c.globalCompositeOperation = "lighter"

      particles.forEach((p) => {
        p.h += p.speed * p.dir
        if (p.h > height * 0.5 || p.h < 10) p.dir *= -1

        const gradient = c.createLinearGradient(0, height, 0, height - p.h)
        gradient.addColorStop(0, "rgba(219, 252, 255, 0.05)")
        gradient.addColorStop(1, "rgba(220, 184, 255, 0.2)")

        c.beginPath()
        c.moveTo(p.x, height)
        c.lineTo(p.x, height - p.h)
        c.strokeStyle = gradient
        c.lineWidth = 2
        c.stroke()

        c.fillStyle = "rgba(219, 252, 255, 0.4)"
        c.fillRect(p.x - 1, height - p.h, 4, 2)
      })

      requestAnimationFrame(draw)
    }

    draw()
    return () => window.removeEventListener("resize", resize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30 z-0"
    />
  )
}
