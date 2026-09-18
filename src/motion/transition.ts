import { ensureGsap, reducedMotion, ease } from './gsap'

/*
 * Page-to-page transition.
 *
 * On a click, the current page drops 10px and fades over 180ms, then the
 * route changes and the incoming page runs its own entrance. That is short
 * enough to read as a single gesture rather than a wait, and it is the only
 * part of the transition that could delay navigation, so it is capped hard.
 *
 * Back/forward navigation is left alone: the browser restores those instantly
 * and interposing an animation there feels like fighting the user.
 */
export function leavePage(): Promise<void> {
  if (reducedMotion() || typeof document === 'undefined') return Promise.resolve()
  const main = document.getElementById('main-content')
  if (!main) return Promise.resolve()

  const gsap = ensureGsap()
  return new Promise((resolve) => {
    // Navigation must never wait on the frame loop. If the tween has not
    // reported completion within twice its duration, go anyway; the incoming
    // page's entrance covers whatever the leave did not finish.
    const guard = window.setTimeout(resolve, 400)
    gsap.to(main, {
      y: 10,
      opacity: 0,
      duration: 0.18,
      ease: ease.inOut,
      onComplete: () => {
        window.clearTimeout(guard)
        resolve()
      },
    })
  })
}

/** Settles the freshly rendered page after a transition. */
export function enterPage() {
  if (reducedMotion() || typeof document === 'undefined') return
  const main = document.getElementById('main-content')
  if (!main) return
  const gsap = ensureGsap()
  gsap.fromTo(
    main,
    { y: 0, opacity: 0 },
    { opacity: 1, duration: 0.5, ease: ease.soft, clearProps: 'all' },
  )
}
