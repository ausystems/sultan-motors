import { useRef, useState } from 'react'
import SiteNavbar from '../components/SiteNavbar'
import SiteFooter from '../components/SiteFooter'
import SiteLink from '../components/SiteLink'
import Seo from '../components/Seo'
import SitePhoto from '../components/SitePhoto'
import Crossfade from '../components/Crossfade'
import { SkipToContent, Main } from '../components/PageShell'
import { pageSeo } from '../data/seo'
import { serviceLinks } from '../data/links'
import { business, openingHours } from '../data/site'
import { useHeroReveal } from '../motion/useHeroReveal'
import { useReveal } from '../motion/useReveal'
import { useMediaQuery } from '../motion/useMediaQuery'
import heroShop from '../assets/sultan-motors-brampton-auto-repair-shop-1600.webp'
import heroShop960 from '../assets/sultan-motors-brampton-auto-repair-shop-960.webp'
import heroShop2400 from '../assets/sultan-motors-brampton-auto-repair-shop-2400.webp'
import heroShop3200 from '../assets/sultan-motors-brampton-auto-repair-shop-3200.webp'
import heroPortrait900 from '../assets/sultan-motors-brampton-auto-repair-shop-portrait-900.webp'
import heroPortrait1440 from '../assets/sultan-motors-brampton-auto-repair-shop-portrait-1440.webp'
import heroPortrait1620 from '../assets/sultan-motors-brampton-auto-repair-shop-portrait-1620.webp'

/* One line per service, in the order of the site index. */
const serviceLines: Record<string, string> = {
  '/auto-repair-brampton': 'General and mechanical repair for cars, SUVs and light trucks.',
  '/car-diagnostics-brampton': 'Full system scans and live data, to find the real fault first.',
  '/engine-repair-brampton': 'Misfires, leaks, timing work and complete engine replacement.',
  '/brake-repair-brampton': 'Pads, rotors, calipers and fluid, measured against factory spec.',
  '/car-maintenance-brampton': 'Manufacturer intervals, oil and fluids, an inspection every visit.',
  '/transmission-repair-brampton': 'Diagnosis before any teardown, for automatic, manual and CVT.',
  '/suspension-repair-brampton': 'Shocks, struts, control arms and steering, then an alignment.',
  '/auto-electrical-repair-brampton': 'Batteries, alternators, sensors and wiring, traced to the pin.',
  '/collision-repair-brampton': 'Structural repair, frame straightening and the insurance paperwork.',
  '/auto-body-repair-brampton': 'Dents, panels, rust and refinishing back to a straight surface.',
  '/car-painting-brampton': 'Colour matched base and clear coat, sprayed in a downdraft booth.',
  '/safety-standards-certificate-brampton': 'Ontario Safety Standards Certificate inspections and repairs.',
}

const process = [
  {
    title: 'Inspect',
    copy: 'A full walk around and multi point check establishes the real condition of the vehicle before anyone talks about a fix.',
  },
  {
    title: 'Diagnose',
    copy: 'Scan tools, live data and hands on testing isolate the cause. The symptom is where we start, not where we stop.',
  },
  {
    title: 'Quote',
    copy: 'A written estimate with parts, labour and a timeline. Nothing is approved until you approve it.',
  },
  {
    title: 'Repair',
    copy: 'The work is done to manufacturer torque and clearance specifications with OEM quality parts.',
  },
  {
    title: 'Deliver',
    copy: 'A final quality check, a road test and a clear explanation of what was fixed and what to watch.',
  },
]

export default function HomePage() {
  const hero = useRef<HTMLElement>(null)
  const page = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(serviceLinks[0].to)
  const wide = useMediaQuery('(min-width: 1024px)')
  useHeroReveal(hero)
  useReveal(page)

  return (
    <div className="bg-paper text-ink">
      <Seo {...pageSeo['home']} />
      <SkipToContent />
      <Main>
        <div ref={page}>
          {/*
            The opening. The photograph is the site's existing hero asset: the
            shop, vehicles on the hoists. There is no hero video in this
            project, so the still is the foundation and the type is set over it.
          */}
          <section
            ref={hero}
            className="relative flex min-h-[100svh] flex-col bg-ink text-paper"
          >
            <div className="absolute inset-0 overflow-hidden">
              {/*
                Art-directed sources. Phones get a 3:4 crop taken from the
                full-resolution frame at the vehicles, so nothing is upscaled;
                wide screens get the landscape frame. The landscape `sizes`
                accounts for height as well as width: object-cover on a
                viewport squarer than 16:9 is constrained by height, and
                without the vh term the browser picks a frame too small to
                cover it and stretches it, which is what softens plate text.
              */}
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet={`${heroPortrait900} 900w, ${heroPortrait1440} 1440w, ${heroPortrait1620} 1620w`}
                  sizes="max(100vw, 75vh)"
                  type="image/webp"
                />
                <img
                  data-hero-media
                  src={heroShop}
                  srcSet={`${heroShop960} 960w, ${heroShop} 1600w, ${heroShop2400} 2400w, ${heroShop3200} 3200w`}
                  sizes="max(100vw, 177.8vh)"
                  alt="Vehicles on the hoists inside the Sultan Motors repair bay in Brampton"
                  width={1600}
                  height={900}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover object-center"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/20" />
            </div>

            <SiteNavbar theme="dark" />

            <div className="wrap relative z-10 flex flex-1 flex-col justify-end pb-[clamp(2.5rem,7vh,6rem)] pt-16">
              <div className="grid-12 items-end gap-y-8">
                <h1 data-hero-title className="t-display col-span-12 max-w-[13ch] lg:col-span-9">
                  Expert auto repair and collision service in Brampton
                </h1>
                <p
                  data-hero-rest
                  className="t-lead col-span-12 max-w-[44ch] text-paper/75 md:col-span-7 lg:col-span-5"
                >
                  Diagnostics, engine and brake work, bodywork and paint, handled in one bay by
                  licensed technicians since {business.foundingYear}.
                </p>
                <div
                  data-hero-rest
                  className="col-span-12 flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-5 lg:col-span-7 lg:justify-end"
                >
                  <SiteLink to="/contact" className="btn btn-accent">
                    Book an appointment
                    <span className="arrow" aria-hidden="true">
                      ↗
                    </span>
                  </SiteLink>
                  <a href={`tel:${business.phoneRaw}`} className="link-ul text-paper/80 hover:text-paper">
                    or call {business.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* A single statement, set large, with room around it. */}
          <section className="section-y">
            <div className="wrap grid-12 gap-y-10">
              <p data-reveal className="t-index col-span-12 text-mute lg:col-span-3">
                Since {business.foundingYear}
                <br />
                {business.addressLocality}, Ontario
              </p>
              <p
                data-reveal
                className="t-h2 col-span-12 max-w-[24ch] font-medium lg:col-span-9"
              >
                A shop built on one idea: trust the diagnosis, understand the repair, and drive
                away with confidence. Twenty years on, that has not changed.
              </p>
            </div>
          </section>

          {/*
            The service index. Every service on the site, numbered, with the
            active one's photograph held in the sticky column. On narrow
            screens the list stands on its own.
          */}
          <section className="section-y bg-ink text-paper">
            <div className="wrap grid-12 gap-y-12">
              <div className="col-span-12 lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  <h2 data-reveal className="t-h2 max-w-[12ch]">
                    Twelve services. One bay.
                  </h2>
                  <p data-reveal className="t-body mt-6 max-w-[40ch] text-paper/65">
                    From a check engine light to a full collision rebuild, every system that keeps a
                    vehicle safe is handled here, by the same team.
                  </p>
                  {/* Mounted only on wide screens, so phones never fetch it. */}
                  {wide && (
                    <div data-reveal="image" className="mt-10">
                      <Crossfade
                        slot={`svc.${active.slice(1)}.hero`}
                        sizes="26rem"
                        className="aspect-[4/5] w-full max-w-[26rem] bg-ink-3"
                      />
                    </div>
                  )}
                </div>
              </div>

              <ol className="col-span-12 lg:col-span-6 lg:col-start-7" data-reveal data-reveal-group>
                {serviceLinks.map((link, i) => (
                  <li key={link.to} className="rule-dark">
                    <SiteLink
                      to={link.to}
                      onMouseEnter={() => setActive(link.to)}
                      onFocus={() => setActive(link.to)}
                      className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-5 md:py-6"
                    >
                      <span className="t-index tnum text-paper/40">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>
                        <span className="t-h3 block transition-colors duration-300 group-hover:text-accent">
                          {link.label.replace(' Brampton', '')}
                        </span>
                        <span className="t-small mt-1.5 block max-w-[46ch] text-paper/55">
                          {serviceLines[link.to]}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="t-small text-paper/40 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-accent"
                      >
                        →
                      </span>
                    </SiteLink>
                  </li>
                ))}
                <li className="rule-dark" aria-hidden="true" />
              </ol>
            </div>
          </section>

          {/* One photograph, edge to edge. Nothing competes with it. */}
          <section className="relative">
            <div data-reveal="image" className="overflow-hidden bg-ink-3">
              <SitePhoto
                slot="home.story"
                sizes="100vw"
                className="h-[62svh] w-full object-cover object-center md:h-[86svh]"
              />
            </div>
            <p className="wrap t-small mt-4 text-mute">The collision bay, Melanie Drive.</p>
          </section>

          {/* The process, as a vertical sequence rather than a row of cards. */}
          <section className="section-y">
            <div className="wrap grid-12 gap-y-12">
              <div className="col-span-12 lg:col-span-4">
                <h2 data-reveal className="t-h2 max-w-[10ch] lg:sticky lg:top-28">
                  How a repair moves through the shop
                </h2>
              </div>
              <ol className="col-span-12 lg:col-span-7 lg:col-start-6" data-reveal data-reveal-group>
                {process.map((step, i) => (
                  <li
                    key={step.title}
                    className="rule grid grid-cols-[3.5rem_1fr] gap-x-6 py-8 md:grid-cols-[5rem_1fr] md:py-10"
                  >
                    <span className="t-h3 tnum font-medium text-mute-2">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="t-h3">{step.title}</h3>
                      <p className="t-body mt-3 max-w-[52ch] text-mute">{step.copy}</p>
                    </div>
                  </li>
                ))}
                <li className="rule" aria-hidden="true" />
              </ol>
            </div>
          </section>

          {/* Craft. Image and text share the width unevenly on purpose. */}
          <section className="section-y bg-paper-2">
            <div className="wrap grid-12 items-center gap-y-12">
              <div data-reveal="image" className="col-span-12 overflow-hidden bg-paper-3 md:col-span-6">
                <SitePhoto
                  slot="home.why"
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <div className="col-span-12 md:col-span-5 md:col-start-8">
                <h2 data-reveal className="t-h2 max-w-[14ch]">
                  Craftsmanship you can feel in every mile.
                </h2>
                <p data-reveal className="t-body mt-8 max-w-[46ch] text-mute">
                  Every vehicle that leaves the shop is inspected, road tested and delivered with the
                  standard of care we would want for our own family. It is why Brampton drivers keep
                  coming back.
                </p>
                <p data-reveal className="t-body mt-5 max-w-[46ch] text-mute">
                  OEM quality parts, straightforward estimates, quick turnaround and a written warranty
                  on parts and workmanship. No pressure and no surprises, just honest work done right
                  the first time.
                </p>
                <SiteLink
                  data-reveal
                  to="/about-us"
                  className="link-ul mt-10 inline-block font-medium"
                >
                  About the shop
                </SiteLink>
              </div>
            </div>
          </section>

          {/* Visit. The particulars, then the map. */}
          <section className="section-y">
            <div className="wrap">
              <div className="grid-12 gap-y-10">
                <h2 data-reveal className="t-h2 col-span-12 max-w-[14ch] lg:col-span-7">
                  {business.streetAddress}, {business.addressLocality}.
                </h2>
                <dl
                  data-reveal
                  className="col-span-12 grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 self-end text-mute lg:col-span-4 lg:col-start-9"
                >
                  {openingHours.map((block) => (
                    <div key={block.label} className="contents">
                      <dt>{block.label}</dt>
                      <dd className="tnum text-ink">{block.display}</dd>
                    </div>
                  ))}
                  <dt>Sunday</dt>
                  <dd className="text-ink">Closed</dd>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${business.phoneRaw}`} className="link-ul text-ink">
                      {business.phoneDisplay}
                    </a>
                  </dd>
                </dl>
              </div>
              <div data-reveal className="mt-14 overflow-hidden bg-paper-3">
                <iframe
                  title="Sultan Motors location map"
                  src="https://maps.google.com/maps?q=5%20Melanie%20Dr%20Unit%202%20Brampton%20ON%20L6T%204K8&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                  className="h-[320px] w-full grayscale sm:h-[420px] md:h-[520px]"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          </section>
        </div>
      </Main>
      <SiteFooter />
    </div>
  )
}
