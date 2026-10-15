import { useEffect, useState, type FormEvent } from 'react'
import { trackResearchEvent } from '../../lib/analytics/researchEvents'
import {
  hasCompletedOnboarding,
  markOnboardingCompleted,
} from '../../lib/storage/onboardingStorage'
import { submitWaitlist, warmupWaitlist, WaitlistError } from '../../lib/supabase/waitlist'
import { isValidGmail } from '../../lib/validation'
import {
  ArrowRight,
  Check,
  ExternalLink,
  Sparkle,
} from '../ui/Icons'
import { OnboardingModal } from './OnboardingModal'

type Stage = 'input' | 'repeat_screen' | 'confirming'

interface Props {
  variant?: 'panel' | 'compact'
  idPrefix?: string
  onEngagedChange?: (engaged: boolean) => void
}

export function WaitlistForm({ idPrefix = 'cta', onEngagedChange }: Props) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(true)
  const [website, setWebsite] = useState('') // Honeypot
  const [stage, setStage] = useState<Stage>('input')
  const [signupId, setSignupId] = useState<string | undefined>()
  const [isRepeat, setIsRepeat] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [copiedLink, setCopiedLink] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Pre-warm the Edge Function immediately when form mounts
  useEffect(() => {
    warmupWaitlist()
  }, [])

  // Notify parent component when user enters interactive flow
  useEffect(() => {
    const isEngaged = stage !== 'input'
    onEngagedChange?.(isEngaged)
  }, [stage, onEngagedChange])

  const inviteLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}${email ? `?ref=${encodeURIComponent(email.split('@')[0])}` : ''}`
      : 'https://zeno.app'

  function handleCopyInvite() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(inviteLink).then(() => {
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2400)
      })
    }
  }

  // Handle submission with Single-Submission Protection
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    const cleanEmail = email.trim()
    if (!isValidGmail(cleanEmail)) {
      setErrorMsg('Please enter a valid Gmail address (@gmail.com).')
      return
    }

    if (!consent) {
      setErrorMsg('Please confirm you agree to receive beta launch updates.')
      return
    }

    // 1. Check local status for immediate UI response
    const isLocallyDone = hasCompletedOnboarding(cleanEmail)
    if (isLocallyDone) {
      setIsRepeat(true)
      setStage('repeat_screen')
      setShowModal(true)
    } else {
      setIsRepeat(false)
      setStage('confirming')
      setShowModal(true)
      trackResearchEvent('research_invitation_viewed')
    }

    // 2. Always submit to Supabase to guarantee row insertion and database sync
    submitWaitlist({
      email: cleanEmail,
      consent: true,
      website: website || undefined,
    })
      .then((res) => {
        if (res.signupId) {
          setSignupId(res.signupId)
        }

        if (res.status === 'already_registered') {
          markOnboardingCompleted(cleanEmail)
          setIsRepeat(true)
          setStage('repeat_screen')
        } else {
          trackResearchEvent('waitlist_signup_success', { status: res.status })
        }
      })
      .catch((err) => {
        console.error('Waitlist submission error:', err)
        if (!isLocallyDone) {
          setShowModal(false)
          setStage('input')
          if (err instanceof WaitlistError) {
            setErrorMsg(err.message)
          } else {
            setErrorMsg('Unable to connect to waitlist. Please try again.')
          }
        }
      })
  }

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* ONBOARDING & QUESTIONNAIRE POP-UP MODAL */}
      {/* All questionnaire questions occur inside this Pop-Up modal */}
      {/* ------------------------------------------------------------- */}
      <OnboardingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        email={email}
        signupId={signupId}
        isRepeat={isRepeat}
      />

      {/* ------------------------------------------------------------- */}
      {/* STAGE 0: Initial Email Input (Minimal, clean, matches design.md) */}
      {/* ------------------------------------------------------------- */}
      {stage === 'input' && (
        <form onSubmit={handleSubmit} noValidate className="w-full max-w-[460px]">
          <label htmlFor={`${idPrefix}-email`} className="sr-only">
            Email address
          </label>
          <div className="group relative flex h-[58px] items-center rounded-2xl border border-white/10 bg-white/[0.06] pl-5 pr-2 transition-all focus-within:border-violet-soft/70 focus-within:bg-white/[0.09] focus-within:shadow-[0_0_24px_rgba(139,92,246,0.18)]">
            <input
              id={`${idPrefix}-email`}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Enter your Gmail address"
              value={email}
              onFocus={() => warmupWaitlist()}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errorMsg) setErrorMsg('')
              }}
              className="min-w-0 flex-1 border-0 bg-transparent text-[16px] text-white outline-none ring-0 placeholder:text-white/40 focus:border-0 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              aria-label="Join the waitlist"
              className="group/btn relative grid size-11 place-items-center rounded-xl bg-white text-black transition-all hover:scale-105 hover:bg-white active:scale-95 shadow-[0_4px_16px_rgba(255,255,255,0.2)]"
            >
              <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>

          {/* Honeypot field for bot protection */}
          <input
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          {/* Minimal, clear consent confirmation */}
          <label className="group mt-3.5 flex cursor-pointer select-none items-start gap-2.5 text-[13px] leading-snug text-white/60">
            <span className="relative mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/[0.06] transition-colors group-hover:border-violet-soft/60">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="peer sr-only"
              />
              <span
                className={`grid size-full place-items-center rounded-md transition-all ${
                  consent
                    ? 'bg-violet text-white opacity-100 shadow-[0_0_10px_rgba(139,92,246,0.6)]'
                    : 'opacity-0'
                }`}
              >
                <Check size={12} strokeWidth={3} />
              </span>
            </span>
            <span className="min-w-0 flex-1">
              Email me when private beta access opens. Unsubscribe anytime.
            </span>
          </label>

          {errorMsg && (
            <p role="alert" className="mt-3 text-[14px] text-rose-300 transition-opacity animate-in fade-in">
              {errorMsg}
            </p>
          )}
        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* REPEAT SIGN UP SCREEN: Strict protection */}
      {/* ------------------------------------------------------------- */}
      {stage === 'repeat_screen' && (
        <div className="w-full max-w-[540px] animate-in fade-in duration-300">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative grid size-12 shrink-0 place-items-center rounded-2xl border border-emerald-400/40 bg-emerald-400/10 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                <Check size={22} className="text-emerald-400" strokeWidth={2.8} />
                <span className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-md -z-10" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-300 uppercase">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Already Registered
                </span>
                <h4 className="mt-1 text-[22px] sm:text-[25px] font-semibold tracking-tight text-white">
                  You are onboarded.
                </h4>
              </div>
            </div>

            <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-white/75">
              We will update you and give you the link. When the app is live, it will give better testing updates.
            </p>

            {email && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white/60">
                <span className="size-2 rounded-full bg-emerald-400" />
                <span className="text-white font-medium">{email}</span>
              </div>
            )}

            {/* Refer others section */}
            <div className="mt-1 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
              <p className="text-[14px] font-semibold text-white">Refer others to the link</p>
              <p className="mt-0.5 text-[12px] text-white/50">
                Share this invite link with friends, colleagues, or anyone who tracks expenses:
              </p>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-white/10 bg-black/40 px-3.5 text-xs text-white/80">
                  <span className="truncate">{inviteLink}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyInvite}
                  className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-white px-4 text-xs font-semibold text-black transition-all hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(255,255,255,0.18)]"
                >
                  {copiedLink ? (
                    <>
                      <Check size={14} className="text-emerald-600" strokeWidth={2.8} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink size={13} />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="text-[13px] text-violet-soft hover:underline"
              >
                View pop-up details
              </button>

              <button
                type="button"
                onClick={() => {
                  setStage('input')
                  setEmail('')
                  setIsRepeat(false)
                }}
                className="text-[12px] text-white/35 hover:text-white/60 transition-colors"
              >
                Use another email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* NEW USER CONFIRMATION (Without inline questionnaire) */}
      {/* ------------------------------------------------------------- */}
      {stage === 'confirming' && (
        <div className="w-full max-w-[540px] animate-in fade-in duration-300">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative grid size-12 shrink-0 place-items-center rounded-2xl border border-emerald-400/40 bg-emerald-400/10 shadow-[0_0_32px_rgba(16,185,129,0.25)]">
                <Check size={22} className="text-emerald-400" strokeWidth={2.6} />
                <span className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-md -z-10" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-soft/40 bg-violet/15 px-3 py-1 text-[11px] font-bold tracking-wide text-violet-soft uppercase shadow-[0_0_16px_rgba(139,92,246,0.3)]">
                  <Sparkle size={12} className="text-violet-soft" />
                  <span>Hurray! Spot Confirmed</span>
                </span>
                <h4 className="mt-1 text-[22px] sm:text-[26px] font-bold tracking-tight text-white">
                  You’re officially on the list!
                </h4>
              </div>
            </div>

            <p className="text-[15px] sm:text-[16px] leading-relaxed text-white/70">
              We’ve reserved your spot for <span className="font-semibold text-white">{email}</span>. We roll out beta invites in small cohorts.
            </p>

            {/* Refer others section */}
            <div className="mt-1 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
              <p className="text-[14px] font-semibold text-white">Refer others to the link</p>
              <p className="mt-0.5 text-[12px] text-white/50">
                Share this invite link with friends, colleagues, or anyone who tracks expenses:
              </p>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-white/10 bg-black/40 px-3.5 text-xs text-white/80">
                  <span className="truncate">{inviteLink}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyInvite}
                  className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-white px-4 text-xs font-semibold text-black transition-all hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(255,255,255,0.18)]"
                >
                  {copiedLink ? (
                    <>
                      <Check size={14} className="text-emerald-600" strokeWidth={2.8} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink size={13} />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="text-[13px] text-violet-soft hover:underline"
              >
                Personalize build in pop-up
              </button>

              <button
                type="button"
                onClick={() => {
                  setStage('input')
                  setEmail('')
                  setIsRepeat(false)
                }}
                className="text-[12px] text-white/35 hover:text-white/60 transition-colors"
              >
                Use another email
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
