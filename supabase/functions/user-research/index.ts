// Supabase Edge Function (Deno): secure user research & feedback submission.
// Deploy: supabase functions deploy user-research
// Secrets: supabase secrets set WAITLIST_IP_SALT=... ALLOWED_ORIGINS=https://your.site,http://localhost:5173

import { createClient } from 'npm:@supabase/supabase-js@2'

// Generous rate limit specifically for multi-step research submissions
const RATE_MAX = 60
const RATE_WINDOW_SECONDS = 600

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

  // Honeypot check
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return json(req, 200, { ok: true, status: 'saved' })
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  })

  // Hash IP with distinct research salt namespace so it doesn't exhaust waitlist signup limit
  const ip =
    req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const ipHash = await sha256(`research:${Deno.env.get('WAITLIST_IP_SALT') ?? 'zeno'}:${ip}`)

  // Rate limiting check
  const { data: allowedByLimit, error: rlError } = await supabase.rpc('waitlist_check_rate_limit', {
    p_ip_hash: ipHash,
    p_max: RATE_MAX,
    p_window_seconds: RATE_WINDOW_SECONDS,
  })
  if (rlError) {
    console.error('rate limit error', rlError.message)
    // Non-fatal fallback for research to prevent dropping user answers
  }
  if (allowedByLimit === false) {
    return json(req, 429, { ok: false, error: 'Too many requests. Please wait a moment.' })
  }

  const signupId = str(body.signup_id, 50)
  const email = str(body.email, 254)?.toLowerCase()
  const primaryPainPoint = str(body.primary_pain_point, 120)
  const primaryPainOther = str(body.primary_pain_other, 200)
  const currentTrackingMethod = str(body.current_tracking_method, 120)
  const desiredOutcome = str(body.desired_outcome, 120)
  const featureSuggestion = str(body.feature_suggestion, 500)
  const featureContactConsent = body.feature_contact_consent === true
  const isCompleted = body.research_completed === true

  if (!email && !signupId) {
    return json(req, 422, { ok: false, error: 'Either email or signup_id is required.' })
  }

  const now = new Date().toISOString()

  // 1. Check if a research entry already exists for this signupId or email
  let existingId: string | null = null

  if (signupId) {
    const { data } = await supabase
      .from('user_research')
      .select('id')
      .eq('signup_id', signupId)
      .maybeSingle()
    if (data) existingId = data.id
  }

  if (!existingId && email) {
    const { data } = await supabase
      .from('user_research')
      .select('id')
      .ilike('email', email)
      .maybeSingle()
    if (data) existingId = data.id
  }

  if (existingId) {
    // 2. UPDATE existing record — ONLY update fields that are provided, NEVER overwrite with null!
    const updateData: Record<string, unknown> = {
      updated_at: now,
      ip_hash: ipHash,
    }

    if (signupId) updateData.signup_id = signupId
    if (email) updateData.email = email
    if (primaryPainPoint !== null) updateData.primary_pain_point = primaryPainPoint
    if (primaryPainOther !== null) updateData.primary_pain_other = primaryPainOther
    if (currentTrackingMethod !== null) updateData.current_tracking_method = currentTrackingMethod
    if (desiredOutcome !== null) updateData.desired_outcome = desiredOutcome
    if (featureSuggestion !== null) updateData.feature_suggestion = featureSuggestion
    if (body.feature_contact_consent !== undefined) {
      updateData.feature_contact_consent = featureContactConsent
      if (featureContactConsent) updateData.feature_contact_consent_at = now
    }
    if (isCompleted) {
      updateData.research_completed_at = now
    }

    const { error: updateError } = await supabase
      .from('user_research')
      .update(updateData)
      .eq('id', existingId)

    if (updateError) {
      console.error('user research update error', updateError.code, updateError.message)
      return json(req, 500, { ok: false, error: 'Failed to update research responses.' })
    }
  } else {
    // 3. INSERT new record
    const insertData = {
      signup_id: signupId || null,
      email: email || null,
      primary_pain_point: primaryPainPoint,
      primary_pain_other: primaryPainOther,
      current_tracking_method: currentTrackingMethod,
      desired_outcome: desiredOutcome,
      feature_suggestion: featureSuggestion,
      feature_contact_consent: featureContactConsent,
      feature_contact_consent_at: featureContactConsent ? now : null,
      research_completed_at: isCompleted ? now : null,
      created_at: now,
      updated_at: now,
      ip_hash: ipHash,
    }

    const { error: insertError } = await supabase.from('user_research').insert(insertData)

    if (insertError) {
      // If unique constraint or race condition on email occurred, fall back to update
      if (email) {
        const fallbackUpdate: Record<string, unknown> = { updated_at: now }
        if (primaryPainPoint !== null) fallbackUpdate.primary_pain_point = primaryPainPoint
        if (currentTrackingMethod !== null) fallbackUpdate.current_tracking_method = currentTrackingMethod
        if (desiredOutcome !== null) fallbackUpdate.desired_outcome = desiredOutcome
        if (featureSuggestion !== null) fallbackUpdate.feature_suggestion = featureSuggestion
        if (signupId) fallbackUpdate.signup_id = signupId

        await supabase.from('user_research').update(fallbackUpdate).ilike('email', email)
      } else {
        console.error('user research insert error', insertError.code, insertError.message)
        return json(req, 500, { ok: false, error: 'Failed to record research responses.' })
      }
    }
  }

  // 4. Also mirror responses to waitlist_signups if signupId or email is known
  try {
    const researchSummary: Record<string, unknown> = {}
    if (primaryPainPoint) researchSummary.primary_pain_point = primaryPainPoint
    if (currentTrackingMethod) researchSummary.current_tracking_method = currentTrackingMethod
    if (desiredOutcome) researchSummary.desired_outcome = desiredOutcome
    if (featureSuggestion) researchSummary.feature_suggestion = featureSuggestion

    if (Object.keys(researchSummary).length > 0) {
      if (signupId) {
        await supabase
          .from('waitlist_signups')
          .update({ research_responses: researchSummary })
          .eq('id', signupId)
      } else if (email) {
        await supabase
          .from('waitlist_signups')
          .update({ research_responses: researchSummary })
          .eq('email_normalized', email)
      }
    }
  } catch (err) {
    console.error('waitlist mirror error (non-fatal)', err)
  }

  return json(req, 200, { ok: true, status: 'saved' })
})
