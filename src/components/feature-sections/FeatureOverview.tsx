import { useRef } from 'react'
import { overview } from '../../config/content'
import { useReveal } from '../../hooks/useReveal'
import { Basket, Car, Cup, Heart, Moon, Sparkle, Wallet } from '../ui/Icons'
import { SCREENS } from '../phone-mockups/PhoneFrame'

/** Orbiting category chips — pure CSS transforms, slow, and disabled under reduced motion. */
const ORBIT = [
  { r: 118, deg: 20, color: '#ff8a00', icon: <Cup size={18} />, ring: 0 },
  { r: 118, deg: 140, color: '#16c172', icon: <Basket size={18} />, ring: 0 },
  { r: 118, deg: 250, color: '#3b82f6', icon: <Car size={18} />, ring: 0 },
  { r: 190, deg: 70, color: '#ef4444', icon: <Heart size={18} />, ring: 1 },
  { r: 190, deg: 200, color: '#10b981', icon: <Moon size={18} />, ring: 1 },
  { r: 190, deg: 320, color: '#a855f7', icon: <Wallet size={18} />, ring: 1 },
]

function ExpenseCard() {
  return (
    <article className="card h-full min-h-[412px] overflow-hidden p-8">
      <h3 className="text-[26px] font-semibold tracking-[-0.02em]">{overview.expense.title}</h3>
      <p className="mt-2 max-w-[420px] text-[18px] leading-snug text-white/55">{overview.expense.body}</p>

      <div className="mt-8 space-y-3" aria-hidden="true">
        <div className="relative flex items-center gap-4 rounded-2xl border border-violet/70 bg-[#120d22] p-3.5 shadow-[0_0_40px_-4px_rgba(139,92,246,0.55),inset_0_0_30px_rgba(139,92,246,0.18)]">
          <span className="grid size-12 place-items-center rounded-xl bg-[#ff5a1f] text-white">
            <Cup size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[19px] font-semibold leading-tight">Noodles</p>
            <p className="truncate text-[14px] text-white/50">Food &amp; Drinks · Today · 10:09 PM</p>
          </div>
          <p className="text-[18px] font-bold">-₹150</p>
        </div>
        <div className="ml-4 flex items-center gap-4 rounded-2xl p-3 opacity-60">
          <span className="grid size-11 place-items-center rounded-xl bg-[#34d3a8] text-[#06281f]">
            <Car size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[17px] font-semibold leading-tight">Uber</p>
            <p className="truncate text-[13px] text-white/45">Transport · Today · 08:43 PM</p>
          </div>
          <p className="text-[16px] font-bold">-₹220</p>
        </div>
        <div className="ml-8 flex items-center gap-4 rounded-2xl p-3 opacity-25">
          <span className="grid size-10 place-items-center rounded-xl bg-white/20">
            <Basket size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold leading-tight">Groceries</p>
            <p className="truncate text-[12px] text-white/45">Shopping · Yesterday</p>
          </div>
        </div>
      </div>
    </article>
  )
}

function BudgetCard() {
  return (
    <article className="card relative h-full min-h-[412px] overflow-visible p-8">
      {/* fanned screens poking out above the card, like the reference's stacked images */}
      <div aria-hidden="true" className="relative mx-auto -mt-[104px] h-[300px] w-[250px]">
        {[
          { s: SCREENS.ai, rot: -13, x: -36, o: 0.55, z: 1 },
          { s: SCREENS.home, rot: -5, x: -14, o: 0.8, z: 2 },
          { s: SCREENS.budget, rot: 5, x: 14, o: 1, z: 3 },
        ].map(({ s, rot, x, o, z }) => (
          <div
            key={s.src}
            className="absolute left-1/2 top-0 h-[300px] w-[200px] -translate-x-1/2 overflow-hidden rounded-[26px] border border-white/15 bg-[#f4f6fb] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.9)]"
            style={{ transform: `translateX(calc(-50% + ${x}px)) rotate(${rot}deg)`, opacity: o, zIndex: z }}
          >
            <img src={s.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
          </div>
        ))}
      </div>
      <h3 className="mt-6 text-[24px] font-semibold tracking-[-0.02em]">{overview.budgets.title}</h3>
      <p className="mt-2 text-[17px] leading-snug text-white/55">{overview.budgets.body}</p>
    </article>
  )
}

function AiCard() {
  return (
    <article className="card relative h-full min-h-[412px] overflow-hidden p-8 lg:min-h-[640px]">
      <h3 className="text-[26px] font-semibold tracking-[-0.02em]">{overview.ai.title}</h3>
      <p className="mt-2 max-w-[420px] text-[18px] leading-snug text-white/55">{overview.ai.body}</p>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-[-120px] mx-auto size-[460px]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgb(236_72_153/0.30),rgb(124_58_237/0.20)_50%,transparent_75%)]" />
        {[118, 190].map((r) => (
          <div
            key={r}
            className="absolute left-1/2 top-1/2 rounded-full border border-white/10"
            style={{ width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r }}
          />
        ))}
        {[0, 1].map((ring) => (
          <div
            key={ring}
            className={`absolute inset-0 ${ring === 0 ? 'animate-orbit' : 'animate-orbit-rev'}`}
          >
            {ORBIT.filter((o) => o.ring === ring).map((o) => (
              <span
                key={o.deg}
                className="absolute left-1/2 top-1/2 grid size-11 place-items-center rounded-full text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.8)] ring-2 ring-white/80"
                style={{
                  background: o.color,
                  transform: `rotate(${o.deg}deg) translateX(${o.r}px) rotate(${-o.deg}deg) translate(-50%,-50%)`,
                }}
              >
                {o.icon}
              </span>
            ))}
          </div>
        ))}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-[-28px] rounded-full bg-white/10 blur-2xl" />
          <img
            src="/img/mascot.webp"
            alt=""
            width={150}
            height={150}
            loading="lazy"
            className="relative size-[150px] object-contain drop-shadow-[0_0_30px_rgba(167,139,250,0.55)]"
          />
        </div>
      </div>
      <Sparkle className="absolute right-7 top-8 text-violet-soft/70" size={22} />
    </article>
  )
}

export function FeatureOverview() {
  const title = useRef<HTMLHeadingElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  useReveal(title, { y: 40 })
  useReveal(grid, { children: '[data-card]', y: 60, duration: 1.1 })

  return (
    <section id="features" className="relative px-5 pb-28 pt-24 md:px-10 md:pt-36">
      <h2
        ref={title}
        className="mx-auto max-w-[1000px] text-center text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.04em]"
      >
        {overview.title}
      </h2>

      <div
        ref={grid}
        className="mx-auto mt-16 grid max-w-[1560px] grid-cols-1 items-start gap-5 md:mt-24 lg:grid-cols-[1.5fr_1fr_1.5fr] lg:gap-8"
      >
        <div data-card className="min-w-0">
          <ExpenseCard />
        </div>
        <div data-card className="mt-24 min-w-0 lg:mt-0">
          <BudgetCard />
        </div>
        <div data-card className="min-w-0">
          <AiCard />
        </div>
      </div>
    </section>
  )
}
