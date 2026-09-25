import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: { email?: string; source?: string; company_website?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const email = (body.email || '').trim().toLowerCase()
  const source = body.source === 'footer' ? 'footer' : 'hero'

  // Honeypot: a hidden field real visitors never fill in. If it has a value,
  // silently pretend success so the bot doesn't learn to look elsewhere.
  if (body.company_website) {
    return NextResponse.json({ ok: true })
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Enter a valid work email.' }, { status: 400 })
  }

  const supabase = getSupabaseServerClient()
  if (!supabase) {
    console.error('Supabase env vars are not set — see .env.example')
    return NextResponse.json({ error: 'Signup is not configured yet.' }, { status: 500 })
  }

  const { error } = await supabase.from('signups').insert({
    email,
    source,
    user_agent: request.headers.get('user-agent') || null,
  })

  if (error) {
    // Unique violation = already on the list; treat as success, not an error.
    if (error.code === '23505') {
      return NextResponse.json({ ok: true, already: true })
    }
    console.error('Supabase insert failed:', error)
    return NextResponse.json({ error: "Couldn't save that just now. Please try again." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
