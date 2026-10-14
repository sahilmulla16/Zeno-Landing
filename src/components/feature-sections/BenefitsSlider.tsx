import { Fragment, useRef, type ReactNode } from 'react'
import { benefits } from '../../config/content'
import { useReveal } from '../../hooks/useReveal'
import { Button } from '../ui/Button'
import { ChevronLeft, ChevronRight } from '../ui/Icons'

/* ---- slide visuals: all HTML/SVG, no borrowed artwork ---- */

function BowTie() {
  return (
    <svg viewBox="0 0 760 260" className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <linearGradient id="bt-a" x1="0" x2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="bt-b" x1="1" x2="0">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <radialGradient id="bt-g">
          <stop offset="0" stopColor="#a78bfa" stopOpacity=".45" />
          <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="380" cy="130" r="150" fill="url(#bt-g)" />
      <path d="M0 40 L330 118 M0 224 L330 142" stroke="url(#bt-a)" strokeWidth="3" fill="none" />
      <path d="M760 40 L430 118 M760 224 L430 142" stroke="url(#bt-b)" strokeWidth="3" fill="none" />
      {[62, 84, 106].map((r, i) => (
        <circle key={r} cx="380" cy="130" r={r} fill="none" stroke={['#f59e0b', '#a78bfa', '#ffffff'][i]} strokeOpacity={0.5 - i * 0.12} strokeWidth="2" />
      ))}
    </svg>
  )
}

function Donut() {
  const segs = [
    { c: '#ff8a00', len: 42 },
    { c: '#16c172', len: 16 },
    { c: '#3b82f6', len: 12 },
    { c: '#ef4444', len: 10 },
    { c: '#e8c98a', len: 8 },
  ]
  const R = 70
  const C = 2 * Math.PI * R
  let offset = 0
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
      <div className="relative size-[190px]">
        <svg viewBox="0 0 200 200" className="size-full -rotate-90">
          <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="18" />
          {segs.map((s) => {
            const dash = (s.len / 100) * C
            const el = (
              <circle
                key={s.c}
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke={s.c}
                strokeWidth="18"
                strokeLinecap="round"
                strokeDasharray={`${dash - 6} ${C}`}
                strokeDashoffset={-offset}
              />
            )
            offset += dash
            return el
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[34px] font-extrabold leading-none">10%</p>
            <p className="mt-1 text-[12px] text-white/50">budget spent</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Bars() {
  const h = [38, 56, 44, 78, 52, 92, 64, 48, 70]
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-3 px-16 pb-6" aria-hidden="true">
      {h.map((v, i) => (
        <span
          key={i}
          className="w-6 rounded-t-lg bg-gradient-to-t from-violet/10 to-violet-soft"
          style={{ height: `${v}%`, opacity: 0.45 + (i % 4) * 0.14 }}
        />
      ))}
    </div>
  )
}

function Chips() {
  const chips = ['Spending insights', 'Can I afford this?', 'Saving tips']
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" aria-hidden="true">
      <div className="rounded-2xl rounded-br-md bg-white/10 px-5 py-3 text-[15px] font-medium">Where did my money go this month?</div>
      <div className="flex flex-wrap justify-center gap-2.5 px-8">
        {chips.map((c) => (
          <span key={c} className="rounded-full border border-violet/40 bg-violet/10 px-4 py-2 text-[13px] font-semibold text-violet-soft">
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}

const VISUALS: ReactNode[] = [
  <Fragment key="bow">
    <BowTie />
    <img src="/img/mascot.webp" alt="" width={110} height={110} loading="lazy" className="absolute left-1/2 top-1/2 size-[104px] -translate-x-1/2 -translate-y-1/2 object-contain" />
  </Fragment>,
  <Donut key="donut" />,
  <Bars key="bars" />,
  <Chips key="chips" />,
]

export function BenefitsSlider() {
  const head = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  useReveal(head, { y: 36 })
  useReveal(track, { y: 50, blur: 10, duration: 1.2 })

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-slide]')
    const step = (card?.offsetWidth ?? 600) + 20
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <section aria-labelledby="benefits-title" className="relative pb-32 pt-20 md:pt-32">
      <div ref={head} className="mx-auto flex max-w-[1560px] flex-col gap-8 px-5 md:flex-row md:items-end md:justify-between md:px-10 lg:px-[7%]">
        <div>
          <h2 id="benefits-title" className="max-w-[760px] text-[clamp(2.2rem,4.6vw,4.2rem)] font-semibold leading-[1.1] tracking-[-0.04em]">
            {benefits.title}
          </h2>
          <p className="mt-5 max-w-[640px] text-[18px] leading-snug text-white/65">{benefits.body}</p>
        </div>
        <Button href="#waitlist" size="lg" className="self-start md:self-end">
          {benefits.cta}
        </Button>
      </div>

      <div className="relative mx-auto mt-14 max-w-[1700px]">
        <div
          ref={track}
          role="group"
          aria-roledescription="carousel"
          aria-label="Zeno benefits"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') scrollBy(1)
            if (e.key === 'ArrowLeft') scrollBy(-1)
          }}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 md:px-10 lg:px-[7%]"
        >
          {benefits.slides.map((s, i) => (
            <article
              key={s.title}
              data-slide
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${benefits.slides.length}`}
              className="card relative flex h-[340px] w-[min(760px,86vw)] shrink-0 snap-start flex-col overflow-hidden bg-[linear-gradient(180deg,#10101a,#0a0a10)] md:h-[380px]"
            >
              <div className="relative flex-1 overflow-hidden">{VISUALS[i]}</div>
              <div className="px-7 pb-7">
                <h3 className="text-[22px] font-semibold tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-1.5 max-w-[620px] text-[15px] leading-snug text-white/55">{s.body}</p>
              </div>
            </article>
          ))}
          <div aria-hidden className="w-1 shrink-0 md:w-10" />
        </div>

        <div className="mt-6 flex justify-center gap-3 px-5 md:mt-0 md:block md:px-0">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous slide"
            className="grid size-12 place-items-center rounded-full bg-white/90 text-black shadow-lg transition-transform hover:scale-105 md:absolute md:left-[3%] md:top-[44%] md:-translate-y-1/2 lg:left-[3.5%]"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next slide"
            className="grid size-12 place-items-center rounded-full bg-white/90 text-black shadow-lg transition-transform hover:scale-105 md:absolute md:right-[3%] md:top-[44%] md:-translate-y-1/2 lg:right-[3.5%]"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  )
}
