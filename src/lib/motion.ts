import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Re-measure trigger positions once fonts + images settle (prevents drift). */
export function refreshOnLoad(): () => void {
  const refresh = () => ScrollTrigger.refresh()
  window.addEventListener('load', refresh)
  void document.fonts?.ready.then(refresh)
  return () => window.removeEventListener('load', refresh)
}
