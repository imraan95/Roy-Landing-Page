import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Server-side only. Uses the anon key deliberately, not the service role key —
// the signups table's Row Level Security policy only allows INSERT for the
// anon role, so even if this key were ever exposed it can't be used to read,
// update, or delete leads. See supabase/schema.sql.
export function getSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  })
}
