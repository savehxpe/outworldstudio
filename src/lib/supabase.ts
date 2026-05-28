import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

let _supabase: ReturnType<typeof createClient<Database>> | null = null
let _supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null

export function getSupabase() {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
    }
    _supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
    }
    _supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return _supabaseAdmin
}
