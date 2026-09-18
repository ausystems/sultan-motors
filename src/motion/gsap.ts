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

let firstMountDone = false

/**
 * Whether an entrance animation should play for content that is on screen
 * right now.
 *
 * On the initial page load the server-rendered markup is painted before any
 * of this code runs. If it has been visible for a while (a slow connection,
 * a slow phone), hiding it to play an entrance would yank text the visitor
 * is already reading. So on the first mount the entrance plays only if we got
 * here within a beat of first paint. Every later mount is a client-side
 * navigation to a fresh page, where nothing has been seen yet, and the
 * entrance always plays.
 */
export function entranceAllowed(): boolean {
  if (firstMountDone) return true
  firstMountDone = true
  // A page loaded out of sight (a tab opened from a long-press, a background
  // load) has no frame loop to animate with and nobody watching. Leave the
  // server-rendered content exactly as it is; it will simply be there when
  // the visitor switches to the tab.
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return false
  if (typeof performance === 'undefined') return true
  const paint = performance.getEntriesByName('first-contentful-paint')[0]
  const sincePaint = performance.now() - (paint ? paint.startTime : 0)
  return sincePaint < 700
}
