import { useEffect, useRef, useState } from 'react'
import { markOnboardingCompleted } from '../../lib/storage/onboardingStorage'
import { submitUserResearch, type ResearchSubmission } from '../../lib/supabase/research'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Close,
  ExternalLink,
  Sparkle,
  Zap,
} from '../ui/Icons'

type Step = 'confirming' | 'question_1' | 'question_2' | 'question_3' | 'question_4' | 'completed'

interface OptionItem {
  id: string
  label: string
  desc: string
  icon: string
}

const PAIN_POINTS: OptionItem[] = [
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

const TRACKING_METHODS: OptionItem[] = [
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

const OUTCOMES: OptionItem[] = [
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

/**
 * Full-screen luxury celebration particle shower across the entire viewport.
 * Multi-cannon burst (Left, Right, and Center) in Zeno's brand palette.
 */
function CelebrationConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    function handleResize() {
      if (!canvas || !ctx) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const colors = [
      '#8b5cf6', // Violet
      '#a78bfa', // Soft violet
      '#ec4899', // Pink
      '#f472b6', // Light pink
      '#10b981', // Mint Emerald
      '#34d399', // Bright emerald
      '#fbbf24', // Champagne Gold
      '#f59e0b', // Amber
      '#ffffff', // Shimmer white
    ]

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      angle: number
      vAngle: number
      shape: 'ribbon' | 'circle' | 'spark'
      alpha: number
      decay: number
      tilt: number
      tiltSpeed: number
    }

    const count = 150
    const particles: Particle[] = Array.from({ length: count }, (_, i) => {
      // 3 Origin points: Left cannon, Right cannon, Center fireworks
      const originType = i % 3
      let startX: number
      let startY: number
      let angle: number
      let speed: number

      if (originType === 0) {
        // Left cannon: fires upwards and towards right
        startX = width * 0.1
        startY = height * 0.85
        angle = (Math.PI / 180) * (-45 - Math.random() * 35)
        speed = 8 + Math.random() * 11
      } else if (originType === 1) {
        // Right cannon: fires upwards and towards left
        startX = width * 0.9
        startY = height * 0.85
        angle = (Math.PI / 180) * (-135 + Math.random() * 35)
        speed = 8 + Math.random() * 11
      } else {
        // Center celebratory fountain
        startX = width * 0.5 + (Math.random() - 0.5) * (width * 0.3)
        startY = height * 0.45
        angle = (Math.PI / 180) * (210 + Math.random() * 120)
        speed = 5 + Math.random() * 9
      }

      const shapeRoll = Math.random()
      return {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.16,
        shape: shapeRoll > 0.5 ? 'ribbon' : shapeRoll > 0.22 ? 'circle' : 'spark',
        alpha: 1,
        decay: 0.005 + Math.random() * 0.006, // Graceful ~3.5s float
        tilt: Math.random() * Math.PI,
        tiltSpeed: 0.05 + Math.random() * 0.07,
      }
    })

    let animId: number
    let running = true

    function render() {
      if (!running || !ctx || !canvas) return
      ctx.clearRect(0, 0, width, height)

      let activeCount = 0
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.24 // Realistic gravity
        p.vx *= 0.985 // Atmospheric air drag
        p.angle += p.vAngle
        p.tilt += p.tiltSpeed
        p.alpha -= p.decay

        if (p.alpha > 0) {
          activeCount++
          ctx.save()
          ctx.globalAlpha = Math.max(0, p.alpha)
          ctx.translate(p.x, p.y)
          ctx.rotate(p.angle)
          ctx.fillStyle = p.color

          if (p.shape === 'ribbon') {
            const tiltScale = Math.sin(p.tilt)
            ctx.scale(1, tiltScale)
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2.2)
          } else if (p.shape === 'circle') {
            ctx.beginPath()
            ctx.arc(0, 0, p.size / 2.6, 0, Math.PI * 2)
            ctx.fill()
          } else {
            // Shimmering 4-point star
            ctx.beginPath()
            ctx.moveTo(0, -p.size)
            ctx.lineTo(p.size * 0.3, -p.size * 0.3)
            ctx.lineTo(p.size, 0)
            ctx.lineTo(p.size * 0.3, p.size * 0.3)
            ctx.lineTo(0, p.size)
            ctx.lineTo(-p.size * 0.3, p.size * 0.3)
            ctx.lineTo(-p.size, 0)
            ctx.lineTo(-p.size * 0.3, -p.size * 0.3)
            ctx.closePath()
            ctx.fill()
          }

          ctx.restore()
        }
      }

      if (activeCount > 0) {
        animId = requestAnimationFrame(render)
      } else {
        running = false
      }
    }

    render()

    return () => {
      running = false
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] h-screen w-screen"
    />
  )
}

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  signupId?: string
  isRepeat: boolean
}

export function OnboardingModal({
  isOpen,
  onClose,
  email,
  signupId,
  isRepeat,
}: OnboardingModalProps) {
  const [step, setStep] = useState<Step>('confirming')
  const [copiedLink, setCopiedLink] = useState(false)

  // Accumulate all answers cleanly without React state closure lag
  const answersRef = useRef<ResearchSubmission>({
    primaryPainPoint: '',
    currentTrackingMethod: '',
    desiredOutcome: '',
    featureSuggestion: '',
    featureContactConsent: true,
  })

  const [answers, setAnswers] = useState<ResearchSubmission>(answersRef.current)

  // Keep signupId and email synchronized in answersRef
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

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('confirming')
      setCopiedLink(false)
    }
  }, [isOpen])

  // If email was already registered, ensure it's permanently stored in localStorage
  useEffect(() => {
    if (isRepeat && email) {
      markOnboardingCompleted(email)
    }
  }, [isRepeat, email])

  if (!isOpen) return null

  const inviteLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}${email ? `?ref=${encodeURIComponent(email.split('@')[0])}` : ''}`
      : 'https://zeno.app'

  function handleCopy() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(inviteLink).then(() => {
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2400)
      })
    }
  }

  // Atomically update state and send full accumulated answers to Edge Function
  function recordAnswer(patch: Partial<ResearchSubmission>) {
    const updated = {
      ...answersRef.current,
      ...patch,
      signupId: signupId || answersRef.current.signupId,
      email: email ? email.trim().toLowerCase() : answersRef.current.email,
    }
    answersRef.current = updated
    setAnswers(updated)
    submitUserResearch(updated).catch((err) => {
      console.warn('Research submit error:', err)
    })
  }

  function handleFinish(patch?: Partial<ResearchSubmission>) {
    const finalData = {
      ...answersRef.current,
      ...(patch || {}),
      signupId: signupId || answersRef.current.signupId,
      email: email ? email.trim().toLowerCase() : answersRef.current.email,
      researchCompleted: true,
    }
    answersRef.current = finalData
    setAnswers(finalData)
    submitUserResearch(finalData).catch((err) => {
      console.warn('Final research submit error:', err)
    })
    markOnboardingCompleted(email)
    setStep('completed')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Full-Screen Confetti Shower across the entire viewport (Not clipped to card) */}
      {step === 'confirming' && !isRepeat && <CelebrationConfetti />}

      {/* Deep Blurred Backdrop with cinematic tint */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
      />

      {/* Modal Card Surface */}
      <div className="relative z-10 w-full max-w-[580px] overflow-hidden rounded-[32px] border border-white/15 bg-[#0a0a10] p-6 sm:p-9 shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_50px_rgba(139,92,246,0.22)] animate-in fade-in zoom-in-95 duration-300">
        {/* Multi-layered cinematic radial glows inside modal */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(139_92_246/0.38),rgb(236_72_153/0.18),transparent_70%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 right-0 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgb(16_185_129/0.16),transparent_70%)] blur-xl"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-5 top-5 z-40 grid size-8 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-white/50 transition-all hover:scale-105 hover:border-white/20 hover:text-white active:scale-95"
        >
          <Close size={15} />
        </button>

        {/* ------------------------------------------------------------- */}
        {/* REPEAT SIGN UP SCREEN: Strict duplicate block */}
        {/* ------------------------------------------------------------- */}
        {isRepeat ? (
          <div className="relative z-10 flex flex-col gap-5 pt-1">
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
                <h3
                  id="onboarding-modal-title"
                  className="mt-1 text-[22px] sm:text-[25px] font-semibold tracking-tight text-white"
                >
                  You are onboarded.
                </h3>
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
                  onClick={handleCopy}
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

            <button
              type="button"
              onClick={onClose}
              className="mt-1 flex h-11 w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] text-[13px] font-medium text-white/80 transition-colors hover:bg-white/[0.1] hover:text-white"
            >
              Done
            </button>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* NEW USER FLOW: CELEBRATORY HURRAY POP SCREEN */
          /* ------------------------------------------------------------- */
          <div className="relative z-10">
            {step === 'confirming' && (
              <div className="flex flex-col gap-5 pt-1 animate-in fade-in zoom-in-95 duration-300">
                {/* Celebratory Badge with Radiant Glow Rings */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    {/* Pulsing Concentric Aura Halo */}
                    <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-tr from-violet-500/40 via-pink-500/30 to-emerald-400/40 blur-xl animate-pulse" />

                    <div className="relative flex size-20 items-center justify-center rounded-3xl border border-white/20 bg-gradient-to-tr from-[#161226] via-[#1a142e] to-[#121c21] shadow-[0_0_40px_rgba(139,92,246,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-transform hover:scale-105">
                      <span className="text-3xl select-none animate-bounce" role="img" aria-label="Hurray">
                        🎉
                      </span>
                    </div>

                    <span className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border-2 border-[#0a0a10] bg-emerald-400 text-black shadow-md">
                      <Check size={14} strokeWidth={3.2} />
                    </span>
                  </div>

                  {/* Celebratory Hurray Eyebrow Pill */}
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-soft/40 bg-violet/15 px-3 py-1 text-[11.5px] font-bold tracking-wide text-violet-soft uppercase shadow-[0_0_16px_rgba(139,92,246,0.3)]">
                    <Sparkle size={13} className="text-violet-soft" />
                    <span>Hurray! Spot Confirmed</span>
                  </div>

                  {/* Main Celebratory Headline */}
                  <h3
                    id="onboarding-modal-title"
                    className="mt-3 text-[clamp(1.75rem,4vw,2.2rem)] font-bold tracking-tight text-white leading-[1.12]"
                  >
                    You’re officially on the list!
                  </h3>

                  <p className="mt-2 max-w-[420px] text-[14.5px] sm:text-[15.5px] text-white/70 leading-snug">
                    Your priority access pass is reserved for{' '}
                    <span className="font-semibold text-white underline decoration-violet/50 underline-offset-2">
                      {email}
                    </span>
                    . We roll out beta invites in small cohorts.
                  </p>
                </div>

                {/* VIP Early Access Ticket Pass Card */}
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-white/[0.01] p-4 sm:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                  {/* Subtle holographic diagonal sheen */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rotate-12 rounded-full bg-gradient-to-br from-pink-500/15 via-violet-500/20 to-transparent blur-xl"
                  />

                  <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="grid size-6 place-items-center rounded-lg bg-violet/30 text-violet-soft">
                        <Zap size={13} />
                      </span>
                      <span className="text-xs font-semibold tracking-wider text-white/90 uppercase">
                        Zeno Early Alpha Pass
                      </span>
                    </div>

                    <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-300">
                      BATCH 1 · VIP
                    </span>
                  </div>

                  <div className="relative z-10 mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-white/60">
                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-violet-soft" />
                      <span>Smart Auto-Track</span>
                      <span className="text-white/20">·</span>
                      <span>Zeno AI Assistant</span>
                      <span className="text-white/20">·</span>
                      <span>Budgets</span>
                    </div>

                    <span className="font-mono text-[11px] text-white/40">
                      ZN-VIP#{Math.abs(email.split('').reduce((acc, c) => (acc << 5) - acc + c.charCodeAt(0), 0) % 9000 + 1000)}
                    </span>
                  </div>
                </div>

                {/* Interactive Personalization Callout */}
                <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left backdrop-blur-md">
                  <div className="flex items-start gap-3">
                    <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet/20 text-violet-soft">
                      <Sparkle size={15} />
                    </div>
                    <div>
                      <p className="text-[13.5px] font-semibold text-white">Help tailor your early access build</p>
                      <p className="mt-0.5 text-[12.5px] text-white/50 leading-snug">
                        Answer 3 quick questions (~20s) so we prioritize the features you need most.
                      </p>
                    </div>
                  </div>

                  <div className="mt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setStep('question_1')}
                      className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[14px] font-bold text-black transition-all hover:scale-[1.02] hover:bg-white active:scale-[0.98] shadow-[0_6px_24px_rgba(255,255,255,0.22)]"
                    >
                      <span>Personalize My Zeno Build</span>
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFinish()}
                      className="flex h-12 items-center justify-center rounded-xl px-4 text-[13px] font-medium text-white/50 transition-colors hover:text-white"
                    >
                      Skip for now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Questions 1 to 4 Progress Header */}
            {step !== 'confirming' && step !== 'completed' && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (step === 'question_1') setStep('confirming')
                        if (step === 'question_2') setStep('question_1')
                        if (step === 'question_3') setStep('question_2')
                        if (step === 'question_4') setStep('question_3')
                      }}
                      className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/60 hover:text-white"
                      aria-label="Back"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <span className="text-[12px] font-medium text-white/50">
                      Question {step === 'question_1' ? 1 : step === 'question_2' ? 2 : step === 'question_3' ? 3 : 4} of 3
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3].map((num) => {
                      const cur = step === 'question_1' ? 1 : step === 'question_2' ? 2 : 3
                      return (
                        <span
                          key={num}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            num === cur
                              ? 'w-6 bg-violet-soft shadow-[0_0_8px_rgba(167,139,250,0.6)]'
                              : num < cur
                              ? 'w-3 bg-emerald-400'
                              : 'w-3 bg-white/10'
                          }`}
                        />
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleFinish()}
                    className="text-[12px] text-white/40 hover:text-white"
                  >
                    Skip
                  </button>
                </div>

                {/* QUESTION 1 */}
                {step === 'question_1' && (
                  <div className="animate-in fade-in duration-200">
                    <h4 className="text-[19px] sm:text-[21px] font-semibold tracking-tight text-white">
                      What frustrates you most about money tracking?
                    </h4>
                    <p className="mt-1 text-[13px] text-white/50 leading-snug">
                      Tap your biggest friction point. We’ll solve it first.
                    </p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {PAIN_POINTS.map((opt) => {
                        const isSelected = answers.primaryPainPoint === opt.label
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              recordAnswer({ primaryPainPoint: opt.label })
                              setTimeout(() => setStep('question_2'), 220)
                            }}
                            className={`group flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all active:scale-[0.98] ${
                              isSelected
                                ? 'border-violet bg-violet/20 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                                : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xl" role="img" aria-hidden="true">{opt.icon}</span>
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
                            <div className="mt-2.5">
                              <p className="text-[13.5px] font-medium text-white leading-snug">{opt.label}</p>
                              <p className="mt-0.5 text-[11.5px] text-white/45 leading-snug">{opt.desc}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* QUESTION 2 */}
                {step === 'question_2' && (
                  <div className="animate-in fade-in duration-200">
                    <h4 className="text-[19px] sm:text-[21px] font-semibold tracking-tight text-white">
                      How do you track your expenses today?
                    </h4>
                    <p className="mt-1 text-[13px] text-white/50 leading-snug">
                      Helps us calibrate import tools & automatic tracking.
                    </p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {TRACKING_METHODS.map((opt) => {
                        const isSelected = answers.currentTrackingMethod === opt.label
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              recordAnswer({ currentTrackingMethod: opt.label })
                              setTimeout(() => setStep('question_3'), 220)
                            }}
                            className={`group flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all active:scale-[0.98] ${
                              isSelected
                                ? 'border-violet bg-violet/20 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                                : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                            }`}
                          >
                          <div className="flex items-center justify-between">
                            <span className="text-xl" role="img" aria-hidden="true">{opt.icon}</span>
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
                          <div className="mt-2.5">
                            <p className="text-[13.5px] font-medium text-white leading-snug">{opt.label}</p>
                            <p className="mt-0.5 text-[11.5px] text-white/45 leading-snug">{opt.desc}</p>
                          </div>
                        </button>
                      )})}
                    </div>
                  </div>
                )}

                {/* QUESTION 3 */}
                {step === 'question_3' && (
                  <div className="animate-in fade-in duration-200">
                    <h4 className="text-[19px] sm:text-[21px] font-semibold tracking-tight text-white">
                      What is the #1 outcome you want from Zeno?
                    </h4>
                    <p className="mt-1 text-[13px] text-white/50 leading-snug">
                      We’ll tune your early-access account setup around this.
                    </p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {OUTCOMES.map((opt) => {
                        const isSelected = answers.desiredOutcome === opt.label
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              recordAnswer({ desiredOutcome: opt.label })
                              setTimeout(() => setStep('question_4'), 220)
                            }}
                            className={`group flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all active:scale-[0.98] ${
                              isSelected
                                ? 'border-violet bg-violet/20 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                                : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xl" role="img" aria-hidden="true">{opt.icon}</span>
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
                            <div className="mt-2.5">
                              <p className="text-[13.5px] font-medium text-white leading-snug">{opt.label}</p>
                              <p className="mt-0.5 text-[11.5px] text-white/45 leading-snug">{opt.desc}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* QUESTION 4 (OPTIONAL) */}
                {step === 'question_4' && (
                  <div className="animate-in fade-in duration-200">
                    <h4 className="text-[19px] sm:text-[21px] font-semibold tracking-tight text-white">
                      Have a dream feature in mind?
                    </h4>
                    <p className="mt-1 text-[13px] text-white/50 leading-snug">
                      Optional. Tell us one thing that would make Zeno indispensable to you.
                    </p>

                    <div className="mt-3.5 flex flex-col gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 focus-within:border-violet-soft/70">
                        <textarea
                          rows={3}
                          value={answers.featureSuggestion || ''}
                          onChange={(e) => {
                            const val = e.target.value
                            answersRef.current.featureSuggestion = val
                            setAnswers((prev) => ({ ...prev, featureSuggestion: val }))
                          }}
                          placeholder="e.g. Split UPI bills with flatmates, salary buckets, WhatsApp expense bot..."
                          className="w-full resize-none border-0 bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/30"
                        />
                      </div>

                      <label className="group flex cursor-pointer select-none items-center gap-2 text-[12px] text-white/60">
                        <span className="relative flex size-4 shrink-0 items-center justify-center rounded border border-white/20 bg-white/[0.06] group-hover:border-violet-soft/60">
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
                            className={`grid size-full place-items-center rounded ${
                              answers.featureContactConsent ? 'bg-violet text-white opacity-100' : 'opacity-0'
                            }`}
                          >
                            <Check size={10} strokeWidth={3} />
                          </span>
                        </span>
                        <span>Open to a quick 15-min beta tester call</span>
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          handleFinish({
                            featureSuggestion: answers.featureSuggestion,
                            featureContactConsent: answers.featureContactConsent,
                          })
                        }
                        className="mt-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[13.5px] font-semibold text-black transition-all hover:scale-[1.01] active:scale-[0.98]"
                      >
                        <span>Finish & Claim VIP Spot</span>
                        <Sparkle size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: FINAL COMPLETION */}
            {step === 'completed' && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-3.5">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-violet/40 bg-violet/20 shadow-[0_0_35px_rgba(139,92,246,0.35)]">
                    <Sparkle size={22} className="text-violet-soft" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-violet/30 bg-violet/10 px-2.5 py-0.5 text-[11px] font-semibold text-violet-soft uppercase">
                      <Zap size={11} />
                      VIP Priority Locked
                    </span>
                    <h3 className="mt-1 text-[22px] sm:text-[25px] font-semibold tracking-tight text-white">
                      You’re all set!
                    </h3>
                  </div>
                </div>

                <p className="text-[14.5px] text-white/70 leading-relaxed">
                  Thank you for shaping Zeno. We’ve locked in your priority invite tailored around{' '}
                  <span className="font-semibold text-white">
                    {answers.desiredOutcome || 'smart effortless tracking'}
                  </span>
                  .
                </p>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-[13.5px] font-medium text-white">Refer others to the link</p>
                  <p className="mt-0.5 text-[12px] text-white/50">
                    Invite friends or colleagues to move up the access queue:
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex h-10 min-w-0 flex-1 items-center rounded-xl border border-white/10 bg-black/40 px-3 text-xs text-white/80">
                      <span className="truncate">{inviteLink}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-white px-3.5 text-xs font-semibold text-black transition-all hover:scale-105 active:scale-95"
                    >
                      {copiedLink ? (
                        <>
                          <Check size={13} className="text-emerald-600" strokeWidth={3} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink size={12} />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-1 flex h-11 w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] text-[13px] font-medium text-white/80 transition-colors hover:bg-white/[0.1] hover:text-white"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
