import { useEffect, useRef, useState } from 'react'
import { finalCta } from '../../config/content'
import { useReveal } from '../../hooks/useReveal'
import { warmupWaitlist } from '../../lib/supabase/waitlist'
import { WaitlistForm } from './WaitlistForm'

/** Large closing panel — dark, with violet illumination and a phone-in-hand bleeding off the corner. */
export function FinalCta() {
  const head = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [isEngaged, setIsEngaged] = useState(false)

  useReveal(head, { y: 30 })
  useReveal(panel, { y: 60, duration: 1.2 })

  // Pre-warm the Edge Function as soon as user is reading near this section
  useEffect(() => {
    warmupWaitlist()
  }, [])

  return (
    <section id="waitlist" className="relative px-5 pb-24 pt-10 md:px-10">
      <div ref={head} className="mx-auto max-w-[900px] text-center">
        <p className="text-[14px] font-medium text-white/70">{finalCta.eyebrow}</p>
        <h2 className="mt-2 text-[clamp(1.9rem,3.6vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.03em]">
          Experience the future of money with Zeno
        </h2>
      </div>

      <div
        ref={panel}
        className="relative mx-auto mt-12 min-h-[520px] max-w-[1560px] overflow-hidden rounded-[32px] border border-white/[0.07] bg-[#0b0b10] transition-all duration-500 md:min-h-[580px] lg:min-h-[600px]"
      >
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_100%,rgb(139_92_246/0.45),transparent_70%),radial-gradient(40%_60%_at_60%_10%,rgb(236_72_153/0.14),transparent_70%),radial-gradient(50%_60%_at_0%_100%,rgb(59_130_246/0.14),transparent_70%)]" />

        <div
          className={`relative z-10 flex flex-col justify-center gap-5 p-6 pb-6 sm:p-8 md:min-h-[580px] md:gap-6 md:p-12 lg:min-h-[600px] lg:p-16 transition-all duration-300 ${
            isEngaged ? 'md:max-w-[62%] lg:max-w-[64%]' : 'md:max-w-[56%]'
          }`}
        >
          {!isEngaged && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-300">
              <p className="text-[16px] font-medium text-white/80 sm:text-[18px]">Join the waitlist</p>
              <h3 className="max-w-[560px] text-[clamp(1.8rem,3.4vw,3.2rem)] font-medium leading-[1.1] tracking-[-0.03em]">
                {finalCta.title}
              </h3>
              <p className="-mt-1 max-w-[460px] text-[15px] leading-snug text-white/60 sm:text-[17px]">
                {finalCta.body}
              </p>
            </div>
          )}

          <WaitlistForm
            variant="panel"
            idPrefix="cta"
            onEngagedChange={(engaged) => setIsEngaged(engaged)}
          />
        </div>

        <div
          className={`pointer-events-none relative z-0 mx-auto -mb-[22%] mt-4 w-[min(380px,80%)] md:absolute md:bottom-[-18%] md:right-[3%] md:mb-0 md:mt-0 md:w-[min(500px,38%)] transition-opacity duration-500 ${
            isEngaged ? 'opacity-35 md:opacity-85' : 'opacity-100'
          }`}
        >
          <img
            src="img/hand-budget.webp"
            alt="A hand holding a phone showing Zeno’s budgets screen"
            width={1024}
            height={1536}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        </div>
      </div>
    </section>
  )
}
