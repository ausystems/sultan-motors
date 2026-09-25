import { useEffect, type RefObject } from 'react'
import { ensureGsap, reducedMotion, ease, dur, ScrollTrigger, SplitText } from './gsap'

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
 *   data-reveal="chars"    the sentence assembles letter by letter, fast, as
 *                          the block reaches the viewport
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

    // Anything already inside the viewport when this runs is content the
    // visitor can see. It is left exactly as the server rendered it; only
    // elements still below the fold get an entrance, as they scroll in.
    const fold = window.innerHeight * 0.88

    // SplitText rewrites an element's children, which gsap's context does not
    // undo, so the splits are tracked separately and reverted by hand.
    const splits: { revert: () => void }[] = []

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        if (el.getBoundingClientRect().top < fold) return
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

        if (kind === 'chars') {
          /*
           * Characters are split inside word wrappers rather than on their
           * own. A bare character split turns every letter into an inline
           * block, and the browser will then break a line in the middle of a
           * word; keeping the words intact preserves normal line breaking.
           *
           * The split happens here, on the client, after hydration, so the
           * prerendered sentence is ordinary text for crawlers. SplitText
           * mirrors it into an aria-label and hides the pieces from assistive
           * tech, so a screen reader still reads one sentence.
           */
          const split = SplitText.create(el, { type: 'chars,words' })
          splits.push(split)
          gsap.from(split.chars, {
            opacity: 0,
            // A linear ramp at roughly a hundred letters a second: the line
            // reads as arriving rather than as an effect, and a long sentence
            // is complete in well under two seconds. Opacity only, because a
            // per-letter shift makes a paragraph of type jitter.
            duration: 0.3,
            ease: 'none',
            delay,
            stagger: 0.01,
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

    /** Puts every element back exactly as the server rendered it. */
    const restore = () => {
      ctx.revert()
      splits.forEach((split) => split.revert())
      splits.length = 0
    }

    /*
     * Each reveal is a `from`, which means gsap applies the hidden start state
     * the moment the tween is built, before any scrolling. That is what makes
     * the entrance possible, but it also means a page whose frame loop never
     * runs would hold real content at opacity 0 indefinitely: no frames means
     * ScrollTrigger never updates either, so the entrance can never complete.
     *
     * What is probed here is requestAnimationFrame, not gsap's own ticker.
     * The ticker deliberately sleeps while nothing is animating, and on this
     * page nothing animates until the first trigger fires, so an idle ticker
     * says nothing about the health of the page. A single delivered frame
     * does. setTimeout is not tied to the frame loop, so it still fires when
     * rAF does not, and the content goes back to what the server sent.
     *
     * The window is deliberately generous. A slow phone that simply takes a
     * while to reach its first frame should still get its entrances, and the
     * worst case if this fires early is content sitting there unanimated,
     * which is the right way to be wrong.
     */
    let framePainted = false
    const probe = requestAnimationFrame(() => {
      framePainted = true
    })
    const guard = window.setTimeout(() => {
      if (!framePainted) restore()
    }, 2500)

    // Images that finish loading after setup change the layout; recalculate.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => {
      cancelAnimationFrame(probe)
      window.clearTimeout(guard)
      window.removeEventListener('load', refresh)
      restore()
    }
  }, [scope])
}
