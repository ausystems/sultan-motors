import { useEffect, type RefObject } from 'react'
import { ensureGsap, reducedMotion, entranceAllowed, ease, SplitText } from './gsap'

/*
 * The above-the-fold entrance, run once on mount rather than on scroll.
 *
 * The headline is split into lines and each line rises out of its own
 * overflow mask; the supporting copy and action follow a beat later. Splitting
 * happens after hydration, on the client only, so the prerendered heading is
 * ordinary text for crawlers and screen readers (SplitText also mirrors the
 * original text into aria attributes for assistive tech).
 *
 * Everything lives on one timeline, and a native timer completes that
 * timeline if it has not finished on its own. The entrance starts by hiding
 * content that the server already rendered; if the animation ticker then
 * fails to run (a tab opened in the background on a phone, an aggressive
 * Low Power Mode, an exception elsewhere on the page), the hero must not be
 * left blank. setTimeout is not tied to the frame loop, so it fires even
 * when requestAnimationFrame does not.
 */
export function useHeroReveal<T extends HTMLElement>(scope: RefObject<T | null>) {
  useEffect(() => {
    const root = scope.current
    if (!root || reducedMotion() || !entranceAllowed()) return
    const gsap = ensureGsap()

    const headline = root.querySelector<HTMLElement>('[data-hero-title]')
    const rest = root.querySelectorAll<HTMLElement>('[data-hero-rest]')
    const media = root.querySelector<HTMLElement>('[data-hero-media]')

    let split: { revert: () => void } | null = null
    const tl = gsap.timeline({ defaults: { ease: ease.out } })

    const ctx = gsap.context(() => {
      if (media) {
        tl.from(media, { scale: 1.06, duration: 2.2 }, 0)
      }

      if (headline) {
        split = SplitText.create(headline, {
          type: 'lines',
          linesClass: 'hero-line',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            tl.from(
              self.lines,
              { yPercent: 110, duration: 1.3, ease: ease.out, stagger: 0.09 },
              0.15,
            ),
        })
      }

      if (rest.length) {
        tl.from(rest, { y: 18, opacity: 0, duration: 1, stagger: 0.1 }, 0.55)
      }
    }, root)

    // Safety: the text is fully in by 1.8s and the photograph settles by 2.2s.
    // Shortly after, force the end state if the frame loop never got there.
    const guard = window.setTimeout(() => {
      if (tl.progress() < 1) tl.progress(1)
    }, 2600)

    return () => {
      window.clearTimeout(guard)
      split?.revert()
      ctx.revert()
    }
  }, [scope])
}
