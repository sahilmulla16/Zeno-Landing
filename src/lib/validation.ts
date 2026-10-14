const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const normalizeEmail = (value: string): string => value.trim().toLowerCase()

export function isValidEmail(value: string): boolean {
  const email = normalizeEmail(value)
  return email.length > 0 && email.length <= 254 && EMAIL_RE.test(email)
}
