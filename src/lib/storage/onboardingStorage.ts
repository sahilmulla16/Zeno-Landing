import { normalizeEmail } from '../validation'

const STORAGE_KEY = 'zeno_onboarded_emails'

/**
 * Retrieves the list of emails that have already completed onboarding
 * or been confirmed as registered in Supabase.
 */
export function getOnboardedEmails(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Checks if a given email is already tracked in localStorage as registered/onboarded.
 */
export function hasCompletedOnboarding(email: string): boolean {
  if (!email) return false
  const normalized = normalizeEmail(email)
  const list = getOnboardedEmails()
  return list.includes(normalized)
}

/**
 * Saves a normalized email to localStorage to prevent duplicate submissions
 * and prohibit re-taking research questions.
 */
export function markOnboardingCompleted(email: string): void {
  if (typeof window === 'undefined' || !email) return
  const normalized = normalizeEmail(email)
  try {
    const list = getOnboardedEmails()
    if (!list.includes(normalized)) {
      list.push(normalized)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    }
  } catch {
    // Graceful fallback for private browsing or quota limits
  }
}

