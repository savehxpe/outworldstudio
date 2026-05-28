"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MoreHorizontal, Music, Play, Trash2 } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const projects = [
  { id: "1", title: "Summer Heat Remix", status: "completed", date: "May 28, 2026", stems: 4, duration: "3:24" },
  { id: "2", title: "Vocal Isolation - Track 3", status: "completed", date: "May 27, 2026", stems: 2, duration: "4:12" },
  { id: "3", title: "Podcast Cleanup Ep.42", status: "processing", date: "May 26, 2026", stems: 3, duration: "28:15" },
  { id: "4", title: "Bassline Extraction", status: "completed", date: "May 25, 2026", stems: 1, duration: "2:08" },
  { id: "5", title: "Acoustic Stem Pack Vol 1", status: "completed", date: "May 20, 2026", stems: 8, duration: "12:44" },
  { id: "6", title: "Vocal Harmonies Split", status: "completed", date: "May 18, 2026", stems: 6, duration: "5:30" },
  { id: "7", title: "Live Recording Cleanup", status: "failed", date: "May 15, 2026", stems: 0, duration: "—" },
  { id: "8", title: "Beat Separation - Loop 1", status: "completed", date: "May 12, 2026", stems: 4, duration: "1:45" },
]

export default function ProjectsPage() {
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
            Project Library
          </h1>
          <p className="text-on-surface-variant">All your processed audio projects.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/projects/${project.id}`}>
                <Card className="glass-panel border-0 p-5 hover:glass-panel-active transition-all duration-300 group cursor-pointer h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(0,219,233,0.2)] transition-all">
                        <Music className="w-5 h-5 text-primary" />
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-surface-container">
                        <MoreHorizontal className="w-4 h-4 text-on-surface-variant" />
                      </button>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm font-display text-on-surface mb-1 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs font-mono text-outline">{project.date}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-mono px-1.5 py-0 ${
                            project.status === "completed"
                              ? "border-green-500/30 text-green-500"
                              : project.status === "processing"
                              ? "border-primary/30 text-primary"
                              : "border-red-500/30 text-red-500"
                          }`}
                        >
                          {project.status}
                        </Badge>
                        <span className="text-xs font-mono text-outline">{project.stems} stems</span>
                      </div>
                      {project.status === "completed" && (
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Play className="w-3 h-3 text-primary ml-0.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </>
  )
}
