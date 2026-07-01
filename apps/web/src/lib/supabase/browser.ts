'use client'

import { createClient as supabaseCreateClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function createClient(): SupabaseClient | null {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (typeof url !== 'string' || url.length === 0 || typeof key !== 'string' || key.length === 0) {
    return null
  }

  client = supabaseCreateClient(url, key, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  })
  return client
}
