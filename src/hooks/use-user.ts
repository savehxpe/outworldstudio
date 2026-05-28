"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { useAppStore } from "@/store/use-app-store"
import type { User } from "@/types"

function mapUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: (row.email as string) ?? "",
    name: (row.name as string) ?? undefined,
    avatarUrl: (row.avatar_url as string) ?? undefined,
    credits: row.credits as number,
    stripeCustomerId: (row.stripe_customer_id as string) ?? undefined,
    tier: (row.tier as User["tier"]) ?? "free",
    stripeSubscriptionId: (row.stripe_subscription_id as string) ?? undefined,
    trialEndsAt: (row.trial_ends_at as string) ?? undefined,
    subscriptionStatus: (row.subscription_status as string) ?? undefined,
    monthlyCredits: (row.monthly_credits as number) ?? 0,
  }
}

export function useUser() {
  const { user, setUser } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setUser(mapUser(data as unknown as Record<string, unknown>))
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
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
            if (data) setUser(mapUser(data as unknown as Record<string, unknown>))
          })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return { user, loading }
}
