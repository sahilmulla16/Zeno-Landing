import { site } from '../../config/site'
import { getCampaign } from '../analytics/campaign'
import { isValidEmail, normalizeEmail } from '../validation'

export type WaitlistErrorKind = 'invalid' | 'rate_limited' | 'not_configured' | 'network' | 'server'

export class WaitlistError extends Error {
  kind: WaitlistErrorKind
  constructor(kind: WaitlistErrorKind, message: string) {
    super(message)
    this.name = 'WaitlistError'
    this.kind = kind
  }
}

export interface WaitlistInput {
  email: string
  consent: boolean
  /** Optional research answer, e.g. what the visitor most wants Zeno to help with. */
  primaryGoal?: string
  /** Honeypot — real users never fill this. */
  website?: string
}

export type WaitlistResult = 'created' | 'already_registered'

/**
 * Posts to the `waitlist-signup` Edge Function. The browser never talks to the table directly
 * (RLS denies everything to anon) and never holds a service-role key.
 * Resolves ONLY when the backend confirms the write.
 */
export async function submitWaitlist(input: WaitlistInput): Promise<WaitlistResult> {
  const email = normalizeEmail(input.email)
  if (!isValidEmail(email)) throw new WaitlistError('invalid', 'Please enter a valid email address.')
  if (!input.consent) throw new WaitlistError('invalid', 'Please confirm you agree to be emailed.')
  if (!site.waitlist.endpoint) {
    throw new WaitlistError('not_configured', 'The waitlist is not connected yet. Please try again later.')
  }

  const campaign = getCampaign()
  const body = {
    email,
    consent_marketing: true,
    website: input.website ?? '',
    source: campaign.source,
    utm_source: campaign.utm_source,
    utm_medium: campaign.utm_medium,
    utm_campaign: campaign.utm_campaign,
    utm_content: campaign.utm_content,
    content_id: campaign.content_id,
    referrer: campaign.referrer,
    research_responses: input.primaryGoal ? { primary_goal: input.primaryGoal } : {},
  }

  let res: Response
  try {
    res = await fetch(site.waitlist.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(site.waitlist.anonKey
          ? { apikey: site.waitlist.anonKey, Authorization: `Bearer ${site.waitlist.anonKey}` }
          : {}),
      },
      body: JSON.stringify(body),
    })
  } catch {
    throw new WaitlistError('network', 'Network error. Check your connection and try again.')
  }

  let data: { ok?: boolean; status?: string; error?: string } = {}
  try {
    data = (await res.json()) as typeof data
  } catch {
    /* non-JSON error body */
  }

  if (res.status === 429) throw new WaitlistError('rate_limited', 'Too many attempts. Please wait a few minutes.')
  if (res.status === 400 || res.status === 422) {
    throw new WaitlistError('invalid', data.error ?? 'Please check your details and try again.')
  }
  if (!res.ok || !data.ok) throw new WaitlistError('server', 'Something went wrong on our side. Please try again.')

  return data.status === 'already_registered' ? 'already_registered' : 'created'
}
