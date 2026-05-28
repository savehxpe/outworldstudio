"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useAppStore } from "@/store/use-app-store"
import { cn, formatCredits } from "@/lib/utils"
import { useState } from "react"
import type { Tier } from "@/types"

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/studio", label: "Engine" },
  { href: "/projects", label: "Library" },
  { href: "/remix-lab", label: "Remix" },
  { href: "/pricing", label: "Pricing" },
]

const tierBadge: Record<Tier, { label: string; color: string }> = {
  free: { label: "Free", color: "text-outline border-outline/30" },
  hobby: { label: "Hobby", color: "text-primary border-primary/40" },
  pro: { label: "Pro", color: "text-primary border-primary" },
  studio: { label: "Studio", color: "text-secondary border-secondary/60" },
}

export function Navbar() {
  const pathname = usePathname()
  const { user, toggleSidebar, sidebarOpen } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (pathname === "/") return null

  const tier = (user?.tier ?? "free") as Tier
  const badge = tierBadge[tier]

  return (
    <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 h-16 bg-surface/60 backdrop-blur-xl border-b border-white/10 shadow-[0_0_15px_rgba(0,219,233,0.1)]">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="font-display text-primary tracking-tighter text-2xl md:text-3xl leading-none font-bold">
          OUTWORLD
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-xs tracking-[0.1em] uppercase font-mono transition-all hover:text-primary",
              pathname === link.href
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-on-surface-variant"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full border",
              badge.color
            )}>
              {badge.label}
            </span>
            <Link
              href="/pricing"
              className="text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
            >
              {formatCredits(user.credits ?? 0)} cr
            </Link>
            <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-outline-variant/30">
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary-container/30 flex items-center justify-center text-xs font-mono text-primary">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </div>
        ) : (
          <Link
            href="/pricing"
            className="text-xs font-mono tracking-wider uppercase text-primary border border-primary/30 px-4 py-2 rounded hover:bg-primary/10 transition-colors"
          >
            Get Started
          </Link>
        )}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-16 left-0 w-full glass-panel md:hidden"
        >
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-sm font-mono tracking-wider uppercase py-2",
                  pathname === link.href ? "text-primary" : "text-on-surface-variant"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  )
}
