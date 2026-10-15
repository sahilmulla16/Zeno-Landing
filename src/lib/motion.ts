import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Re-measure trigger positions once fonts + images settle, and on viewport changes (prevents drift/glitches). */
export function refreshOnLoad(): () => void {
  let rafId: number | undefined
  const scheduleRefresh = () => {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
  }

  const immediateRefresh = () => ScrollTrigger.refresh()

  window.addEventListener('load', immediateRefresh)
  window.addEventListener('resize', scheduleRefresh)
  window.addEventListener('orientationchange', immediateRefresh)
  void document.fonts?.ready.then(immediateRefresh)

  return () => {
    window.removeEventListener('load', immediateRefresh)
    window.removeEventListener('resize', scheduleRefresh)
    window.removeEventListener('orientationchange', immediateRefresh)
    if (rafId) cancelAnimationFrame(rafId)
  }
}
