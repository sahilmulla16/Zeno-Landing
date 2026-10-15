/**
 * Lightweight, privacy-respecting event tracking for the user research onboarding journey.
 * Strictly adheres to privacy constraints: NO emails, NO free-text responses, NO transaction details.
 */

export type ResearchEvent =
  | 'waitlist_signup_success'
  | 'research_invitation_viewed'
  | 'research_started'
  | 'research_question_answered'
  | 'research_question_skipped'
  | 'research_completed'
  | 'feature_suggestion_submitted'
  | 'feature_suggestion_skipped'
  | 'research_contact_consent_given'

export interface EventProperties {
  step?: number
  questionId?: string
  optionKey?: string
  hasCustomText?: boolean
  durationMs?: number
  skipped?: boolean
  source?: string
  status?: string
  hasSuggestion?: boolean
  consentGiven?: boolean
}

export function trackResearchEvent(event: ResearchEvent, properties: EventProperties = {}) {
  // Non-blocking, safe client telemetry
  try {
    const payload = {
      event,
      timestamp: new Date().toISOString(),
      properties,
    }

    // In local dev or production, log cleanly
    if (import.meta.env.DEV) {
      console.log(`[Zeno Research Analytics] ${event}:`, properties)
    }

    // Dispatch custom browser event for any existing analytics listener
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('zeno:analytics', { detail: payload }))
    }
  } catch {
    // Analytics must never block user flow or crash execution
  }
}
