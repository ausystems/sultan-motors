import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

/*
 * One place that touches GSAP's global registry, and the only module that
 * imports the plugins. Everything runs client side: the prerenderer never
 * reaches any of this, so the HTML it emits is the fully visible final state
 * and animations only ever run *from* a hidden state *to* that markup.
 */

let registered = false

export function ensureGsap() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, SplitText)
    registered = true
  }
  return gsap
}

/** True when the visitor has asked for less motion; every animation checks it. */
export function reducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/*
 * The site's motion vocabulary. Two easings, three durations. Keeping the
 * set this small is what makes the motion read as one language instead of a
 * collection of effects.
 */
export const ease = {
  out: 'expo.out',
  soft: 'power3.out',
  inOut: 'power2.inOut',
} as const

export const dur = {
  fast: 0.35,
  base: 0.9,
  slow: 1.4,
} as const

export { gsap, ScrollTrigger, SplitText }
