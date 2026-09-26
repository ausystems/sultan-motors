import { reducedMotion } from './gsap'

/*
 * Page-to-page transition: the twelve column curtain.
 *
 * Twelve ink columns, on the same grid the layouts use, close over the
 * outgoing page from the top edge. The route swaps behind them, the scroll is
 * put back to the top while nothing is visible, and the columns then continue
 * downward and off the bottom to uncover the new page. The motion never
 * reverses, which is what makes a new page read as beginning at its top
 * rather than being scrolled there.
 *
 * The animation itself lives in the stylesheet (see `.page-curtain`); this
 * module only builds the element and moves it between phases. That split is
 * deliberate. This is the one animation that covers the whole screen, so it
 * must not depend on the animation frame loop: a JavaScript tween that never
 * ticks would leave a visitor looking at a black rectangle. Every timer here
 * is a native one for the same reason, because setTimeout still fires when
 * requestAnimationFrame does not.
 *
 * Back and forward navigation is left alone. The browser restores those
 * instantly and interposing an animation there feels like fighting the user.
 */

const COLUMNS = 12
/** Per-column offset. Multiplied out below; mirrored by nothing in the CSS. */
const STAGGER_MS = 11
/** Must match the transition durations declared on `.page-curtain`. */
const COVER_MS = 240
const REVEAL_MS = 320
const SETTLE_MS = 420

const LAST_DELAY = STAGGER_MS * (COLUMNS - 1)
const COVER_TOTAL = COVER_MS + LAST_DELAY
const REVEAL_TOTAL = REVEAL_MS + LAST_DELAY

/**
 * If the incoming route never mounts (a chunk that fails to load, an error
 * thrown while rendering), the curtain must not stay over the page. Generous
 * enough for a slow chunk on a poor connection, and far short of the point
 * where a visitor would think the site had died.
 */
const STUCK_TIMEOUT = 4000

let curtain: HTMLElement | null = null
let stuck: number | undefined
/** True between the start of a cover and the end of the matching reveal. */
let running = false

/**
 * The curtain lives outside the React tree. It is built once, on the client,
 * on the first navigation: rendering it as markup would put a decorative
 * element into the prerendered HTML and into hydration for no reason.
 */
function ensureCurtain(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  if (curtain?.isConnected) return curtain
  const el = document.createElement('div')
  el.className = 'page-curtain'
  el.dataset.phase = 'idle'
  el.setAttribute('aria-hidden', 'true')
  for (let i = 0; i < COLUMNS; i += 1) {
    const column = document.createElement('span')
    const bar = document.createElement('i')
    bar.style.setProperty('--column-delay', `${i * STAGGER_MS}ms`)
    column.appendChild(bar)
    el.appendChild(column)
  }
  document.body.appendChild(el)
  curtain = el
  return el
}

/** Parks the curtain off screen and clears every pending timer. */
function release() {
  window.clearTimeout(stuck)
  stuck = undefined
  running = false
  if (curtain) curtain.dataset.phase = 'idle'
  document.getElementById('main-content')?.classList.remove('page-leaving')
}

/**
 * Runs `done` when the last column has finished moving, or when the phase
 * should have finished, whichever comes first. The timer is the one that
 * matters: `transitionend` is an optimisation, not a guarantee, since it does
 * not fire for a transition the browser never started.
 */
function whenPhaseEnds(el: HTMLElement, total: number, done: () => void) {
  const last = el.lastElementChild?.firstElementChild
  let settled = false
  const finish = () => {
    if (settled) return
    settled = true
    window.clearTimeout(timer)
    last?.removeEventListener('transitionend', finish)
    done()
  }
  const timer = window.setTimeout(finish, total + 80)
  last?.addEventListener('transitionend', finish, { once: true })
}

/**
 * Puts the next page at its top, instantly.
 *
 * The stylesheet sets `scroll-behavior: smooth`, which is right for an
 * in-page anchor and wrong here: a programmatic reset would animate, and the
 * new page would appear to scroll up into place instead of starting at its
 * top. An inline declaration beats the stylesheet for the one call that must
 * not animate, and `instant` states the same intent to the browser directly.
 */
export function resetScroll() {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const previous = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  root.style.scrollBehavior = previous
}

/** Closes the curtain. Resolves once the page beneath it is hidden. */
export function leavePage(): Promise<void> {
  if (reducedMotion() || typeof document === 'undefined') return Promise.resolve()
  // A second click while a transition is already running navigates straight
  // away rather than stacking a second cover on top of the first.
  if (running) return Promise.resolve()
  const el = ensureCurtain()
  if (!el) return Promise.resolve()

  running = true
  stuck = window.setTimeout(release, STUCK_TIMEOUT)

  // Park the columns with transitions switched off, force the browser to
  // take that position, and only then arm the phase that animates. Without
  // the reflow the two attribute writes coalesce and nothing moves.
  el.dataset.phase = 'idle'
  void el.offsetWidth
  el.dataset.phase = 'cover'
  document.getElementById('main-content')?.classList.add('page-leaving')

  return new Promise((resolve) => whenPhaseEnds(el, COVER_TOTAL, resolve))
}

/** Uncovers the freshly rendered page and settles it into place. */
export function enterPage() {
  if (typeof document === 'undefined') return

  const main = document.getElementById('main-content')
  main?.classList.remove('page-leaving')

  const el = curtain
  // Nothing to uncover if the cover never ran: a first paint, a click that
  // arrived mid-transition, or reduced motion on the way in.
  if (reducedMotion() || !el || el.dataset.phase !== 'cover') {
    release()
    return
  }

  el.dataset.phase = 'reveal'

  if (main) {
    main.classList.add('page-settling')
    window.setTimeout(() => main.classList.remove('page-settling'), SETTLE_MS + 60)
  }

  whenPhaseEnds(el, REVEAL_TOTAL, release)
}
