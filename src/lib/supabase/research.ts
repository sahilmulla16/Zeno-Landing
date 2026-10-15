import { site } from '../../config/site'

export interface ResearchSubmission {
  signupId?: string
  email?: string
  primaryPainPoint?: string
  primaryPainOther?: string
  currentTrackingMethod?: string
  desiredOutcome?: string
  featureSuggestion?: string
  featureContactConsent?: boolean
  researchCompleted?: boolean
  website?: string // Honeypot
}

export interface ResearchResult {
  ok: boolean
  status: 'saved' | 'stored_offline'
}

const STORAGE_KEY = 'zeno_user_research_backup'

/**
 * Posts to the `user-research` Edge Function.
 * Idempotently links feedback to the signup record via `signupId` or email.
 * If network or endpoint is unavailable, safely preserves answers locally so progress is not lost.
 */
export async function submitUserResearch(data: ResearchSubmission): Promise<ResearchResult> {
  // Always back up progress locally in case of network issues
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* ignore storage errors */
  }

  if (!site.research.endpoint) {
    return { ok: true, status: 'stored_offline' }
  }

  const payload = {
    signup_id: data.signupId || null,
    email: data.email ? data.email.trim().toLowerCase() : null,
    primary_pain_point: data.primaryPainPoint || null,
    primary_pain_other: data.primaryPainOther?.trim() || null,
    current_tracking_method: data.currentTrackingMethod || null,
    desired_outcome: data.desiredOutcome || null,
    feature_suggestion: data.featureSuggestion?.trim() || null,
    feature_contact_consent: data.featureContactConsent === true,
    research_completed: data.researchCompleted === true,
    website: data.website || '',
  }

  try {
    const res = await fetch(site.research.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(site.waitlist.anonKey
          ? { apikey: site.waitlist.anonKey, Authorization: `Bearer ${site.waitlist.anonKey}` }
          : {}),
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.warn(`Research submission server response [${res.status}]:`, errText)
      throw new Error(`Server returned ${res.status}`)
    }

    const json = (await res.json()) as { ok?: boolean }
    if (json.ok) {
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        /* ignore */
      }
      return { ok: true, status: 'saved' }
    }
    throw new Error('Response did not indicate success')
  } catch (err) {
    console.warn('Research submit fallback to offline store:', err)
    return { ok: true, status: 'stored_offline' }
  }
}
