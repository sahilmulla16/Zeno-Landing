import { useLayoutEffect, useRef, useState } from 'react'
import { showcase } from '../../config/content'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../lib/motion'
import { PhoneFrame, SCREENS } from '../phone-mockups/PhoneFrame'
import { Chart, Sparkle, Target, Zap } from '../ui/Icons'

const ICONS = { zap: Zap, target: Target, chart: Chart, sparkle: Sparkle }
const SCREEN_LIST = [SCREENS.home, SCREENS.budget, SCREENS.ai]

/**
 * Desktop: the phone is CSS-`sticky` in the right column while the statements scroll past on the left;
 * the active statement brightens and the phone cross-fades to the matching Zeno screen.
 * The pin releases naturally when the section ends. Mobile: each statement carries its own phone.
 */
export function ShowcasePinned() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const triggers: ScrollTrigger[] = []
    const items = root.current?.querySelectorAll<HTMLElement>('[data-statement]') ?? []
    items.forEach((el, i) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 62%',
          end: 'bottom 62%',
          onToggle: (self) => self.isActive && setActive(i),
        }),
      )
    })
    if (!prefersReducedMotion()) {
      const ctx = gsap.context(() => {
        gsap.from('[data-phone-wrap]', {
          y: 140,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
        })
      }, root)
      return () => {
        triggers.forEach((t) => t.kill())
        ctx.revert()
      }
    }
    return () => triggers.forEach((t) => t.kill())
  }, [])

  const screenIndex = (key: 'home' | 'budget' | 'ai') => SCREEN_LIST.indexOf(SCREENS[key])
  const shown = screenIndex(showcase[active].screen)

  return (
    <section ref={root} aria-label="Zeno feature walkthrough" className="relative overflow-x-clip px-5 md:px-10">
      <div className="mx-auto grid max-w-[1560px] gap-x-10 lg:grid-cols-[1.05fr_1fr]">
        <ol className="relative z-10 list-none">
          {showcase.map((s, i) => {
            const Icon = ICONS[s.icon]
            const on = i === active
            return (
              <li
                key={s.title}
                data-statement
                className="flex min-h-[78vh] items-center py-10 lg:pl-[8%]"
              >
                <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-5">
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
                    {/* mobile-only inline phone */}
                    <div className="mt-10 flex justify-center lg:hidden">
                      <PhoneFrame screens={[SCREENS[s.screen]]} width="min(260px,66vw)" />
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="hidden lg:block">
          <div className="sticky top-0 flex h-screen items-center justify-center">
            <div data-phone-wrap>
              <PhoneFrame screens={SCREEN_LIST} active={shown} width="min(380px, 40vh)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
