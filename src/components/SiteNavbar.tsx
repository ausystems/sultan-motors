import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useLocation } from 'react-router-dom'
import SiteLink from './SiteLink'
import Crossfade from './Crossfade'
import { serviceLinks } from '../data/links'
import { business, openingHours } from '../data/site'
import { ensureGsap, reducedMotion, ease } from '../motion/gsap'
import { useMediaQuery } from '../motion/useMediaQuery'

const primaryLinks = [
  { label: 'Home', to: '/', exact: true },
  { label: 'About', to: '/about-us' },
  { label: 'Book an appointment', to: '/contact' },
]

/**
 * A persistent bar that stays out of the way, and a full-screen index when
 * asked for.
 *
 * The bar is transparent over each page's dark opening and gains a near-solid
 * ink field once the visitor scrolls. It is a flat tint, not a backdrop blur:
 * nothing on the site may blur a photograph, including one passing under it. The menu lists every route on the site
 * at once: three primary destinations and the twelve services, numbered, with
 * the hovered service's photograph shown alongside on wide screens. Escape
 * closes it, focus is returned to the button that opened it, and the page
 * behind it does not scroll while it is open.
 */
export default function SiteNavbar(_props: { theme?: 'dark' } = {}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [preview, setPreview] = useState<string>('home.visit')
  const { pathname } = useLocation()
  const menuButton = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const wide = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Route change always closes the menu.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Scroll lock, focus management, and the entrance while open.
  useEffect(() => {
    if (!open) return
    // Captured once: by the time the cleanup runs these refs may point elsewhere.
    const opener = menuButton.current
    const panel = dialog.current
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel?.querySelector<HTMLElement>('[data-menu-close]')?.focus()

    if (!reducedMotion() && panel) {
      const gsap = ensureGsap()
      const ctx = gsap.context(() => {
        gsap.from('[data-menu-item]', {
          y: 26,
          opacity: 0,
          duration: 0.9,
          ease: ease.out,
          stagger: 0.035,
          delay: 0.05,
        })
        gsap.from('[data-menu-media]', {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.2,
          ease: ease.out,
          delay: 0.15,
        })
      }, panel)
      return () => {
        ctx.revert()
        document.body.style.overflow = previous
        opener?.focus()
      }
    }
    return () => {
      document.body.style.overflow = previous
      opener?.focus()
    }
  }, [open])

  const onDialogKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      return
    }
    if (e.key !== 'Tab' || !dialog.current) return
    const focusable = dialog.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    )
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <>
      {/* Reserves the bar's height so page content starts below it. */}
      <div className="h-16 md:h-[4.5rem]" aria-hidden="true" />

      <header
        className={`fixed inset-x-0 top-0 z-50 text-paper transition-[background-color,box-shadow] duration-500 ${
          scrolled && !open
            ? 'bg-ink/90 shadow-[0_1px_0_0_rgba(255,255,255,0.08)]'
            : 'bg-transparent'
        }`}
      >
        <div className="wrap flex h-16 items-center justify-between md:h-[4.5rem]">
          <SiteLink
            to="/"
            exact
            className="t-index text-[12px] font-semibold tracking-[0.2em] text-paper"
            aria-label="Sultan Motors, home"
          >
            Sultan Motors
          </SiteLink>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={`tel:${business.phoneRaw}`}
              className="link-ul t-small hidden text-paper/80 hover:text-paper md:inline"
            >
              {business.phoneDisplay}
            </a>
            <SiteLink to="/contact" className="btn btn-accent !h-10 !px-5 text-sm">
              Book
            </SiteLink>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group flex h-10 items-center gap-2.5 rounded-full px-2 text-sm font-medium text-paper"
            >
              <span>Menu</span>
              <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
                <span className="block h-px w-full bg-current transition-transform duration-500 group-hover:translate-x-0.5" />
                <span className="block h-px w-full bg-current transition-transform duration-500 group-hover:-translate-x-0.5" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="site-menu"
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          onKeyDown={onDialogKey}
          className="fixed inset-0 z-[60] overflow-y-auto bg-ink text-paper"
        >
          <div className="wrap flex h-16 items-center justify-between md:h-[4.5rem]">
            <span className="t-index text-[12px] font-semibold tracking-[0.2em]">Sultan Motors</span>
            <button
              type="button"
              data-menu-close
              onClick={() => setOpen(false)}
              className="group flex h-10 items-center gap-2.5 rounded-full px-2 text-sm font-medium"
            >
              <span>Close</span>
              <span aria-hidden="true" className="relative block h-5 w-5">
                <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
                <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <div className="wrap grid-12 gap-y-14 pb-16 pt-8 md:pt-12 lg:min-h-[calc(100vh-4.5rem)] lg:pb-12">
            <nav className="col-span-12 lg:col-span-7" aria-label="Primary">
              <ul className="flex flex-col">
                {primaryLinks.map((link) => (
                  <li key={link.to} data-menu-item className="rule-dark">
                    <SiteLink
                      to={link.to}
                      exact={link.exact}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setPreview('home.visit')}
                      className="group flex items-baseline justify-between py-4 md:py-5"
                    >
                      <span className="t-h2 font-medium transition-colors duration-300 group-hover:text-accent">
                        {link.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="t-small text-paper/40 transition-transform duration-500 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </SiteLink>
                  </li>
                ))}
              </ul>

              <div className="mt-12 md:mt-16">
                <p data-menu-item className="t-index text-paper/50">
                  Services
                </p>
                <ol className="mt-5 grid gap-x-10 sm:grid-cols-2">
                  {serviceLinks.map((link, i) => (
                    <li key={link.to} data-menu-item>
                      <SiteLink
                        to={link.to}
                        onClick={() => setOpen(false)}
                        onMouseEnter={() => setPreview(`svc.${link.to.slice(1)}.hero`)}
                        onFocus={() => setPreview(`svc.${link.to.slice(1)}.hero`)}
                        className="group flex items-baseline gap-4 py-2"
                      >
                        <span className="t-index tnum w-7 shrink-0 text-paper/40">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="link-ul text-[1.0625rem] leading-snug text-paper/85 transition-colors duration-300 group-hover:text-paper">
                          {link.label.replace(' Brampton', '')}
                        </span>
                      </SiteLink>
                    </li>
                  ))}
                </ol>
              </div>

              <address
                data-menu-item
                className="t-small mt-12 grid gap-1 not-italic text-paper/60 sm:grid-cols-2 md:mt-16"
              >
                <div>
                  <p>{business.streetAddress}</p>
                  <p>
                    {business.addressLocality}, {business.addressRegion} {business.postalCode}
                  </p>
                </div>
                <div>
                  <a href={`tel:${business.phoneRaw}`} className="link-ul text-paper/85">
                    {business.phoneDisplay}
                  </a>
                  {openingHours.map((block) => (
                    <p key={block.label}>
                      {block.label}: {block.display}
                    </p>
                  ))}
                </div>
              </address>
            </nav>

            {wide && (
              <div className="col-span-5 col-start-8">
                <div data-menu-media className="sticky top-8">
                  <Crossfade slot={preview} sizes="40vw" className="aspect-[4/5] w-full bg-ink-3" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
