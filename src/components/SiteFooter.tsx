import SiteLink from './SiteLink'
import { exploreLinks, serviceLinks } from '../data/links'
import { business, openingHours } from '../data/site'

/**
 * The footer carries the complete site index and the shop's particulars, set
 * as type on the black surface with nothing decorative around it. The
 * oversized wordmark at the foot is the one typographic flourish, and it is
 * marked decorative so it is never read aloud.
 */
export default function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="wrap">
        <div className="section-y-sm grid-12 items-end gap-y-10">
          <h2 className="t-h2 col-span-12 max-w-[14ch] font-medium lg:col-span-8">
            Book a bay. We take it from there.
          </h2>
          <div className="col-span-12 flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <SiteLink to="/contact" className="btn btn-accent">
              Book an appointment
              <span className="arrow" aria-hidden="true">
                ↗
              </span>
            </SiteLink>
            <a href={`tel:${business.phoneRaw}`} className="btn btn-ghost-dark">
              Call {business.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="rule-dark grid-12 gap-y-12 py-14 md:py-16">
          <address className="col-span-12 not-italic sm:col-span-6 lg:col-span-3">
            <p className="t-index text-paper/45">Visit</p>
            <p className="mt-5 text-paper">{business.streetAddress}</p>
            <p className="text-paper">
              {business.addressLocality}, {business.addressRegion} {business.postalCode}
            </p>
            <a
              href={`tel:${business.phoneRaw}`}
              className="group mt-3 inline-flex min-h-11 items-center text-paper/85 hover:text-paper"
            >
              <span className="link-ul">{business.phoneDisplay}</span>
            </a>
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-paper/60">
              {openingHours.map((block) => (
                <div key={block.label} className="contents">
                  <dt>{block.label}</dt>
                  <dd className="tnum">{block.display}</dd>
                </div>
              ))}
              <dt>Sunday</dt>
              <dd>Closed</dd>
            </dl>
          </address>

          <nav className="col-span-12 sm:col-span-6 lg:col-span-6" aria-label="Services">
            <p className="t-index text-paper/45">Services</p>
            <ol className="mt-4 grid gap-x-10 sm:grid-cols-2">
              {serviceLinks.map((link, i) => (
                <li key={link.to} className="flex min-h-11 items-center gap-3 py-1">
                  <span className="t-index tnum w-6 shrink-0 text-paper/35">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <SiteLink to={link.to} className="group flex min-h-11 items-center text-paper/85 hover:text-paper">
                    <span className="link-ul">{link.label.replace(' Brampton', '')}</span>
                  </SiteLink>
                </li>
              ))}
            </ol>
          </nav>

          <nav className="col-span-12 sm:col-span-6 lg:col-span-3" aria-label="Explore">
            <p className="t-index text-paper/45">Explore</p>
            <ul className="mt-4 flex flex-col">
              {exploreLinks.map((link) => (
                <li key={link.to} className="flex min-h-11 items-center py-1">
                  <SiteLink
                    to={link.to}
                    exact={link.to === '/'}
                    className="group flex min-h-11 items-center text-paper/85 hover:text-paper"
                  >
                    <span className="link-ul">{link.label}</span>
                  </SiteLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="rule-dark t-small flex flex-col gap-2 py-6 text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {business.name}. Auto repair in {business.addressLocality},
            Ontario.
          </p>
          <p>
            Powered by{' '}
            <a
              href="https://www.skyboundscaling.com"
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex min-h-11 items-center text-paper/70 hover:text-paper"
            >
              <span className="link-ul">Skybound Scaling</span>
            </a>
          </p>
        </div>
      </div>

      {/*
        The wordmark, set to the full width of the page and centred by
        construction. An SVG scales the word exactly to the available width at
        every viewport, which font-size in vw cannot do without guessing the
        glyph widths. The viewBox is the measured ink width of "SULTAN" in
        Geist 600 at 100px with this tracking (344 units), by 72 for the cap
        height, so the letters sit on the footer's bottom edge.
      */}
      <div className="select-none overflow-hidden" aria-hidden="true">
        <div className="wrap">
          <svg
            viewBox="0 0 344 72"
            width="100%"
            preserveAspectRatio="xMidYMax meet"
            className="-mb-[2px] block h-auto w-full fill-paper/[0.07]"
          >
            <text
              x="172"
              y="71"
              textAnchor="middle"
              fontFamily="'Geist Variable', ui-sans-serif, system-ui, sans-serif"
              fontWeight="600"
              fontSize="100"
              letterSpacing="-5"
            >
              SULTAN
            </text>
          </svg>
        </div>
      </div>
    </footer>
  )
}
