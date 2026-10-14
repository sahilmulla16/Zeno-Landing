import { useLayoutEffect, useRef } from 'react'
import { hero } from '../../config/content'
import { gsap, prefersReducedMotion } from '../../lib/motion'
import { Button } from '../ui/Button'

/**
 * Reference behaviour: oversized headline sits behind a phone-in-hand that rises over it as you scroll;
 * the headline softens away, then supporting copy + CTA appear under the hand.
 * The headline is `sticky`, the image scrolls naturally above it — no scroll hijacking.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)
  const head = useRef<HTMLDivElement>(null)
  const art = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-line]', {
        opacity: 0,
        y: 48,
        filter: 'blur(14px)',
        duration: 1.3,
        ease: 'power3.out',
        stagger: 0.16,
        clearProps: 'filter,opacity,transform',
      })
      gsap.from(art.current, { opacity: 0, y: 110, duration: 1.5, ease: 'power3.out', delay: 0.25, clearProps: 'opacity,transform' })
      gsap.fromTo(
        head.current,
        { opacity: 1, scale: 1, yPercent: 0 },
        {
          opacity: 0,
          scale: 0.93,
          yPercent: -6,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${window.innerHeight * 0.85}`, scrub: true },
        },
      )
      gsap.from('[data-hero-copy]', {
        opacity: 0,
        y: 32,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: '[data-hero-copy]', start: 'top 92%', once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="top" ref={root} className="relative">
      <div ref={head} className="sticky top-0 z-0 px-5 pt-[17vh] text-center will-change-transform">
        <h1 className="glow-text mx-auto max-w-[1300px] text-[clamp(2.5rem,6.4vw,6.4rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-balance text-white/75">
          {hero.lines.map((l) => (
            <span key={l} data-hero-line className="block">
              {l}
            </span>
          ))}
        </h1>
      </div>

      <div ref={art} className="relative z-10 mx-auto -mt-[4vh] w-full md:w-[min(1000px,112%)] px-2 md:-mt-[8vh]">
        <img
          src="img/hand-home.webp"
          alt="A hand holding a phone showing the Zeno home screen with wallet and latest transactions"
          width={1024}
          height={1536}
          fetchPriority="high"
          decoding="async"
          className="block h-auto w-full [mask-image:linear-gradient(to_bottom,#000_72%,transparent_100%)]"
        />
      </div>

      <div className="relative z-10 mx-auto -mt-[14vh] flex max-w-[860px] flex-col items-center px-6 pb-24 text-center md:-mt-[18vh]">
        <p data-hero-copy className="max-w-[640px] text-[17px] font-medium leading-relaxed text-white/80 md:text-[19px]">
          {hero.body}
        </p>
        <div data-hero-copy className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button href="#waitlist" size="lg">
            {hero.primary}
          </Button>
          <Button href="#features" size="lg" variant="ghost">
            {hero.secondary}
          </Button>
        </div>
        <div aria-hidden className="mt-24 h-px w-full max-w-[460px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>
    </section>
  )
}
