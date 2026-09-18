import { useEffect, type RefObject } from 'react'
import { ensureGsap, reducedMotion, ease, SplitText } from './gsap'

/*
 * The above-the-fold entrance, run once on mount rather than on scroll.
 *
 * The headline is split into lines and each line rises out of its own
 * overflow mask; the supporting copy and action follow a beat later. Splitting
 * happens after hydration, on the client only, so the prerendered heading is
 * ordinary text for crawlers and screen readers (SplitText also mirrors the
 * original text into aria attributes for assistive tech).
 */
export function useHeroReveal<T extends HTMLElement>(scope: RefObject<T | null>) {
  useEffect(() => {
    const root = scope.current
    if (!root || reducedMotion()) return
    const gsap = ensureGsap()

    const headline = root.querySelector<HTMLElement>('[data-hero-title]')
    const rest = root.querySelectorAll<HTMLElement>('[data-hero-rest]')
    const media = root.querySelector<HTMLElement>('[data-hero-media]')

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: ease.out } })

      if (media) {
        tl.from(media, { scale: 1.06, duration: 2.2 }, 0)
      }

      if (headline) {
        SplitText.create(headline, {
          type: 'lines',
          linesClass: 'hero-line',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.3,
              ease: ease.out,
              stagger: 0.09,
              delay: 0.15,
            }),
        })
      }

      if (rest.length) {
        tl.from(rest, { y: 18, opacity: 0, duration: 1, stagger: 0.1 }, 0.55)
      }
    }, root)

    return () => ctx.revert()
  }, [scope])
}
