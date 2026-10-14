import { useRef } from 'react'
import { site } from '../../config/site'
import { useReveal } from '../../hooks/useReveal'
import { Button } from '../ui/Button'

export function StillQuestions() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, { children: '[data-r]', y: 30 })
  const hasEmail = Boolean(site.contactEmail)
  return (
    <section id="contact" className="relative px-5 py-24 md:px-10 md:py-32">
      <div ref={ref} className="mx-auto max-w-[1560px] lg:px-[7%]">
        <h2 data-r className="max-w-[820px] text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
          Still have questions?
        </h2>
        <p data-r className="mt-5 max-w-[460px] text-[17px] leading-snug text-white/60">
          Can’t find the answer you’re looking for? {hasEmail ? 'Get in touch.' : 'Join the waitlist and ask us when we write.'}
        </p>
        <div data-r className="mt-9">
          {hasEmail ? (
            <Button href={`mailto:${site.contactEmail}`} size="lg">
              Contact us
            </Button>
          ) : (
            <Button href="#waitlist" size="lg">
              Join the Waitlist
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
