const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const GMAIL_RE = /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@(gmail|googlemail)\.com$/i

export const normalizeEmail = (value: string): string => value.trim().toLowerCase()

export function isValidEmail(value: string): boolean {
  const email = normalizeEmail(value)
  return email.length > 0 && email.length <= 254 && EMAIL_RE.test(email)
}

export function isValidGmail(value: string): boolean {
  const email = normalizeEmail(value)
  return isValidEmail(email) && GMAIL_RE.test(email)
}
