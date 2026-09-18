import { useEffect, type RefObject } from 'react'
import { ensureGsap, reducedMotion, ease, dur, ScrollTrigger } from './gsap'

/*
 * Scroll-linked entrances for everything below the fold.
 *
 * Mark an element with `data-reveal` and it rises into place as it enters the
 * viewport. Variants:
 *
 *   data-reveal            rise 28px and fade (default)
 *   data-reveal="image"    un-mask from the bottom while the image settles
 *                          from a slight enlargement, so photographs arrive
 *                          rather than pop
 *   data-reveal="line"     the element's width draws in from the left; used
 *                          for hairline rules
 *   data-reveal-group      stagger every direct child instead of the element
 *
 * Every animation is a `from`, so the markup the server rendered is the final
 * state and nothing is hidden from a crawler or a visitor without JavaScript.
 * With reduced motion on, this hook does nothing at all.
 */
export function useReveal<T extends HTMLElement>(scope: RefObject<T | null>) {
  useEffect(() => {
    const root = scope.current
    if (!root || reducedMotion()) return
    const gsap = ensureGsap()

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        const kind = el.dataset.reveal || 'rise'
        const delay = Number(el.dataset.revealDelay || 0)
        const targets = el.hasAttribute('data-reveal-group')
          ? Array.from(el.children)
          : [el]

        const trigger = {
          trigger: el,
          start: 'top 88%',
          once: true,
        }

        if (kind === 'image') {
          const img = el.querySelector('img') ?? el
          gsap.from(el, {
            clipPath: 'inset(100% 0 0 0)',
            duration: dur.slow,
            ease: ease.out,
            delay,
            scrollTrigger: trigger,
          })
          gsap.from(img, {
            scale: 1.08,
            duration: dur.slow + 0.3,
            ease: ease.out,
            delay,
            scrollTrigger: trigger,
          })
          return
        }

        if (kind === 'line') {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: dur.base,
            ease: ease.out,
            delay,
            scrollTrigger: trigger,
          })
          return
        }

        gsap.from(targets, {
          y: 28,
          opacity: 0,
          duration: dur.base,
          ease: ease.soft,
          delay,
          stagger: targets.length > 1 ? 0.08 : 0,
          scrollTrigger: trigger,
        })
      })
    }, root)

    // Images that finish loading after setup change the layout; recalculate.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [scope])
}
