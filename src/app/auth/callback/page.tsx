"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    try {
      const supabase = getSupabase()
      supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN") {
          router.push("/dashboard")
        }
      })
    } catch {
      router.push("/")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-sm font-mono text-on-surface-variant">Authenticating...</p>
      </div>
    </div>
  )
}
