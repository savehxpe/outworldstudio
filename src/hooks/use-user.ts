"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { useAppStore } from "@/store/use-app-store"

export function useUser() {
  const { user, setUser } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const supabase = getSupabase()

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()
            .then(({ data }) => {
              if (data) setUser(data)
            })
        }
        setLoading(false)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()
            .then(({ data }) => {
              if (data) setUser(data)
            })
        } else {
          setUser(null)
        }
      })

      return () => subscription.unsubscribe()
    } catch {
      setLoading(false)
    }
  }, [setUser])

  return { user, loading }
}
