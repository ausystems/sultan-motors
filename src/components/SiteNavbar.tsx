import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SiteLink from './SiteLink'
import { InstagramIcon, FacebookIcon, ArrowUpRightIcon, ChevronDownIcon } from './icons'
import { serviceLinks } from '../data/links'
import { socialProfiles } from '../data/site'

const primary = [
  { label: 'Home', to: '/', exact: true },
  { label: 'About', to: '/about-us' },
  { label: 'Contact', to: '/contact' },
]

/**
 * The floating pill. A white capsule inset from the edges, with the wordmark,
 * the four primary destinations, the social marks and the action, sitting
 * over each page's dark opening. It tightens slightly once the visitor
 * scrolls. "Services" opens a two-column index of every service page on
 * hover or click; on narrow screens the same index lives in a panel under
 * the capsule. Escape and a click outside close either.
 *
 * The social marks render only when a profile URL is configured in
 * src/data/site.ts, so an unconfigured profile never ships as a dead link.
 */
export default function SiteNavbar(_props: { theme?: 'dark' } = {}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const root = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // A route change always closes everything.
  useEffect(() => {
    setMenuOpen(false)
    setServicesOpen(false)
  }, [pathname])

  // Escape, or a click anywhere outside the capsule, closes what is open.
  useEffect(() => {
    if (!menuOpen && !servicesOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setServicesOpen(false)
      }
    }
    const onClick = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setServicesOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [menuOpen, servicesOpen])

  const openServices = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setServicesOpen(true)
  }
  const closeServicesSoon = () => {
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 160)
  }

  const socials = [
    { href: socialProfiles.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: socialProfiles.facebook, label: 'Facebook', Icon: FacebookIcon },
  ].filter((s) => s.href)

  return (
    <>
      {/* Reserves the capsule's height plus its inset so content starts below it. */}
      <div className="h-[5.25rem] sm:h-24" aria-hidden="true" />

      <div
        ref={root}
        className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? 'px-3 pt-2 sm:px-6 sm:pt-3' : 'px-3 pt-3 sm:px-4 sm:pt-4'
        }`}
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex items-center justify-between rounded-full bg-paper text-ink shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] ring-1 ring-ink/5 transition-[max-width,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled ? 'max-w-4xl px-3 py-2 sm:px-4' : 'max-w-7xl px-4 py-2.5 sm:px-6 sm:py-3'
          }`}
        >
          <SiteLink
            to="/"
            exact
            aria-label="Sultan Motors, home"
            className="t-index shrink-0 text-[12px] font-bold tracking-[0.2em] text-ink"
          >
            Sultan Motors
          </SiteLink>

          <ul className="hidden items-center gap-7 text-[14px] font-medium text-ink/65 lg:flex xl:gap-9">
            <li>
              <SiteLink to="/" exact activeClassName="text-ink" className="transition-colors hover:text-ink">
                Home
              </SiteLink>
            </li>
            <li
              className="relative"
              onMouseEnter={openServices}
              onMouseLeave={closeServicesSoon}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setServicesOpen(false)
              }}
            >
              <button
                type="button"
                onClick={() => setServicesOpen((o) => !o)}
                aria-expanded={servicesOpen}
                aria-controls="services-menu"
                className={`flex items-center gap-1.5 transition-colors hover:text-ink ${
                  pathname.endsWith('-brampton') ? 'text-ink' : ''
                }`}
              >
                Services
                <ChevronDownIcon
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2.5}
                />
              </button>
              {servicesOpen && (
                <div
                  id="services-menu"
                  className="absolute left-1/2 top-full z-40 mt-4 w-[34rem] -translate-x-1/2 rounded-2xl bg-paper p-3 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] ring-1 ring-ink/5"
                >
                  <ol className="grid grid-cols-2 gap-x-2">
                    {serviceLinks.map((link, i) => (
                      <li key={link.to}>
                        <SiteLink
                          to={link.to}
                          onClick={() => setServicesOpen(false)}
                          className="group flex items-baseline gap-3 rounded-xl px-3 py-2.5 text-[13.5px] text-ink/80 transition-colors hover:bg-paper-2 hover:text-ink"
                        >
                          <span className="t-index tnum text-[10px] text-mute-2">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {link.label.replace(' Brampton', '')}
                        </SiteLink>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </li>
            {primary.slice(1).map((link) => (
              <li key={link.to}>
                <SiteLink to={link.to} activeClassName="text-ink" className="transition-colors hover:text-ink">
                  {link.label}
                </SiteLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="hidden h-9 w-9 items-center justify-center rounded-full text-ink/65 transition-colors hover:text-ink sm:inline-flex"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
            <SiteLink to="/contact" className="btn btn-ink !h-10 !px-4 text-[13px] sm:!px-5">
              <span className="hidden sm:inline">Get in touch</span>
              <span className="sm:hidden">Book</span>
              <ArrowUpRightIcon className="arrow h-4 w-4" />
            </SiteLink>
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-paper-2 lg:hidden"
            >
              <span aria-hidden="true" className="flex w-4 flex-col gap-[4px]">
                <span
                  className={`block h-[2px] w-full bg-ink transition-transform duration-300 ${
                    menuOpen ? 'translate-y-[6px] rotate-45' : ''
                  }`}
                />
                <span className={`block h-[2px] w-full bg-ink transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                <span
                  className={`block h-[2px] w-full bg-ink transition-transform duration-300 ${
                    menuOpen ? '-translate-y-[6px] -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div
            id="mobile-menu"
            className="mx-auto mt-2 max-h-[calc(100dvh-7rem)] max-w-7xl overflow-y-auto rounded-2xl bg-paper p-3 text-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] ring-1 ring-ink/5 lg:hidden"
          >
            <ul className="flex flex-col gap-0.5 text-[15px] font-medium">
              <li>
                <SiteLink to="/" exact onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2.5 hover:bg-paper-2">
                  Home
                </SiteLink>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setServicesOpen((o) => !o)}
                  aria-expanded={servicesOpen}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left hover:bg-paper-2"
                >
                  Services
                  <ChevronDownIcon
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}
                    strokeWidth={2.5}
                  />
                </button>
                {servicesOpen && (
                  <ol className="mb-1 mt-1 flex flex-col gap-0.5 border-l border-ink/10 pl-3">
                    {serviceLinks.map((link, i) => (
                      <li key={link.to}>
                        <SiteLink
                          to={link.to}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-baseline gap-3 rounded-lg px-2 py-1.5 text-[13.5px] text-ink/75 hover:bg-paper-2 hover:text-ink"
                        >
                          <span className="t-index tnum text-[10px] text-mute-2">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {link.label.replace(' Brampton', '')}
                        </SiteLink>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
              {primary.slice(1).map((link) => (
                <li key={link.to}>
                  <SiteLink to={link.to} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2.5 hover:bg-paper-2">
                    {link.label}
                  </SiteLink>
                </li>
              ))}
              {socials.length > 0 && (
                <li className="mt-2 flex gap-2 px-3 pt-2">
                  {socials.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={label}
                      className="grid h-9 w-9 place-items-center rounded-full bg-paper-2 hover:bg-paper-3"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
