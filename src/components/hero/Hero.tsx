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
      // If page was loaded/restored already scrolled down, keep resting state
      if (window.scrollY > 100) {
        gsap.fromTo(
          head.current,
          { opacity: 1, scale: 1, yPercent: 0 },
          {
            opacity: 0,
            scale: 0.93,
            yPercent: -6,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => `+=${window.innerHeight * 0.85}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
        return
      }

      const isMobile = window.innerWidth < 768
      const startY = isMobile ? 120 : 180
      const startScale = isMobile ? 0.92 : 0.88

      // Master cinematic entrance timeline
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      })

      // Phase 1 & 2 (0–1.6s): Hero headline reveals with smooth blur-in and subtle vertical rise
      tl.from(
        '[data-hero-line]',
        {
          opacity: 0,
          y: 42,
          filter: 'blur(14px)',
          duration: 1.4,
          stagger: 0.16,
          clearProps: 'filter',
        },
        0,
      )

      // Phase 2 (0.45–1.9s): Phone & hand mockup enters from below, scaling upward realistically
      tl.fromTo(
        art.current,
        {
          opacity: 0,
          y: startY,
          scale: startScale,
        },
        {
          opacity: 1,
          y: isMobile ? 40 : 55,
          scale: isMobile ? 0.96 : 0.94,
          duration: 1.5,
          ease: 'power3.out',
        },
        0.45,
      )

      // Phase 3 & 4 (1.8–3.4s): Phone & hand smoothly rises into primary hero position
      tl.to(
        art.current,
        {
          y: 0,
          scale: 1,
          duration: 1.6,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        },
        1.8,
      )

      // Headline responds to mockup's rise with subtle depth recession
      tl.to(
        '[data-hero-line]',
        {
          y: -10,
          opacity: 0.88,
          duration: 1.6,
          ease: 'power2.out',
        },
        1.8,
      )

      // Phase 5 (2.5–3.6s): Supporting copy & CTA buttons glide into place
      tl.from(
        '[data-hero-copy]',
        {
          opacity: 0,
          y: 28,
          duration: 1.1,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        },
        2.5,
      )

      // Scroll-driven interaction: headline softens and recedes as user scrolls past hero
      gsap.fromTo(
        head.current,
        { opacity: 1, scale: 1, yPercent: 0 },
        {
          opacity: 0,
          scale: 0.93,
          yPercent: -6,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * 0.85}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="top" ref={root} className="relative">
      <div ref={head} className="sticky top-0 z-0 px-5 pt-[14vh] sm:pt-[17vh] text-center will-change-transform">
        <h1 className="glow-text mx-auto max-w-[1300px] text-[clamp(2.1rem,6.4vw,6.4rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-balance text-white/75">
          {hero.lines.map((l) => (
            <span key={l} data-hero-line className="block">
              {l}
            </span>
          ))}
        </h1>
      </div>

      <div ref={art} className="relative z-10 mx-auto -mt-[3vh] w-full px-2 sm:-mt-[4vh] md:-mt-[8vh] md:w-[min(1000px,112%)]">
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

      <div className="relative z-10 mx-auto -mt-[8vh] flex max-w-[860px] flex-col items-center px-6 pb-24 text-center sm:-mt-[12vh] md:-mt-[18vh]">
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
