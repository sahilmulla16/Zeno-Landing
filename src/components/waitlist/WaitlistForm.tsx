import { useEffect, useRef, useState, type FormEvent } from 'react'
import { trackResearchEvent } from '../../lib/analytics/researchEvents'
import {
  hasCompletedOnboarding,
  markOnboardingCompleted,
} from '../../lib/storage/onboardingStorage'
import { submitUserResearch, type ResearchSubmission } from '../../lib/supabase/research'
import { submitWaitlist, warmupWaitlist, WaitlistError } from '../../lib/supabase/waitlist'
import { isValidGmail } from '../../lib/validation'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Sparkle,
  Zap,
} from '../ui/Icons'
import { OnboardingModal } from './OnboardingModal'

type Stage =
  | 'input'
  | 'repeat_screen'
  | 'confirming'
  | 'question_1'
  | 'question_2'
  | 'question_3'
  | 'question_4'
  | 'completed'

interface QuestionOption {
  id: string
  label: string
  desc: string
  icon: string
}

const PAIN_POINTS: QuestionOption[] = [
  {
    id: 'manual_effort',
    label: 'Manual entry is exhausting',
    desc: 'Forgetting to log daily UPI, food & cash spends',
    icon: '⏱️',
  },
  {
    id: 'fragmented_data',
    label: 'Scattered across too many apps',
    desc: 'Money spread across cards, bank accounts & wallets',
    icon: '💳',
  },
  {
    id: 'no_burn_visibility',
    label: 'No visibility into monthly burn',
    desc: 'Never knowing exactly how much is safe to spend',
    icon: '📉',
  },
  {
    id: 'no_ai_insights',
    label: 'Can’t get quick financial answers',
    desc: 'Want an AI to answer spending questions in plain words',
    icon: '🤖',
  },
]

const TRACKING_METHODS: QuestionOption[] = [
  {
    id: 'other_app',
    label: 'Another expense tracking app',
    desc: 'Tried existing apps, but they feel clunky or cluttered',
    icon: '📱',
  },
  {
    id: 'spreadsheets',
    label: 'Excel / Google Sheets',
    desc: 'Customizable, but takes too much manual maintenance',
    icon: '📊',
  },
  {
    id: 'mental_sms',
    label: 'In my head & bank SMS alerts',
    desc: 'Glancing at bank messages and account balances',
    icon: '🧠',
  },
  {
    id: 'notes_diary',
    label: 'Notes app or physical diary',
    desc: 'Quick scribbles whenever I remember to write it down',
    icon: '✍️',
  },
]

const OUTCOMES: QuestionOption[] = [
  {
    id: 'zero_effort',
    label: 'Zero-effort automated tracking',
    desc: 'Effortless logging without typing every transaction',
    icon: '⚡',
  },
  {
    id: 'stick_to_budget',
    label: 'Stay strictly within my monthly budget',
    desc: 'Clear, proactive limits before overspending',
    icon: '🛡️',
  },
  {
    id: 'ai_insights',
    label: 'Actionable AI spending insights',
    desc: 'Find spending leaks and get straightforward answers',
    icon: '💡',
  },
  {
    id: 'save_more',
    label: 'Grow personal savings effortlessly',
    desc: 'Reach monthly savings goals with peace of mind',
    icon: '🎯',
  },
]

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

  // Research answers state with ref to prevent stale closure loss
  const answersRef = useRef<ResearchSubmission>({
    primaryPainPoint: '',
    currentTrackingMethod: '',
    desiredOutcome: '',
    featureSuggestion: '',
    featureContactConsent: true,
  })

  const [answers, setAnswers] = useState<ResearchSubmission>(answersRef.current)

  // Pre-warm the Edge Function immediately when form mounts
  useEffect(() => {
    warmupWaitlist()
  }, [])

  // Sync signupId and email to answersRef and server
  useEffect(() => {
    if (signupId) {
      answersRef.current.signupId = signupId
      const hasAnyAnswer =
        answersRef.current.primaryPainPoint ||
        answersRef.current.currentTrackingMethod ||
        answersRef.current.desiredOutcome
      if (hasAnyAnswer && email) {
        submitUserResearch({
          ...answersRef.current,
          email: email.trim().toLowerCase(),
          signupId,
        }).catch(() => {})
      }
    }
    if (email) {
      answersRef.current.email = email.trim().toLowerCase()
    }
  }, [signupId, email])

  // Notify parent component when user enters interactive flow
  useEffect(() => {
    const isEngaged = stage !== 'input'
    onEngagedChange?.(isEngaged)
  }, [stage, onEngagedChange])

  // Sync research answers in background whenever updated
  function recordAnswer(patch: Partial<ResearchSubmission>) {
    const updated = {
      ...answersRef.current,
      ...patch,
      signupId: signupId || answersRef.current.signupId,
      email: email ? email.trim().toLowerCase() : answersRef.current.email,
    }
    answersRef.current = updated
    setAnswers(updated)
    submitUserResearch(updated).catch(() => {})
  }

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
          answersRef.current.signupId = res.signupId
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

  function handleFinishFlow(patch?: Partial<ResearchSubmission>) {
    const finalData = {
      ...answersRef.current,
      ...(patch || {}),
      signupId: signupId || answersRef.current.signupId,
      email: email ? email.trim().toLowerCase() : answersRef.current.email,
      researchCompleted: true,
    }
    answersRef.current = finalData
    setAnswers(finalData)
    submitUserResearch(finalData).catch(() => {})
    markOnboardingCompleted(email)
    setStage('completed')
  }

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* REPEAT SIGN UP POP-UP MODAL (Also handles new user onboarding) */}
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
      {/* REPEAT SIGN UP SCREEN: Strict protection, no questions allowed */}
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
      {/* NEW USER CONFIRMATION & QUESTIONNAIRE (Inline fallback) */}
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

            <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet/20 text-violet-soft">
                  <Sparkle size={16} />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-white">Personalize your Zeno build</p>
                  <p className="text-[13px] text-white/50 mt-0.5 leading-snug">
                    Answer 3 quick micro-questions (takes ~20 seconds) so we prioritize the features you care about.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setStage('question_1')}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[14px] font-semibold text-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(255,255,255,0.2)]"
                >
                  <span>Customize my experience</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => handleFinishFlow()}
                  className="flex h-11 items-center justify-center rounded-xl px-4 text-[13px] text-white/50 transition-colors hover:text-white/80"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUESTIONS 1-4 INLINE VIEW */}
      {(stage === 'question_1' || stage === 'question_2' || stage === 'question_3' || stage === 'question_4') && (
        <div className="w-full max-w-[560px] animate-in fade-in duration-200">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (stage === 'question_1') setStage('confirming')
                  if (stage === 'question_2') setStage('question_1')
                  if (stage === 'question_3') setStage('question_2')
                  if (stage === 'question_4') setStage('question_3')
                }}
                className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:border-white/20 hover:text-white"
                aria-label="Previous question"
              >
                <ArrowLeft size={14} />
              </button>
              <span className="text-[12px] font-medium tracking-wide text-white/50">
                Question {stage === 'question_1' ? 1 : stage === 'question_2' ? 2 : stage === 'question_3' ? 3 : 4} of 3
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((step) => {
                const cur = stage === 'question_1' ? 1 : stage === 'question_2' ? 2 : 3
                return (
                  <span
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      step === cur
                        ? 'w-6 bg-violet-soft shadow-[0_0_8px_rgba(167,139,250,0.6)]'
                        : step < cur
                        ? 'w-3 bg-emerald-400'
                        : 'w-3 bg-white/10'
                    }`}
                  />
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => handleFinishFlow()}
              className="text-[12px] text-white/40 transition-colors hover:text-white/80"
            >
              Skip
            </button>
          </div>

          {stage === 'question_1' && (
            <>
              <h4 className="text-[20px] sm:text-[23px] font-semibold tracking-tight text-white">
                What frustrates you most about money tracking?
              </h4>
              <p className="mt-1 text-[13px] sm:text-[14px] text-white/50 leading-snug">
                Tap your biggest friction point. We’ll solve it first.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PAIN_POINTS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      recordAnswer({ primaryPainPoint: opt.label })
                      setTimeout(() => setStage('question_2'), 220)
                    }}
                    className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-left transition-all hover:border-white/20 hover:bg-white/[0.06] active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xl" role="img" aria-hidden="true">{opt.icon}</span>
                      <span className="grid size-5 place-items-center rounded-full border border-white/20 opacity-0 group-hover:opacity-100">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-[14px] font-medium text-white leading-snug">{opt.label}</p>
                      <p className="mt-1 text-[12px] text-white/45 leading-snug">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {stage === 'question_2' && (
            <>
              <h4 className="text-[20px] sm:text-[23px] font-semibold tracking-tight text-white">
                How do you track your expenses today?
              </h4>
              <p className="mt-1 text-[13px] sm:text-[14px] text-white/50 leading-snug">
                Helps us configure frictionless import and auto-tracking methods.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TRACKING_METHODS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      recordAnswer({ currentTrackingMethod: opt.label })
                      setTimeout(() => setStage('question_3'), 220)
                    }}
                    className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-left transition-all hover:border-white/20 hover:bg-white/[0.06] active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xl" role="img" aria-hidden="true">{opt.icon}</span>
                      <span className="grid size-5 place-items-center rounded-full border border-white/20 opacity-0 group-hover:opacity-100">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-[14px] font-medium text-white leading-snug">{opt.label}</p>
                      <p className="mt-1 text-[12px] text-white/45 leading-snug">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {stage === 'question_3' && (
            <>
              <h4 className="text-[20px] sm:text-[23px] font-semibold tracking-tight text-white">
                What is the #1 outcome you want from Zeno?
              </h4>
              <p className="mt-1 text-[13px] sm:text-[14px] text-white/50 leading-snug">
                We’ll tailor your early-access account setup around this goal.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {OUTCOMES.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      recordAnswer({ desiredOutcome: opt.label })
                      setTimeout(() => setStage('question_4'), 220)
                    }}
                    className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-left transition-all hover:border-white/20 hover:bg-white/[0.06] active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xl" role="img" aria-hidden="true">{opt.icon}</span>
                      <span className="grid size-5 place-items-center rounded-full border border-white/20 opacity-0 group-hover:opacity-100">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-[14px] font-medium text-white leading-snug">{opt.label}</p>
                      <p className="mt-1 text-[12px] text-white/45 leading-snug">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {stage === 'question_4' && (
            <>
              <h4 className="text-[20px] sm:text-[23px] font-semibold tracking-tight text-white">
                What’s your dream finance feature?
              </h4>
              <p className="mt-1 text-[13px] text-white/50 leading-snug">
                Something missing from every other app? Tell us below.
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 focus-within:border-violet-soft/70">
                  <textarea
                    rows={3}
                    value={answers.featureSuggestion || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      answersRef.current.featureSuggestion = val
                      setAnswers((prev) => ({ ...prev, featureSuggestion: val }))
                    }}
                    placeholder="e.g. Split UPI bills with flatmates, salary allocation bucket, WhatsApp expense logger..."
                    className="w-full resize-none border-0 bg-transparent text-[14px] text-white outline-none placeholder:text-white/30"
                  />
                </div>

                <label className="group flex cursor-pointer select-none items-center gap-2.5 text-[12.5px] text-white/60">
                  <span className="relative flex size-4 shrink-0 items-center justify-center rounded border border-white/20 bg-white/[0.06] transition-colors group-hover:border-violet-soft/60">
                    <input
                      type="checkbox"
                      checked={answers.featureContactConsent ?? true}
                      onChange={(e) => {
                        const val = e.target.checked
                        answersRef.current.featureContactConsent = val
                        setAnswers((prev) => ({ ...prev, featureContactConsent: val }))
                      }}
                      className="peer sr-only"
                    />
                    <span
                      className={`grid size-full place-items-center rounded transition-all ${
                        answers.featureContactConsent ? 'bg-violet text-white opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Check size={10} strokeWidth={3} />
                    </span>
                  </span>
                  <span>Open to a quick 15-min beta tester call with the team</span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    handleFinishFlow({
                      featureSuggestion: answers.featureSuggestion,
                      featureContactConsent: answers.featureContactConsent,
                    })
                  }
                  className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[14px] font-semibold text-black transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  <span>Finish & Claim VIP Priority</span>
                  <Sparkle size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* STAGE 5: VIP COMPLETION INLINE */}
      {stage === 'completed' && (
        <div className="w-full max-w-[540px] animate-in fade-in duration-300">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative grid size-12 shrink-0 place-items-center rounded-2xl border border-violet/40 bg-violet/20 shadow-[0_0_35px_rgba(139,92,246,0.35)]">
                <Sparkle size={22} className="text-violet-soft" />
                <span className="absolute inset-0 rounded-2xl bg-violet/20 blur-md -z-10" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-violet/30 bg-violet/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-violet-soft uppercase">
                    <Zap size={11} />
                    VIP Priority Locked
                  </span>
                  <span className="text-xs text-white/40">Early Alpha Cohort</span>
                </div>
                <h4 className="mt-1 text-[22px] sm:text-[26px] font-semibold tracking-tight text-white">
                  You’re all set!
                </h4>
              </div>
            </div>

            <p className="text-[15px] sm:text-[16px] leading-relaxed text-white/70">
              Thank you for shaping Zeno. We’ve configured your priority invite tailored around{' '}
              <span className="font-semibold text-white">
                {answers.desiredOutcome || 'smart effortless tracking'}
              </span>
              .
            </p>

            {/* Refer others section */}
            <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[13.5px] font-medium text-white">Refer others to the link</p>
                  <p className="text-[12px] text-white/45 mt-0.5">
                    Share your referral link with anyone looking for simpler money tracking.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyInvite}
                  className="shrink-0 flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.08] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-white hover:text-black active:scale-95"
                >
                  {copiedLink ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
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
              <a
                href="#features"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-white/50 transition-colors hover:text-white"
              >
                <span>Explore features while you wait</span>
                <ArrowRight size={13} />
              </a>

              <button
                type="button"
                onClick={() => {
                  setStage('input')
                  setEmail('')
                  setIsRepeat(false)
                }}
                className="text-[12px] text-white/35 hover:text-white/60 transition-colors"
              >
                Register another email
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
