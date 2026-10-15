import { useLayoutEffect, type RefObject } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

interface RevealOptions {
  y?: number
  delay?: number
  blur?: number
  /** CSS selector of children to stagger instead of the element itself */
  children?: string
  duration?: number
}

/**
 * Subtle fade + rise when an element enters the viewport.
 * Initial state is applied by GSAP (not CSS), so content stays visible if JS animation never runs.
 */
export function useReveal<T extends HTMLElement>(ref: RefObject<T | null>, opts: RevealOptions = {}) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const targets = opts.children ? Array.from(el.querySelectorAll(opts.children)) : [el]
    if (!targets.length) return

    const ctx = gsap.context(() => {
      const vars: gsap.TweenVars = {
        opacity: 0,
        y: opts.y ?? 36,
        duration: opts.duration ?? 1,
        delay: opts.delay ?? 0,
        ease: 'power3.out',
        stagger: 0.12,
        clearProps: 'opacity,transform,filter',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true, invalidateOnRefresh: true },
      }
      if (opts.blur) vars.filter = `blur(${opts.blur}px)`
      gsap.from(targets, vars)
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
