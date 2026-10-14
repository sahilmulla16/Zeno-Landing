import { useId, useState, type FormEvent } from 'react'
import { goals } from '../../config/content'
import { submitWaitlist, WaitlistError } from '../../lib/supabase/waitlist'
import { isValidEmail } from '../../lib/validation'
import { ArrowRight, Check } from '../ui/Icons'

type State =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; repeat: boolean }
  | { kind: 'error'; message: string }

interface Props {
  /** `panel` adds the optional research question; `compact` is the slim footer variant */
  variant?: 'panel' | 'compact'
  idPrefix?: string
}

export function WaitlistForm({ variant = 'panel', idPrefix = 'wl' }: Props) {
  const uid = useId()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [goal, setGoal] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [state, setState] = useState<State>({ kind: 'idle' })

  const busy = state.kind === 'submitting'
  const errId = `${uid}-err`

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (busy) return
    if (!isValidEmail(email)) return setState({ kind: 'error', message: 'Please enter a valid email address.' })
    if (!consent) return setState({ kind: 'error', message: 'Please tick the box to confirm you’re happy to be emailed.' })
    setState({ kind: 'submitting' })
    try {
      const res = await submitWaitlist({ email, consent, primaryGoal: goal || undefined, website })
      setState({ kind: 'success', repeat: res === 'already_registered' })
    } catch (err) {
      const message = err instanceof WaitlistError ? err.message : 'Something went wrong. Please try again.'
      setState({ kind: 'error', message })
    }
  }

  if (state.kind === 'success') {
    return (
      <div role="status" className="flex max-w-[460px] items-start gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-emerald-400 text-black">
          <Check size={14} />
        </span>
        <p className="text-[15px] leading-snug text-white/90">
          {state.repeat
            ? 'You’re already on the waitlist — nothing more to do. We’ll be in touch.'
            : 'You’re on the waitlist! We’ll email you when beta access opens.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-[460px]">
      <label htmlFor={`${idPrefix}-email`} className="sr-only">
        Email address
      </label>
      <div className="flex h-[58px] items-center rounded-2xl border border-white/10 bg-white/[0.06] pl-5 pr-2 transition-colors focus-within:border-violet-soft/70 focus-within:bg-white/[0.09]">
        <input
          id={`${idPrefix}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Enter email here"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state.kind === 'error') setState({ kind: 'idle' })
          }}
          aria-invalid={state.kind === 'error'}
          aria-describedby={state.kind === 'error' ? errId : undefined}
          className="min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-white/40"
        />
        <button
          type="submit"
          disabled={busy}
          aria-label={busy ? 'Joining waitlist' : 'Join the waitlist'}
          className="grid size-11 place-items-center rounded-xl bg-white text-black transition-[transform,opacity] hover:scale-105 active:scale-95 disabled:opacity-60"
        >
          {busy ? <span className="size-4 animate-spin rounded-full border-2 border-black/30 border-t-black" /> : <ArrowRight size={18} />}
        </button>
      </div>

      {/* honeypot: hidden from people and assistive tech */}
      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {variant === 'panel' && (
        <div className="mt-3">
          <label htmlFor={`${idPrefix}-goal`} className="sr-only">
            What would you most like Zeno to help with? (optional)
          </label>
          <select
            id={`${idPrefix}-goal`}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/10 bg-[#14141a] px-4 text-[14px] text-white/80 outline-none focus:border-violet-soft/70"
          >
            <option value="">What would you most like help with? (optional)</option>
            {goals.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      )}

      <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug text-white/60">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-violet"
        />
        <span>I’d like to be emailed about Zeno’s beta and launch. I can unsubscribe at any time.</span>
      </label>

      <p id={errId} role="alert" className={`mt-3 text-[14px] text-rose-300 ${state.kind === 'error' ? '' : 'hidden'}`}>
        {state.kind === 'error' ? state.message : ''}
      </p>
    </form>
  )
}
