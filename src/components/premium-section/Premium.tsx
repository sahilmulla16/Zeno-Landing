import { useRef } from 'react'
import { premium } from '../../config/content'
import { useReveal } from '../../hooks/useReveal'
import { Button } from '../ui/Button'
import { Chart, Sparkle } from '../ui/Icons'

const ICONS = { chart: Chart, sparkle: Sparkle }

/** Original glassy artwork built from CSS gradients around the existing Zeno mascot. */
function Artwork() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[560px]">
      <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(closest-side,rgb(124_58_237/0.40),rgb(236_72_153/0.16)_55%,transparent_76%)]" />
      <img
        src="img/mascot.webp"
        alt=""
        width={420}
        height={420}
        loading="lazy"
        className="animate-float absolute left-[14%] top-[16%] w-[66%] object-contain drop-shadow-[0_30px_60px_rgba(124,58,237,0.45)]"
      />
      {/* iridescent glass orb */}
      <div className="animate-float absolute bottom-[6%] right-[8%] size-[24%] rounded-full border border-white/40 bg-[conic-gradient(from_200deg,#60a5fa,#a78bfa,#f472b6,#fbbf24,#34d399,#60a5fa)] shadow-[inset_0_-14px_30px_rgba(0,0,0,0.35),inset_0_10px_24px_rgba(255,255,255,0.55),0_20px_50px_-10px_rgba(167,139,250,0.7)] [animation-delay:-3s]" />
      {/* glass bolt */}
      <svg viewBox="0 0 80 120" className="animate-float absolute right-[2%] top-[8%] w-[20%] [animation-delay:-1.5s]">
        <defs>
          <linearGradient id="bolt" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c4b5fd" />
            <stop offset=".5" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <path d="M50 4 8 66h26l-8 50 46-68H44L50 4Z" fill="url(#bolt)" stroke="rgba(255,255,255,.55)" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export function Premium() {
  const copy = useRef<HTMLDivElement>(null)
  const art = useRef<HTMLDivElement>(null)
  useReveal(copy, { children: '[data-r]', y: 36 })
  useReveal(art, { y: 60, duration: 1.3 })

  return (
    <section id="premium" className="relative overflow-hidden px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1560px] items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:px-[4%]">
        <div ref={copy}>
          <p data-r className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet/40 bg-violet/10 px-4 py-1.5 text-[13px] font-semibold text-violet-soft">
            <span className="size-1.5 rounded-full bg-violet-soft" /> {premium.eyebrow}
          </p>
          <h2 data-r className="max-w-[760px] text-[clamp(2.4rem,5.2vw,4.8rem)] font-semibold leading-[1.06] tracking-[-0.04em]">
            {premium.title}
          </h2>
          <p data-r className="mt-6 max-w-[620px] text-[18px] leading-relaxed text-white/65">
            {premium.body}
          </p>
          <ul data-r className="mt-12 grid max-w-[640px] gap-8 sm:grid-cols-2">
            {premium.items.map((it) => {
              const Icon = ICONS[it.icon]
              return (
                <li key={it.title}>
                  <Icon className="text-violet-soft" size={22} />
                  <h3 className="mt-3 text-[18px] font-semibold">{it.title}</h3>
                  <p className="mt-1 text-[15px] leading-snug text-white/55">{it.body}</p>
                </li>
              )
            })}
          </ul>
          <div data-r className="mt-12">
            <Button href="#waitlist" size="lg">
              {premium.cta}
            </Button>
          </div>
        </div>
        <div ref={art}>
          <Artwork />
        </div>
      </div>
    </section>
  )
}
