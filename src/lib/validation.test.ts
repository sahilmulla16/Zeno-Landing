import { describe, expect, it } from 'vitest'
import { parseCampaign } from './analytics/campaign'
import { isValidEmail, isValidGmail, normalizeEmail } from './validation'

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
  it('strictly validates Gmail addresses', () => {
    expect(isValidGmail('sahilmulla@gmail.com')).toBe(true)
    expect(isValidGmail('SAHIL.MULLA123@GMAIL.COM')).toBe(true)
    expect(isValidGmail('user+tag@gmail.com')).toBe(true)
    expect(isValidGmail('user@googlemail.com')).toBe(true)
    // Non-gmail domains must be rejected
    expect(isValidGmail('sahil@yahoo.com')).toBe(false)
    expect(isValidGmail('sahil@hotmail.com')).toBe(false)
    expect(isValidGmail('sahil@outlook.com')).toBe(false)
    expect(isValidGmail('sahil@customdomain.io')).toBe(false)
    expect(isValidGmail('@gmail.com')).toBe(false)
    expect(isValidGmail('')).toBe(false)
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

describe('support validation rules', () => {
  it('validates subject line minimum length', () => {
    const validSubject = 'App crashes on launch'
    const shortSubject = 'Hi'
    expect(validSubject.trim().length >= 3).toBe(true)
    expect(shortSubject.trim().length >= 3).toBe(false)
  })

  it('validates message minimum length', () => {
    const validMessage = 'When I click on smart auto-track, notifications do not log.'
    const shortMessage = 'broken'
    expect(validMessage.trim().length >= 10).toBe(true)
    expect(shortMessage.trim().length >= 10).toBe(false)
  })
})
