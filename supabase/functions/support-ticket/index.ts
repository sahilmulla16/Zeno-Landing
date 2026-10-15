// Supabase Edge Function (Deno): secure support ticket submission.
// Deploy: supabase functions deploy support-ticket
// Secrets: supabase secrets set WAITLIST_IP_SALT=... ALLOWED_ORIGINS=https://your.site,http://localhost:5173

import { createClient } from 'npm:@supabase/supabase-js@2'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const RATE_MAX = 5 // maximum 5 tickets per 10-minute window per IP
const RATE_WINDOW_SECONDS = 600

const VALID_CATEGORIES = new Set([
  'general',
  'bug_report',
  'smart_autotrack',
  'quick_add',
  'privacy_data',
  'beta_feedback',
])

const allowed = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

function cors(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? ''
  const ok = allowed.length === 0 || allowed.includes(origin)
  return {
    'Access-Control-Allow-Origin': ok ? (allowed.length === 0 ? '*' : origin) : 'null',
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
  if (allowed.length > 0 && !allowed.includes(origin)) return json(req, 403, { ok: false, error: 'Forbidden' })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json(req, 400, { ok: false, error: 'Invalid JSON request payload.' })
  }

  // Honeypot field
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return json(req, 200, { ok: true, status: 'received' })
  }

  const email = str(body.email, 254)?.toLowerCase() ?? ''
  if (!email || !EMAIL_RE.test(email)) {
    return json(req, 422, { ok: false, error: 'Please enter a valid email address.' })
  }

  const category = str(body.category, 50) ?? 'general'
  if (!VALID_CATEGORIES.has(category)) {
    return json(req, 422, { ok: false, error: 'Invalid request category.' })
  }

  const subject = str(body.subject, 200)
  if (!subject || subject.length < 3) {
    return json(req, 422, { ok: false, error: 'Subject must be at least 3 characters.' })
  }

  const message = str(body.message, 5000)
  if (!message || message.length < 10) {
    return json(req, 422, { ok: false, error: 'Message must be at least 10 characters long.' })
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  })

  const ip =
    req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const ipHash = await sha256(`${Deno.env.get('WAITLIST_IP_SALT') ?? 'zeno'}:${ip}`)

  // Rate limiting check
  const { data: allowedByLimit, error: rlError } = await supabase.rpc('waitlist_check_rate_limit', {
    p_ip_hash: ipHash,
    p_max: RATE_MAX,
    p_window_seconds: RATE_WINDOW_SECONDS,
  })
  if (rlError) {
    console.error('rate limit error', rlError.message)
    return json(req, 500, { ok: false, error: 'Server error checking rate limits.' })
  }
  if (allowedByLimit === false) {
    return json(req, 429, { ok: false, error: 'Too many requests. Please wait a few minutes before submitting again.' })
  }

  const { data, error } = await supabase
    .from('support_tickets')
    .insert({
      email,
      category,
      subject,
      message,
      device_info: str(body.device_info, 200),
      app_version: str(body.app_version, 100),
      feature: str(body.feature, 100),
      ip_hash: ipHash,
      user_agent: str(req.headers.get('user-agent'), 300),
    })
    .select('id')
    .single()

  if (error) {
    console.error('support ticket insert error', error.code, error.message)
    return json(req, 500, { ok: false, error: 'Failed to record support ticket. Please try again later.' })
  }

  return json(req, 200, { ok: true, status: 'received', ticketId: data?.id })
})

