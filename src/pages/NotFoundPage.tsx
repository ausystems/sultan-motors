import { useRef } from 'react'
import SiteLink from '../components/SiteLink'
import SiteNavbar from '../components/SiteNavbar'
import SiteFooter from '../components/SiteFooter'
import Seo from '../components/Seo'
import { SkipToContent, Main } from '../components/PageShell'
import { notFoundSeo } from '../data/seo'
import { serviceLinks } from '../data/links'
import { business } from '../data/site'
import { useHeroReveal } from '../motion/useHeroReveal'
import { useReveal } from '../motion/useReveal'

const shortcuts = [
  { to: '/auto-repair-brampton', label: 'Auto repair', copy: 'Diagnostics, engines, brakes and everything mechanical.' },
  { to: '/collision-repair-brampton', label: 'Collision repair', copy: 'Frame straightening, structural work and refinishing.' },
  { to: '/safety-standards-certificate-brampton', label: 'Safety certificate', copy: 'Ontario safety inspections for transfers and registration.' },
  { to: '/contact', label: 'Book an appointment', copy: 'Pick a service, choose a drop off time, reserve a bay.' },
]

export default function NotFoundPage() {
  const hero = useRef<HTMLElement>(null)
  const page = useRef<HTMLDivElement>(null)
  useHeroReveal(hero)
  useReveal(page)

  return (
    <div className="bg-ink text-paper">
      <Seo {...notFoundSeo} />
      <SkipToContent />
      <Main>
        <div ref={page}>
          <section ref={hero} className="flex min-h-[80svh] flex-col">
            <SiteNavbar theme="dark" />
            <div className="wrap flex flex-1 flex-col justify-end pb-[clamp(2.5rem,6vh,5rem)] pt-16">
              <p data-hero-rest className="t-index text-paper/45">
                Error 404
              </p>
              <h1 data-hero-title className="t-display mt-6 max-w-[12ch]">
                This page took a wrong turn.
              </h1>
              <p data-hero-rest className="t-lead mt-8 max-w-[46ch] text-paper/70">
                The page you were looking for has moved, been renamed, or never existed. Nothing is
                wrong with your vehicle, just this link.
              </p>
              <div data-hero-rest className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <SiteLink to="/" className="btn btn-accent">
                  Back to the homepage
                </SiteLink>
                <a href={`tel:${business.phoneRaw}`} className="link-ul text-paper/80 hover:text-paper">
                  or call {business.phoneDisplay}
                </a>
              </div>
            </div>
          </section>

          <section className="section-y bg-ink-2">
            <div className="wrap grid-12 gap-y-12">
              <div className="col-span-12 lg:col-span-5">
                <h2 data-reveal className="t-h2 max-w-[12ch]">
                  Where most drivers were heading.
                </h2>
              </div>
              <ul data-reveal data-reveal-group className="col-span-12 lg:col-span-6 lg:col-start-7">
                {shortcuts.map((item) => (
                  <li key={item.to} className="rule-dark">
                    <SiteLink to={item.to} className="group flex items-baseline justify-between gap-6 py-5">
                      <span>
                        <span className="t-h3 block transition-colors duration-300 group-hover:text-accent">
                          {item.label}
                        </span>
                        <span className="t-small mt-1.5 block text-paper/50">{item.copy}</span>
                      </span>
                      <span aria-hidden="true" className="t-small text-paper/40 transition-transform duration-500 group-hover:translate-x-1">
                        →
                      </span>
                    </SiteLink>
                  </li>
                ))}
                <li className="rule-dark" aria-hidden="true" />
              </ul>
            </div>
          </section>

          <section className="section-y">
            <div className="wrap">
              <h2 data-reveal className="t-h3">
                Every service
              </h2>
              <ol data-reveal data-reveal-group className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
                {serviceLinks.map((link, i) => (
                  <li key={link.to} className="rule-dark">
                    <SiteLink to={link.to} className="group flex items-baseline gap-4 py-3.5">
                      <span className="t-index tnum w-7 shrink-0 text-paper/35">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="link-ul text-paper/85 group-hover:text-paper">
                        {link.label.replace(' Brampton', '')}
                      </span>
                    </SiteLink>
                  </li>
                ))}
              </ol>
              <p data-reveal className="t-body mt-14 max-w-[52ch] text-paper/60">
                Still cannot find it? Sultan Motors is at {business.streetAddress},{' '}
                {business.addressLocality}, {business.addressRegion} {business.postalCode}. Call{' '}
                <a href={`tel:${business.phoneRaw}`} className="link-ul text-paper">
                  {business.phoneDisplay}
                </a>{' '}
                during shop hours and a technician will point you the right way.
              </p>
            </div>
          </section>
        </div>
      </Main>
      <SiteFooter />
    </div>
  )
}
