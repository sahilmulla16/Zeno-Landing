import { describe, expect, it } from 'vitest'
import { parseCampaign } from './analytics/campaign'
import { isValidEmail, normalizeEmail } from './validation'

describe('email validation', () => {
  it('normalizes case and whitespace', () => {
    expect(normalizeEmail('  Sahil@Example.COM ')).toBe('sahil@example.com')
  })
  it('accepts valid and rejects invalid addresses', () => {
    expect(isValidEmail('a@b.co')).toBe(true)
    expect(isValidEmail('no-at-sign')).toBe(false)
    expect(isValidEmail('a@b')).toBe(false)
    expect(isValidEmail('a b@c.com')).toBe(false)
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail(`${'x'.repeat(250)}@b.com`)).toBe(false)
  })
})

describe('campaign parsing', () => {
  it('reads utm params and derives source', () => {
    const c = parseCampaign('?utm_source=instagram&utm_medium=reel&utm_campaign=launch&utm_content=post42', '')
    expect(c).toMatchObject({ source: 'instagram', utm_medium: 'reel', utm_campaign: 'launch', utm_content: 'post42', content_id: 'post42' })
  })
  it('falls back to referrer host, then direct', () => {
    expect(parseCampaign('', 'https://news.example.org/a').source).toBe('news.example.org')
    expect(parseCampaign('', '').source).toBe('direct')
  })
})
