import { useEffect, useRef, useState } from 'react'
import { Logo } from '../components/brand/Logo'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Sparkle,
  Zap,
} from '../components/ui/Icons'
import { trackResearchEvent } from '../lib/analytics/researchEvents'
import { Link, PageMeta } from '../lib/router'
import { submitUserResearch, type ResearchSubmission } from '../lib/supabase/research'

const PAIN_POINTS = [
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

const TRACKING_METHODS = [
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

const OUTCOMES = [
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

export function ResearchOnboarding() {
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const queryEmail = searchParams.get('email') || ''
  const querySignupId = searchParams.get('id') || ''

  const [email] = useState(queryEmail)
  const [signupId] = useState(querySignupId)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [copiedLink, setCopiedLink] = useState(false)

  const answersRef = useRef<ResearchSubmission>({
    signupId: querySignupId || undefined,
    email: queryEmail || undefined,
    primaryPainPoint: '',
    currentTrackingMethod: '',
    desiredOutcome: '',
    featureSuggestion: '',
    featureContactConsent: true,
  })

  const [answers, setAnswers] = useState<ResearchSubmission>(answersRef.current)

  useEffect(() => {
    trackResearchEvent('research_invitation_viewed')
  }, [])

  function recordAnswer(patch: Partial<ResearchSubmission>) {
    const updated = {
      ...answersRef.current,
      ...patch,
      signupId: signupId || answersRef.current.signupId,
      email: email || answersRef.current.email,
    }
    answersRef.current = updated
    setAnswers(updated)
    submitUserResearch(updated).catch(() => {})
  }

  function handleCopyInvite() {
    const url = window.location.origin
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    })
  }

  return (
    <>
      <PageMeta
        title="Personalize Your Experience — Zeno Early Access"
        description="Help us design the ultimate personal finance app tailored to your tracking habits."
      />

      <div className="min-h-screen bg-[#050505] text-white selection:bg-violet/40">
        {/* Ambient Top Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 h-[350px] w-full max-w-[1200px] bg-[radial-gradient(ellipse_60%_70%_at_50%_0%,rgb(139_92_246/0.25),transparent_70%)] blur-2xl -z-10"
        />

        {/* Minimal Nav Header */}
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
            <Logo />
            <Link
              href="/"
              className="text-[13px] font-medium text-white/60 transition-colors hover:text-white"
            >
              Back to Home
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="mx-auto max-w-2xl px-5 py-12 md:py-20">
          {/* Progress Indicator */}
          {step <= 4 && (
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => ((s - 1) as 1 | 2 | 3 | 4))}
                    className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/60 hover:text-white"
                  >
                    <ArrowLeft size={14} />
                  </button>
                )}
                <span className="text-[12px] font-medium tracking-wide text-white/50">
                  Step {step} of 4
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === step
                        ? 'w-6 bg-violet-soft shadow-[0_0_8px_rgba(167,139,250,0.6)]'
                        : i < step
                        ? 'w-3 bg-emerald-400'
                        : 'w-3 bg-white/10'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep(5)}
                className="text-[12px] text-white/40 hover:text-white"
              >
                Skip
              </button>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-in fade-in duration-200">
              <span className="inline-block rounded-full border border-violet-soft/30 bg-violet/10 px-3 py-1 text-xs font-semibold text-violet-soft">
                Early Access Onboarding
              </span>
              <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                What frustrates you most about money tracking?
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-white/60">
                Pick your biggest pain point. We’ll prioritize solving it first.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAIN_POINTS.map((opt) => {
                  const isSelected = answers.primaryPainPoint === opt.label
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        recordAnswer({ primaryPainPoint: opt.label })
                        setTimeout(() => setStep(2), 220)
                      }}
                      className={`group flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.98] ${
                        isSelected
                          ? 'border-violet bg-violet/20 shadow-[0_0_24px_rgba(139,92,246,0.3)]'
                          : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-2xl" role="img" aria-hidden="true">{opt.icon}</span>
                        <span
                          className={`grid size-5 place-items-center rounded-full border transition-all ${
                            isSelected
                              ? 'border-violet-soft bg-violet text-white'
                              : 'border-white/20 opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <Check size={11} strokeWidth={3} />
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-[15px] font-medium text-white">{opt.label}</p>
                        <p className="mt-1 text-[13px] text-white/45">{opt.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-in fade-in duration-200">
              <span className="inline-block rounded-full border border-violet-soft/30 bg-violet/10 px-3 py-1 text-xs font-semibold text-violet-soft">
                Current Setup
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                How do you track your expenses today?
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-white/60">
                Helps us build frictionless auto-import and parsing tools.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TRACKING_METHODS.map((opt) => {
                  const isSelected = answers.currentTrackingMethod === opt.label
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        recordAnswer({ currentTrackingMethod: opt.label })
                        setTimeout(() => setStep(3), 220)
                      }}
                      className={`group flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.98] ${
                        isSelected
                          ? 'border-violet bg-violet/20 shadow-[0_0_24px_rgba(139,92,246,0.3)]'
                          : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-2xl" role="img" aria-hidden="true">{opt.icon}</span>
                        <span
                          className={`grid size-5 place-items-center rounded-full border transition-all ${
                            isSelected
                              ? 'border-violet-soft bg-violet text-white'
                              : 'border-white/20 opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <Check size={11} strokeWidth={3} />
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-[15px] font-medium text-white">{opt.label}</p>
                        <p className="mt-1 text-[13px] text-white/45">{opt.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="animate-in fade-in duration-200">
              <span className="inline-block rounded-full border border-violet-soft/30 bg-violet/10 px-3 py-1 text-xs font-semibold text-violet-soft">
                Priority Goal
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                What is the #1 outcome you want from Zeno?
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-white/60">
                We’ll tailor your early-access profile around this target.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OUTCOMES.map((opt) => {
                  const isSelected = answers.desiredOutcome === opt.label
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        recordAnswer({ desiredOutcome: opt.label })
                        setTimeout(() => setStep(4), 220)
                      }}
                      className={`group flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.98] ${
                        isSelected
                          ? 'border-violet bg-violet/20 shadow-[0_0_24px_rgba(139,92,246,0.3)]'
                          : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-2xl" role="img" aria-hidden="true">{opt.icon}</span>
                        <span
                          className={`grid size-5 place-items-center rounded-full border transition-all ${
                            isSelected
                              ? 'border-violet-soft bg-violet text-white'
                              : 'border-white/20 opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <Check size={11} strokeWidth={3} />
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-[15px] font-medium text-white">{opt.label}</p>
                        <p className="mt-1 text-[13px] text-white/45">{opt.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="animate-in fade-in duration-200">
              <span className="inline-block rounded-full border border-violet-soft/30 bg-violet/10 px-3 py-1 text-xs font-semibold text-violet-soft">
                Feature Wish
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                What’s one feature you wish existed?
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-white/60">
                Optional. What would make Zeno a 10/10 for you?
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 focus-within:border-violet-soft/70">
                  <textarea
                    rows={4}
                    value={answers.featureSuggestion || ''}
                    onChange={(e) => setAnswers({ ...answers, featureSuggestion: e.target.value })}
                    placeholder="e.g. Split UPI bills with friends, monthly savings goals, WhatsApp bot..."
                    className="w-full resize-none border-0 bg-transparent text-[15px] text-white outline-none placeholder:text-white/30 focus:outline-none"
                  />
                </div>

                <label className="group flex cursor-pointer select-none items-center gap-2.5 text-sm text-white/65">
                  <span className="relative flex size-4 shrink-0 items-center justify-center rounded border border-white/20 bg-white/[0.06] transition-colors group-hover:border-violet-soft/60">
                    <input
                      type="checkbox"
                      checked={answers.featureContactConsent ?? true}
                      onChange={(e) => setAnswers({ ...answers, featureContactConsent: e.target.checked })}
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

                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      recordAnswer({
                        featureSuggestion: answers.featureSuggestion,
                        featureContactConsent: answers.featureContactConsent,
                        researchCompleted: true,
                      })
                      setStep(5)
                    }}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-6 font-semibold text-black transition-all hover:scale-[1.01] active:scale-[0.98]"
                  >
                    <span>Finish & Claim VIP Priority</span>
                    <Sparkle size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: VIP CONFIRMATION */}
          {step === 5 && (
            <div className="rounded-3xl border border-white/10 bg-[#0d0d12] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-300">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-violet/40 bg-violet/20 shadow-[0_0_35px_rgba(139,92,246,0.35)]">
                    <Sparkle size={26} className="text-violet-soft" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-violet/30 bg-violet/10 px-2.5 py-0.5 text-xs font-semibold text-violet-soft uppercase">
                      <Zap size={11} />
                      VIP Priority Locked
                    </span>
                    <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                      You’re all set!
                    </h2>
                  </div>
                </div>

                <p className="text-base leading-relaxed text-white/70">
                  Thank you for helping shape Zeno. We’ve configured your priority invite tailored around{' '}
                  <span className="font-semibold text-white">
                    {answers.desiredOutcome || 'smart effortless tracking'}
                  </span>
                  .
                </p>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">Invite friends & move up the queue</p>
                      <p className="text-xs text-white/50 mt-0.5">
                        Share your referral link with anyone looking for simpler money tracking.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyInvite}
                      className="shrink-0 flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.08] px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white hover:text-black"
                    >
                      {copiedLink ? (
                        <>
                          <Check size={14} className="text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink size={14} />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white"
                  >
                    <span>Back to Home</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
