// Supabase Edge Function (Deno): secure, server-side waitlist insert.
// Deploy: supabase functions deploy waitlist-signup
// Secrets: supabase secrets set WAITLIST_IP_SALT=... ALLOWED_ORIGINS=https://your.site,http://localhost:5173
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided to Edge Functions automatically.

import { createClient } from 'npm:@supabase/supabase-js@2'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const GMAIL_RE = /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@(gmail|googlemail)\.com$/i
const RATE_MAX = 5 // signups per window per IP
const RATE_WINDOW_SECONDS = 600

const allowed = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

function isOriginAllowed(origin: string): boolean {
  if (!origin) return true
  if (allowed.length === 0 || allowed.includes('*')) return true
  if (allowed.includes(origin)) return true
  if (origin.endsWith('.vercel.app')) return true
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return true
  return false
}

function cors(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? ''
  const ok = isOriginAllowed(origin)
  return {
    'Access-Control-Allow-Origin': ok ? (origin || '*') : '*',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  }
}

function json(req: Request, status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(req), 'Content-Type': 'application/json' },
  })
}

const str = (v: unknown, max: number): string | null =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(req) })
  if (req.method !== 'POST') return json(req, 405, { ok: false, error: 'Method not allowed' })

  const origin = req.headers.get('origin') ?? ''
  if (!isOriginAllowed(origin)) return json(req, 403, { ok: false, error: 'Forbidden' })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json(req, 400, { ok: false, error: 'Invalid request.' })
  }

  // Honeypot: pretend success so bots learn nothing, but store nothing.
  if (typeof body.website === 'string' && body.website.trim() !== '') return json(req, 200, { ok: true, status: 'created' })

  const email = str(body.email, 254)?.toLowerCase() ?? ''
  if (!email || !EMAIL_RE.test(email) || !GMAIL_RE.test(email)) {
    return json(req, 422, { ok: false, error: 'Please enter a valid Gmail address (@gmail.com).' })
  }
  if (body.consent_marketing !== true) return json(req, 422, { ok: false, error: 'Consent is required to join the waitlist.' })

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  })

  const ip =
    req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const ipHash = await sha256(`${Deno.env.get('WAITLIST_IP_SALT') ?? 'zeno'}:${ip}`)

  const { data: allowedByLimit, error: rlError } = await supabase.rpc('waitlist_check_rate_limit', {
    p_ip_hash: ipHash,
    p_max: RATE_MAX,
    p_window_seconds: RATE_WINDOW_SECONDS,
  })
  if (rlError) {
    console.warn('rate limit check warning (skipped):', rlError.message)
  } else if (allowedByLimit === false) {
    return json(req, 429, { ok: false, error: 'Too many attempts. Please wait a few minutes.' })
  }

  const research =
    body.research_responses && typeof body.research_responses === 'object' && !Array.isArray(body.research_responses)
      ? { primary_goal: str((body.research_responses as Record<string, unknown>).primary_goal, 120) }
      : {}

  const { data: inserted, error } = await supabase
    .from('waitlist_signups')
    .insert({
      email,
      consent_marketing: true,
      consent_at: new Date().toISOString(),
      source: str(body.source, 120),
      utm_source: str(body.utm_source, 200),
      utm_medium: str(body.utm_medium, 200),
      utm_campaign: str(body.utm_campaign, 200),
      utm_content: str(body.utm_content, 200),
      content_id: str(body.content_id, 200),
      referrer: str(body.referrer, 500),
      research_responses: research,
      ip_hash: ipHash,
      user_agent: str(req.headers.get('user-agent'), 300),
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      const { data: existing } = await supabase
        .from('waitlist_signups')
        .select('id')
        .eq('email_normalized', email)
        .maybeSingle()
      return json(req, 200, { ok: true, status: 'already_registered', signupId: existing?.id })
    }
    if (error.code === '23514') return json(req, 422, { ok: false, error: 'Please check your details and try again.' })
    console.error('insert error', error.code, error.message)
    return json(req, 500, { ok: false, error: 'Server error.' })
  }

  return json(req, 200, { ok: true, status: 'created', signupId: inserted?.id })
})
