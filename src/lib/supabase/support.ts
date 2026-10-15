import { site } from '../../config/site'
import { isValidEmail, normalizeEmail } from '../validation'

export type SupportErrorKind = 'invalid' | 'rate_limited' | 'not_configured' | 'network' | 'server'

export class SupportError extends Error {
  kind: SupportErrorKind
  constructor(kind: SupportErrorKind, message: string) {
    super(message)
    this.name = 'SupportError'
    this.kind = kind
  }
}

export type SupportCategory =
  | 'general'
  | 'bug_report'
  | 'smart_autotrack'
  | 'quick_add'
  | 'privacy_data'
  | 'beta_feedback'

export interface SupportTicketInput {
  email: string
  category: SupportCategory
  subject: string
  message: string
  deviceInfo?: string
  appVersion?: string
  feature?: string
  /** Honeypot — real users never fill this. */
  website?: string
}

export interface SupportResult {
  ok: boolean
  status: 'received'
  ticketId?: string
}

export async function submitSupportTicket(input: SupportTicketInput): Promise<SupportResult> {
  const email = normalizeEmail(input.email)
  if (!isValidEmail(email)) {
    throw new SupportError('invalid', 'Please enter a valid email address.')
  }
  if (!input.subject || input.subject.trim().length < 3) {
    throw new SupportError('invalid', 'Please provide a subject line (minimum 3 characters).')
  }
  if (!input.message || input.message.trim().length < 10) {
    throw new SupportError('invalid', 'Please enter a detailed message (minimum 10 characters).')
  }

  // Check if endpoint is configured
  if (!site.support.endpoint) {
    // If backend endpoint is not yet configured, guide the user gracefully:
    if (site.contactEmail) {
      throw new SupportError(
        'not_configured',
        `The web support endpoint is pending backend deployment. Please email us directly at ${site.contactEmail}.`,
      )
    }
    throw new SupportError(
      'not_configured',
      'The support portal is currently being connected. Please check back shortly or see contact options below.',
    )
  }

  const payload = {
    email,
    category: input.category,
    subject: input.subject.trim(),
    message: input.message.trim(),
    device_info: input.deviceInfo?.trim() || null,
    app_version: input.appVersion?.trim() || null,
    feature: input.feature?.trim() || null,
    website: input.website || '',
  }

  let res: Response
  try {
    res = await fetch(site.support.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(site.waitlist.anonKey
          ? { apikey: site.waitlist.anonKey, Authorization: `Bearer ${site.waitlist.anonKey}` }
          : {}),
      },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new SupportError('network', 'Network connection issue. Please check your internet connection and try again.')
  }

  let data: { ok?: boolean; status?: string; error?: string; ticketId?: string } = {}
  try {
    data = (await res.json()) as typeof data
  } catch {
    /* non-JSON response */
  }

  if (res.status === 429) {
    throw new SupportError('rate_limited', 'Too many requests. Please wait a few minutes before submitting again.')
  }
  if (res.status === 400 || res.status === 422) {
    throw new SupportError('invalid', data.error ?? 'Please check your information and try again.')
  }
  if (!res.ok || !data.ok) {
    throw new SupportError('server', data.error ?? 'Server error processing your ticket. Please try again later.')
  }

  return { ok: true, status: 'received', ticketId: data.ticketId }
}

