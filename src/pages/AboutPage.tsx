import { useRef } from 'react'
import SiteNavbar from '../components/SiteNavbar'
import SiteFooter from '../components/SiteFooter'
import SiteLink from '../components/SiteLink'
import Seo from '../components/Seo'
import SitePhoto from '../components/SitePhoto'
import Breadcrumbs from '../components/Breadcrumbs'
import { SkipToContent, Main } from '../components/PageShell'
import { pageSeo, breadcrumbTrails } from '../data/seo'
import { business } from '../data/site'
import { photo } from '../data/photos'
import { useHeroReveal } from '../motion/useHeroReveal'
import { useReveal } from '../motion/useReveal'

const milestones = [
  {
    year: '2004',
    title: 'The first bay',
    copy: 'Sultan Motors opens its doors in Brampton with a simple promise: honest workmanship on every vehicle.',
  },
  {
    year: '2011',
    title: 'Collision centre',
    copy: 'A dedicated bodywork and collision facility joins the shop, extending the work to full accident recovery.',
  },
  {
    year: '2017',
    title: 'Certified crew',
    copy: 'The team of licensed technicians grows, backed by ongoing training in modern diagnostics and hybrid systems.',
  },
  {
    year: '2024',
    title: 'Twenty years',
    copy: 'Two decades of trusted service, and a shop that still runs on precision and care.',
  },
]

const credentials = [
  {
    title: 'Licensed 310S technicians',
    copy: 'Every automotive service technician on staff holds the 310S provincial licence.',
  },
  {
    title: 'Motor Vehicle Inspection Centre',
    copy: 'A registered inspection centre, authorised to issue Ontario Safety Standards Certificates.',
  },
  {
    title: 'OEM trained',
    copy: 'Ongoing training on European, Japanese and North American platforms keeps the diagnostics current.',
  },
  {
    title: 'Hybrid and EV ready',
    copy: 'High voltage safety training and the tools to service modern hybrid and electric drivetrains.',
  },
]

const values = [
  {
    title: 'Precision first',
    copy: 'Every diagnosis is grounded in data, calibrated tools and a repeatable process. Never guesswork.',
  },
  {
    title: 'Honest pricing',
    copy: 'Clear estimates in plain language, and no pressure to approve work the vehicle does not need.',
  },
  {
    title: 'Work that lasts',
    copy: 'Quality parts, clean workmanship and a warranty that stands behind every job.',
  },
  {
    title: 'Driver first',
    copy: 'Quick updates, honest timelines and respect for the people who trust us with their vehicle.',
  },
]

export default function AboutPage() {
  const hero = useRef<HTMLElement>(null)
  const page = useRef<HTMLDivElement>(null)
  const heroPhoto = photo('about.hero')
  useHeroReveal(hero)
  useReveal(page)

  return (
    <div className="bg-paper text-ink">
      <Seo {...pageSeo['about-us']} />
      <SkipToContent />
      <Main>
        <div ref={page}>
          <section ref={hero} className="relative flex min-h-[88svh] flex-col bg-ink-4 text-paper">
            <div className="absolute inset-0 overflow-hidden">
              {heroPhoto && (
                <img
                  data-hero-media
                  src={heroPhoto.src}
                  srcSet={heroPhoto.srcSet}
                  sizes="100vw"
                  alt={heroPhoto.alt}
                  width={heroPhoto.width}
                  height={heroPhoto.height}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover opacity-55"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-4 via-ink-4/40 to-ink-4/30" />
            </div>
            <SiteNavbar theme="dark" />
            <div className="wrap relative z-10 flex flex-1 flex-col justify-between pb-[clamp(2.5rem,6vh,5rem)] pt-4">
              <Breadcrumbs trail={breadcrumbTrails['about-us']} theme="dark" />
              <div className="grid-12 items-end gap-y-8 pt-16">
                <h1 data-hero-title className="t-h1 col-span-12 max-w-[14ch] lg:col-span-8">
                  Two decades of trusted auto repair in Brampton
                </h1>
                <p
                  data-hero-rest
                  className="t-lead col-span-12 max-w-[46ch] text-paper/75 lg:col-span-4"
                >
                  A mechanic built on skill, honesty and respect for every driver we serve. For over
                  twenty years our certified technicians have kept vehicles running by doing the job
                  right the first time.
                </p>
              </div>
            </div>
          </section>

          {/* The story, told in prose beside one photograph. */}
          <section className="section-y">
            <div className="wrap grid-12 gap-y-12">
              <div className="col-span-12 lg:col-span-6">
                <h2 data-reveal className="t-h2 max-w-[16ch]">
                  Built in Brampton. Trusted across the GTA.
                </h2>
                <div data-reveal data-reveal-group className="mt-8 max-w-[56ch] space-y-5 text-mute">
                  <p className="t-body">
                    Sultan Motors started as a small independent shop with a clear mission: give
                    Brampton drivers a place where they could trust the diagnosis, understand the
                    repair, and drive away with confidence. That mission has not changed.
                  </p>
                  <p className="t-body">
                    What has changed is the scope. Today the workshop handles everything from routine
                    maintenance and engine repair to complex collision recovery and full body
                    restoration. The equipment is modern, the training is current, and the standards
                    are not negotiable.
                  </p>
                  <p className="t-body">
                    Every vehicle that rolls in gets the same treatment. Careful inspection, honest
                    communication, quality parts, and workmanship you can feel in every mile that
                    follows.
                  </p>
                </div>
              </div>
              <div data-reveal="image" className="col-span-12 overflow-hidden bg-paper-3 lg:col-span-5 lg:col-start-8">
                <SitePhoto
                  slot="about.story"
                  sizes="(max-width: 1023px) 100vw, 42vw"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* The years, set large. */}
          <section className="section-y bg-ink text-paper">
            <div className="wrap grid-12 gap-y-12">
              <h2 data-reveal className="t-h2 col-span-12 max-w-[12ch] lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
                Twenty years of learning, building and delivering.
              </h2>
              <ol data-reveal data-reveal-group className="col-span-12 lg:col-span-7 lg:col-start-6">
                {milestones.map((m) => (
                  <li
                    key={m.year}
                    className="rule-dark grid grid-cols-[5.5rem_1fr] gap-x-6 py-8 md:grid-cols-[9rem_1fr] md:py-10"
                  >
                    <span className="t-h2 tnum font-medium text-paper/35">{m.year}</span>
                    <div>
                      <h3 className="t-h3">{m.title}</h3>
                      <p className="t-body mt-3 max-w-[50ch] text-paper/60">{m.copy}</p>
                    </div>
                  </li>
                ))}
                <li className="rule-dark" aria-hidden="true" />
              </ol>
            </div>
          </section>

          <section className="relative">
            <div data-reveal="image" className="overflow-hidden bg-ink-3">
              <SitePhoto
                slot="about.team"
                sizes="100vw"
                className="h-[56svh] w-full object-cover object-center md:h-[80svh]"
              />
            </div>
            <p className="wrap t-small mt-4 text-mute">
              The team, Melanie Drive. Since {business.foundingYear}.
            </p>
          </section>

          {/* Credentials: the facts, as rows, beside the evidence. */}
          <section className="section-y">
            <div className="wrap grid-12 gap-y-12">
              <div className="col-span-12 lg:col-span-5">
                <h2 data-reveal className="t-h2 max-w-[14ch]">
                  Certified auto technicians Brampton drivers trust.
                </h2>
                <p data-reveal className="t-body mt-7 max-w-[44ch] text-mute">
                  The training and provincial credentials required to service modern vehicles across
                  every major brand, from daily drivers to performance and hybrid platforms.
                </p>
                <div data-reveal="image" className="mt-10 overflow-hidden bg-paper-3">
                  <SitePhoto
                    slot="about.cert"
                    sizes="(max-width: 1023px) 100vw, 40vw"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </div>
              <ol data-reveal data-reveal-group className="col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-3">
                {credentials.map((c, i) => (
                  <li key={c.title} className="rule grid grid-cols-[2.5rem_1fr] gap-x-4 py-6">
                    <span className="t-index tnum pt-1.5 text-mute-2">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="t-h3 text-[1.25rem] md:text-[1.375rem]">{c.title}</h3>
                      <p className="t-body mt-2 max-w-[50ch] text-mute">{c.copy}</p>
                    </div>
                  </li>
                ))}
                <li className="rule" aria-hidden="true" />
              </ol>
            </div>
          </section>

          {/* Values, then two photographs that sit unevenly on purpose. */}
          <section className="section-y bg-paper-2">
            <div className="wrap">
              <h2 data-reveal className="t-h2 max-w-[14ch]">
                The values behind every repair.
              </h2>
              <dl data-reveal data-reveal-group className="mt-12 grid gap-x-10 md:grid-cols-2 md:mt-16">
                {values.map((v) => (
                  <div key={v.title} className="rule py-6">
                    <dt className="t-h3 text-[1.25rem] md:text-[1.375rem]">{v.title}</dt>
                    <dd className="t-body mt-2 max-w-[44ch] text-mute">{v.copy}</dd>
                  </div>
                ))}
              </dl>
              <div className="grid-12 mt-16 gap-y-8 md:mt-24">
                <div data-reveal="image" className="col-span-12 overflow-hidden bg-paper-3 md:col-span-7">
                  <SitePhoto
                    slot="about.value1"
                    sizes="(max-width: 767px) 100vw, 58vw"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                <div data-reveal="image" className="col-span-12 overflow-hidden bg-paper-3 md:col-span-4 md:col-start-9 md:mt-24">
                  <SitePhoto
                    slot="about.value2"
                    sizes="(max-width: 767px) 100vw, 33vw"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              </div>
              <div data-reveal className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4">
                <SiteLink to="/contact" className="btn btn-ink">
                  Book an appointment
                  <span className="arrow" aria-hidden="true">
                    ↗
                  </span>
                </SiteLink>
                <a href={`tel:${business.phoneRaw}`} className="link-ul text-ink">
                  or call {business.phoneDisplay}
                </a>
              </div>
            </div>
          </section>
        </div>
      </Main>
      <SiteFooter />
    </div>
  )
}
