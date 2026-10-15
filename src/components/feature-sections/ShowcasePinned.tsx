import { useLayoutEffect, useRef, useState } from 'react'
import { showcase } from '../../config/content'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../lib/motion'
import { PhoneFrame, SCREENS } from '../phone-mockups/PhoneFrame'
import { Chart, Sparkle, Target, Zap } from '../ui/Icons'

const ICONS = { zap: Zap, target: Target, chart: Chart, sparkle: Sparkle }
const SCREEN_LIST = [SCREENS.home, SCREENS.budget, SCREENS.ai]

/**
 * Desktop: The phone is CSS-`sticky` in the right column while the statements scroll past on the left;
 * the active statement brightens and the phone cross-fades to the matching Zeno screen.
 *
 * Mobile: Pinned walkthrough experience. The phone stays pinned in the viewport with responsive clamping
 * (never feeling congested or oversized) while the active feature title, icon badge, and screen cross-fade
 * in perfect synchronization with scroll progression and interactive step pills.
 */
export function ShowcasePinned() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const screenIndex = (key: 'home' | 'budget' | 'ai') => SCREEN_LIST.indexOf(SCREENS[key])
  const shown = screenIndex(showcase[active].screen)

  function scrollToStep(i: number) {
    setActive(i)
    const mobileTriggers = root.current?.querySelectorAll<HTMLElement>('[data-statement-mobile]')
    if (mobileTriggers && mobileTriggers[i]) {
      mobileTriggers[i].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const diffX = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diffX) > 44) {
      if (diffX > 0 && active < showcase.length - 1) {
        scrollToStep(active + 1)
      } else if (diffX < 0 && active > 0) {
        scrollToStep(active - 1)
      }
    }
    touchStartX.current = null
  }

  useLayoutEffect(() => {
    const triggers: ScrollTrigger[] = []

    // 1. Desktop triggers
    const desktopItems = root.current?.querySelectorAll<HTMLElement>('[data-statement-desktop]') ?? []
    desktopItems.forEach((el, i) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 62%',
          end: 'bottom 62%',
          invalidateOnRefresh: true,
          onToggle: (self) => self.isActive && setActive(i),
        }),
      )
    })

    // 2. Mobile scroll checkpoints
    const mobileItems = root.current?.querySelectorAll<HTMLElement>('[data-statement-mobile]') ?? []
    mobileItems.forEach((el, i) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          invalidateOnRefresh: true,
          onToggle: (self) => self.isActive && setActive(i),
        }),
      )
    })

    if (!prefersReducedMotion()) {
      const ctx = gsap.context(() => {
        // Desktop phone entrance
        gsap.from('[data-phone-wrap]', {
          y: 140,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true, invalidateOnRefresh: true },
        })

        // Mobile phone entrance
        gsap.from('[data-phone-wrap-mobile]', {
          y: 60,
          scale: 0.94,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: root.current, start: 'top 75%', once: true, invalidateOnRefresh: true },
        })
      }, root)

      return () => {
        triggers.forEach((t) => t.kill())
        ctx.revert()
      }
    }

    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <section ref={root} aria-label="Zeno feature walkthrough" className="relative px-5 md:px-10">
      {/* ------------------------------------------------------------- */}
      {/* DESKTOP EXPERIENCE (lg:grid): Original 2-column pinned layout */}
      {/* ------------------------------------------------------------- */}
      <div className="mx-auto hidden max-w-[1560px] gap-x-10 lg:grid lg:grid-cols-[1.05fr_1fr]">
        <ol className="relative z-10 list-none">
          {showcase.map((s, i) => {
            const Icon = ICONS[s.icon]
            const on = i === active
            return (
              <li
                key={s.title}
                data-statement-desktop
                className="flex min-h-[78vh] items-center py-10 lg:pl-[8%]"
              >
                <div className="flex w-full items-start gap-5">
                  <span
                    aria-hidden="true"
                    className={`mt-2 grid size-11 shrink-0 place-items-center rounded-full border border-white/20 bg-[radial-gradient(circle_at_30%_30%,rgb(139_92_246/0.5),rgb(20_20_30))] text-amber-200 transition-opacity duration-700 ${
                      on ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    <Icon size={20} />
                  </span>
                  <div className="flex-1">
                    <h3
                      className={`max-w-[520px] text-[clamp(1.9rem,3.1vw,3rem)] font-semibold leading-[1.12] tracking-[-0.03em] transition-[color,opacity] duration-700 ${
                        on ? 'text-white' : 'text-white/35'
                      }`}
                    >
                      {s.title}
                    </h3>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>

        <div>
          <div className="sticky top-0 flex h-screen items-center justify-center">
            <div data-phone-wrap>
              <PhoneFrame screens={SCREEN_LIST} active={shown} width="min(380px, 40vh)" />
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE EXPERIENCE (< lg): Pinned, elevated, synced animation */}
      {/* ------------------------------------------------------------- */}
      <div className="relative block lg:hidden">
        {/* Sticky viewport pinned with clean clearance */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="sticky top-14 sm:top-16 z-10 flex h-[calc(100dvh-4rem)] flex-col justify-between pt-2 pb-5 select-none"
        >
          {/* Vertical Slider Motion Indicator placed at the rightmost part */}
          <div className="absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1.5 rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur-md shadow-lg">
            {showcase.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToStep(i)}
                aria-label={`Jump to feature ${i + 1}`}
                className="flex items-center justify-center p-1"
              >
                <span
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    i === active
                      ? 'h-6 bg-violet-soft shadow-[0_0_12px_rgba(167,139,250,0.85)]'
                      : 'h-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Top Section: Animated Statement */}
          <div className="flex flex-col items-center text-center px-6 pt-1">
            <div
              key={active}
              className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <h3 className="max-w-[340px] text-[19px] sm:text-[22px] font-semibold leading-tight tracking-tight text-white min-h-[46px] flex items-center justify-center">
                {showcase[active].title}
              </h3>
            </div>
          </div>

          {/* Center Section: Elevated titanium-frame phone with padding above and below */}
          <div
            data-phone-wrap-mobile
            className="my-auto flex items-center justify-center px-4 py-3 sm:py-4 transition-transform duration-500"
          >
            <PhoneFrame
              screens={SCREEN_LIST}
              active={shown}
              width="min(245px, 44vh, 60vw)"
              priority={true}
            />
          </div>

          {/* Bottom Section: Interaction cue with dedicated padding above and below */}
          <div className="pt-2 pb-4 flex items-center justify-center gap-1.5 text-[11.5px] font-medium text-white/40">
            <span>Scroll or swipe to explore</span>
            <span className="animate-bounce text-[13px]">↓</span>
          </div>
        </div>

        {/* Scroll trigger checkpoints driving the sticky progression */}
        <div className="-mt-[calc(100dvh-3.5rem)] pointer-events-none">
          {showcase.map((s) => (
            <div
              key={s.title}
              data-statement-mobile
              className="h-[75vh]"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
