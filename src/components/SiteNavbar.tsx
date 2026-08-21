import { useEffect, useRef, useState } from 'react'
import SiteLink from './SiteLink'
import { InstagramIcon, FacebookIcon, ArrowUpRightIcon } from './icons'
import { serviceLinks } from '../data/links'
import { socialProfiles } from '../data/site'

export default function SiteNavbar(_props: { theme?: 'dark' } = {}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openServices = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
    setServicesOpen(true)
  }
  const scheduleCloseServices = () => {
    closeTimeout.current = setTimeout(() => setServicesOpen(false), 150)
  }

  return (
    <>
      <div className="h-[76px] sm:h-[80px]" aria-hidden="true" />
      <div
        className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-500 ease-out ${
          scrolled ? 'px-3 pt-2 sm:px-6 sm:pt-3' : 'px-3 pt-3 sm:px-4 sm:pt-4'
        }`}
      >
        <nav
          className={`mx-auto flex items-center justify-between rounded-full bg-white text-black shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] ring-1 ring-black/5 transition-all duration-500 ease-out ${
            scrolled ? 'max-w-3xl px-3 py-2 sm:px-4 sm:py-2' : 'max-w-7xl px-4 py-3 sm:px-6 sm:py-3'
          }`}
        >
          <SiteLink
            to="/"
            className={`shrink-0 font-black tracking-[0.18em] text-black transition-all duration-500 ${
              scrolled ? 'text-[11px]' : 'text-[12px] sm:text-[13px]'
            }`}
          >
            SULTAN MOTORS
          </SiteLink>
          <ul
            className={`hidden items-center font-medium text-black/70 lg:flex transition-all duration-500 ${
              scrolled ? 'gap-5 text-[13px]' : 'gap-7 text-[14px] xl:gap-9'
            }`}
          >
            <li>
              <SiteLink to="/" activeClassName="text-black" className="transition hover:text-black">
                Home
              </SiteLink>
            </li>
            <li>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setServicesOpen((open) => !open)}
                  onMouseEnter={openServices}
                  onMouseLeave={scheduleCloseServices}
                  className="transition hover:text-black"
                  aria-expanded={servicesOpen}
                >
                  Services
                </button>
                {servicesOpen && (
                  <div
                    className="absolute left-1/2 top-full z-40 mt-3 w-[520px] -translate-x-1/2 rounded-2xl bg-white p-3 text-black shadow-2xl ring-1 ring-black/5"
                    onMouseEnter={openServices}
                    onMouseLeave={scheduleCloseServices}
                  >
                    <div className="grid grid-cols-2 gap-1">
                      {serviceLinks.map((link) => (
                        <SiteLink
                          key={link.to}
                          to={link.to}
                          className="rounded-lg px-3 py-2 text-[12px] font-medium transition hover:bg-neutral-100"
                          onClick={() => setServicesOpen(false)}
                        >
                          {link.label.replace(' Brampton', '')}
                        </SiteLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </li>
            <li>
              <SiteLink to="/about-us" activeClassName="text-black" className="transition hover:text-black">
                About
              </SiteLink>
            </li>
            <li>
              <SiteLink to="/contact" activeClassName="text-black" className="transition hover:text-black">
                Contact
              </SiteLink>
            </li>
          </ul>
          <div className="flex items-center gap-2 sm:gap-3">
            {socialProfiles.instagram && (
              <a
                href={socialProfiles.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sultan Motors on Instagram"
                className={`hidden items-center justify-center rounded-full text-black/70 transition hover:text-black sm:inline-flex ${
                  scrolled ? 'h-8 w-8' : 'h-9 w-9'
                }`}
              >
                <InstagramIcon className={scrolled ? 'h-4 w-4' : 'h-[18px] w-[18px]'} />
              </a>
            )}
            {socialProfiles.facebook && (
              <a
                href={socialProfiles.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sultan Motors on Facebook"
                className={`hidden items-center justify-center rounded-full text-black/70 transition hover:text-black sm:inline-flex ${
                  scrolled ? 'h-8 w-8' : 'h-9 w-9'
                }`}
              >
                <FacebookIcon className={scrolled ? 'h-4 w-4' : 'h-[18px] w-[18px]'} />
              </a>
            )}
            <SiteLink
              to="/contact"
              className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-black font-semibold text-white transition hover:bg-neutral-800 ${
                scrolled ? 'px-4 py-2 text-[12px]' : 'px-5 py-2.5 text-[13px]'
              }`}
            >
              Get in touch
              <ArrowUpRightIcon className={scrolled ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
            </SiteLink>
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className={`grid shrink-0 place-items-center rounded-full bg-neutral-100 lg:hidden ${
                scrolled ? 'h-8 w-8' : 'h-9 w-9'
              }`}
            >
              <span className="sr-only">Menu</span>
              <span className="flex flex-col gap-[3px]">
                <span className="block h-[2px] w-4 bg-black" />
                <span className="block h-[2px] w-4 bg-black" />
                <span className="block h-[2px] w-4 bg-black" />
              </span>
            </button>
          </div>
        </nav>
        {menuOpen && (
          <div className="mx-auto mt-2 max-h-[calc(100dvh-96px)] max-w-7xl overflow-y-auto rounded-2xl bg-white p-3 text-black shadow-2xl ring-1 ring-black/5 lg:hidden">
            <ul className="flex flex-col gap-0.5 text-[15px] font-semibold">
              <li>
                <SiteLink
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 transition hover:bg-neutral-100"
                >
                  Home
                </SiteLink>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setServicesOpen((open) => !open)}
                  aria-expanded={servicesOpen}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-neutral-100"
                >
                  <span>Services</span>
                  <span className={`transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                {servicesOpen && (
                  <ul className="mt-1 mb-1 flex flex-col gap-0.5 border-l border-neutral-200 pl-3">
                    {serviceLinks.map((link) => (
                      <li key={link.to}>
                        <SiteLink
                          to={link.to}
                          onClick={() => {
                            setMenuOpen(false)
                            setServicesOpen(false)
                          }}
                          className="block rounded-md px-2 py-1.5 text-[12.5px] font-medium text-black/75 transition hover:bg-neutral-100 hover:text-black"
                        >
                          {link.label.replace(' Brampton', '')}
                        </SiteLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <SiteLink
                  to="/about-us"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 transition hover:bg-neutral-100"
                >
                  About
                </SiteLink>
              </li>
              <li>
                <SiteLink
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 transition hover:bg-neutral-100"
                >
                  Contact
                </SiteLink>
              </li>
              {(socialProfiles.instagram || socialProfiles.facebook) && (
                <li className="mt-2 flex gap-2 px-3 pt-2">
                  {socialProfiles.instagram && (
                    <a
                      href={socialProfiles.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Sultan Motors on Instagram"
                      className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 transition hover:bg-neutral-200"
                    >
                      <InstagramIcon className="h-4 w-4" />
                    </a>
                  )}
                  {socialProfiles.facebook && (
                    <a
                      href={socialProfiles.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Sultan Motors on Facebook"
                      className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 transition hover:bg-neutral-200"
                    >
                      <FacebookIcon className="h-4 w-4" />
                    </a>
                  )}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
