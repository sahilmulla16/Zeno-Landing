import { beforeEach, describe, expect, it } from 'vitest'
import {
  getOnboardedEmails,
  hasCompletedOnboarding,
  markOnboardingCompleted,
} from './onboardingStorage'

class LocalStorageMock {
  private store: Record<string, string> = {}
  clear() {
    this.store = {}
  }
  getItem(key: string) {
    return this.store[key] ?? null
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value)
  }
  removeItem(key: string) {
    delete this.store[key]
  }
}

const mockStorage = new LocalStorageMock()
// @ts-expect-error Mocking window / localStorage in node environment
globalThis.window = { location: { origin: 'https://zeno.app' } }
// @ts-expect-error Mocking localStorage
globalThis.localStorage = mockStorage

describe('onboardingStorage', () => {
  beforeEach(() => {
    mockStorage.clear()
  })

  it('starts with an empty onboarded list', () => {
    expect(getOnboardedEmails()).toEqual([])
    expect(hasCompletedOnboarding('user@example.com')).toBe(false)
  })

  it('marks an email as completed and normalizes casing/whitespace', () => {
    markOnboardingCompleted('  Test.User@Gmail.COM ')
    expect(hasCompletedOnboarding('test.user@gmail.com')).toBe(true)
    expect(hasCompletedOnboarding('TEST.USER@GMAIL.COM')).toBe(true)
    expect(hasCompletedOnboarding('other@gmail.com')).toBe(false)
  })

  it('does not duplicate emails in localStorage', () => {
    markOnboardingCompleted('user@gmail.com')
    markOnboardingCompleted('USER@GMAIL.COM')
    expect(getOnboardedEmails()).toEqual(['user@gmail.com'])
  })
})
