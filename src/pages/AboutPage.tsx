import SiteNavbar from '../components/SiteNavbar'
import SiteFooter from '../components/SiteFooter'
import Seo from '../components/Seo'
import SitePhoto from '../components/SitePhoto'
import Breadcrumbs from '../components/Breadcrumbs'
import { SkipToContent, Main } from '../components/PageShell'
import SiteLink from '../components/SiteLink'
import { pageSeo, breadcrumbTrails } from '../data/seo'
import { serviceLinks } from '../data/links'
import { business } from '../data/site'
import { photo } from '../data/photos'

const milestones = [
  {
    year: '2004',
    title: 'THE FIRST BAY',
    copy: 'Sultan Motors opens its doors in Brampton with a simple promise, honest workmanship on every vehicle.',
  },
  {
    year: '2011',
    title: 'COLLISION CENTRE',
    copy: 'A dedicated bodywork and collision facility joins the shop, expanding our service to full accident recovery.',
  },
  {
    year: '2017',
    title: 'CERTIFIED CREW',
    copy: 'Our team of licensed technicians grows, backed by ongoing training in modern diagnostics and hybrid systems.',
  },
  {
    year: '2024',
    title: '20 YEARS STRONG',
    copy: 'Two decades of trusted service, thousands of satisfied drivers, and a shop that still runs on precision and care.',
  },
]

const certifications = [
  {
    k: 'LICENSED 310S TECHNICIANS',
    v: 'Every automotive service technician on staff holds a certified 310S provincial license.',
  },
  {
    k: 'MVIC ACCREDITED',
    v: 'A registered Motor Vehicle Inspection Centre, authorized to issue Ontario safety standard certificates.',
  },
  {
    k: 'OEM TRAINED',
    v: 'Ongoing training on European, Japanese, and North American platforms keeps our diagnostics current.',
  },
  {
    k: 'HYBRID AND EV READY',
    v: 'High voltage safety training and the right tools to service modern hybrid and electric drivetrains.',
  },
]

const values = [
  {
    k: 'PRECISION FIRST',
    v: 'Every diagnosis is grounded in data, calibrated tools, and repeatable process, never guesswork.',
  },
  {
    k: 'HONEST PRICING',
    v: 'Clear estimates, plain language, and no upsell pressure on any repair that rolls through our bay.',
  },
  {
    k: 'WORK THAT LASTS',
    v: 'Quality parts, clean workmanship, and a warranty that stands behind every service we complete.',
  },
  {
    k: 'DRIVER FIRST',
    v: 'Fast updates, transparent timelines, and respect for the people who trust us with their vehicle.',
  },
]

const marqueeItems = [
  'TRUSTED SINCE 2004',
  'CERTIFIED TECHNICIANS',
  'HONEST PRICING',
  'WARRANTY BACKED',
  'BRAMPTON BUILT',
  'DRIVER FIRST',
]

export default function AboutPage() {
  const heroBg = photo('about.hero')

  return (
    <div className="min-h-screen bg-white font-sans">
      <Seo {...pageSeo['about-us']} />
      <SkipToContent />
      <Main>
      <section className="relative overflow-hidden rounded-b-[1.5rem] bg-[#1e2025] text-white md:rounded-b-[2rem]">
        <img
          src={heroBg?.src}
          srcSet={heroBg?.srcSet}
          sizes="100vw"
          alt={heroBg?.alt ?? ''}
          width={heroBg?.width}
          height={heroBg?.height}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40 sm:opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e2025]/70 via-[#1e2025]/50 to-[#1e2025]" />
        <SiteNavbar theme="dark" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6 sm:pt-16 sm:pb-32 md:px-8 md:pt-20 md:pb-40">
          <div className="mb-5 flex items-center gap-3 md:mb-6">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-white/80 sm:text-[11px]">
              ABOUT SULTAN MOTORS
            </span>
          </div>
          <Breadcrumbs trail={breadcrumbTrails['about-us']} theme="dark" className="mb-6" />
          <h1 className="max-w-4xl text-[2rem] font-extrabold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-7xl">
            TWO DECADES OF TRUSTED AUTO REPAIR IN BRAMPTON
          </h1>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            Sultan Motors is a trusted mechanic in Brampton built on skill, honesty, and a genuine respect for every driver we serve. For over twenty years, our certified auto technicians have kept vehicles running with the kind of care that only comes from doing the job right the first time.
          </p>
        </div>
      </section>
      <div className="overflow-hidden border-y border-neutral-200 bg-white py-4 md:py-6">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap text-xl font-extrabold tracking-tight text-neutral-900 sm:gap-16 sm:text-2xl md:text-4xl">
          {Array.from({ length: 2 }).map((_, i) => (
            // The second pass exists only to fill the track; marking it hidden
            // keeps screen readers and text extraction from seeing the list twice.
            <div
              key={i}
              className="flex items-center gap-10 sm:gap-16"
              aria-hidden={i > 0 ? 'true' : undefined}
            >
              {marqueeItems.map((item) => (
                <span key={item + i}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <section className="bg-gradient-to-b from-white to-[#f3f4f6] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center gap-3 md:mb-6">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-neutral-500 sm:text-[11px]">
              THE SULTAN MOTORS STORY
            </span>
          </div>
          <h2 className="max-w-4xl text-3xl font-extrabold leading-[1.1] tracking-tight text-[#111] sm:text-4xl md:text-5xl lg:text-6xl">
            BUILT IN BRAMPTON. TRUSTED BY DRIVERS ACROSS THE GTA.
          </h2>
          <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-5 text-sm leading-relaxed text-neutral-600 sm:text-base">
              <p>
                Sultan Motors started as a small independent shop with a clear mission, offer Brampton drivers a place where they could trust the diagnosis, understand the repair, and drive away with total confidence. That mission has not changed.
              </p>
              <p>
                What has changed is the scope. Today our workshop handles everything from routine maintenance and engine repair to complex collision recovery and full body restoration. The equipment is modern, the training is current, and the standards are non negotiable.
              </p>
              <p>
                Every vehicle that rolls in gets the same treatment. Careful inspection, honest communication, quality parts, and workmanship you can feel in every mile that follows.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] sm:rounded-3xl">
              <SitePhoto
                slot="about.story"
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#111214] px-4 py-16 text-white sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-center gap-3 md:mb-14">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-white/70 sm:text-[11px]">
              OUR HISTORY
            </span>
          </div>
          <h2 className="mb-10 max-w-4xl text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl md:mb-16 md:text-5xl lg:text-6xl">
            TWENTY YEARS OF LEARNING, BUILDING, AND DELIVERING.
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((milestone, i) => (
              <div
                key={milestone.year}
                className="milestone group rounded-2xl border border-white/10 bg-[#1a1b1f] p-5 transition duration-500 hover:border-white/20 hover:bg-[#222328] sm:p-6"
              >
                <div className="mb-5 flex items-center justify-between md:mb-6">
                  <div className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    {milestone.year}
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e6ff3d] text-[10px] font-bold text-black">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <h3 className="mb-3 text-lg font-extrabold tracking-tight text-white sm:text-xl md:mb-4">
                  {milestone.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-white/70">{milestone.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#111214] px-4 pb-16 sm:px-6 sm:pb-20 md:px-8 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
            <SitePhoto
              slot="about.team"
              sizes="(max-width: 1279px) 100vw, 1280px"
              className="h-[240px] w-full object-cover sm:h-[380px] md:h-[560px]"
            />
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3 md:mt-10">
            <div>
              <div className="text-4xl font-black text-[#e6ff3d] sm:text-5xl">20+</div>
              <div className="mt-2 text-[11px] font-bold tracking-[0.2em] text-white/70">
                YEARS SERVING BRAMPTON
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-[#e6ff3d] sm:text-5xl">15K</div>
              <div className="mt-2 text-[11px] font-bold tracking-[0.2em] text-white/70">
                VEHICLES SERVICED
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-[#e6ff3d] sm:text-5xl">100%</div>
              <div className="mt-2 text-[11px] font-bold tracking-[0.2em] text-white/70">
                CERTIFIED TECHNICIANS
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#1e2025] px-4 py-16 text-white sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-5 flex items-center gap-3 md:mb-6">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-white/70 sm:text-[11px]">
                CERTIFICATIONS AND CREDENTIALS
              </span>
            </div>
            <h2 className="text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              CERTIFIED AUTO TECHNICIANS BRAMPTON DRIVERS TRUST.
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/60 md:mt-8">
              Our team holds the training and provincial credentials required to service modern vehicles across every major brand, from daily drivers to performance and hybrid platforms.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 md:mt-10">
              <SitePhoto
                slot="about.cert"
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="h-56 w-full object-cover sm:h-64 md:h-72"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {certifications.map((cert) => (
              <div
                key={cert.k}
                className="cert-card rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-[#e6ff3d]/40 sm:p-6"
              >
                <h3 className="mb-4 text-[11px] font-bold tracking-[0.2em] text-[#e6ff3d]">
                  {cert.k}
                </h3>
                <p className="text-[13px] leading-relaxed text-white/70">{cert.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-center gap-3 md:mb-14">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-neutral-500 sm:text-[11px]">
              WHAT WE STAND FOR
            </span>
          </div>
          <h2 className="mb-10 max-w-4xl text-3xl font-extrabold leading-[1.05] tracking-tight text-[#111] sm:text-4xl md:mb-16 md:text-5xl lg:text-6xl">
            THE VALUES BEHIND EVERY REPAIR.
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.k}
                className="value-card group rounded-2xl bg-[#f3f4f6] p-6 transition duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] sm:p-7"
              >
                <h3 className="mb-14 text-[12px] font-bold tracking-[0.15em] text-[#111]">
                  {value.k}
                </h3>
                <p className="text-[13px] leading-relaxed text-neutral-500">{value.v}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 md:gap-6">
            <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
              <SitePhoto
                slot="about.value1"
                sizes="(max-width: 639px) 100vw, 50vw"
                className="h-[220px] w-full object-cover sm:h-[320px] md:h-[420px]"
              />
            </div>
            <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
              <SitePhoto
                slot="about.value2"
                sizes="(max-width: 639px) 100vw, 50vw"
                className="h-[220px] w-full object-cover sm:h-[320px] md:h-[420px]"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#0d0e10] px-4 py-16 text-white sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.24em] text-[#e6ff3d] sm:text-[11px]">
              WORK WITH SULTAN MOTORS
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
              BRING US THE PROBLEM. WE WILL BRING THE ANSWER.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
              Twenty years of Brampton repair work sits behind every estimate we
              write. Book a visit at {business.streetAddress} in{' '}
              {business.addressLocality}, or call and talk it through with a
              technician first.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SiteLink
                to="/contact"
                className="rounded-full bg-[#e6ff3d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d9f232]"
              >
                Book an appointment
              </SiteLink>
              <a
                href={`tel:${business.phoneRaw}`}
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Call {business.phoneDisplay}
              </a>
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-[11px] font-bold tracking-[0.2em] text-white/60">
              WHAT WE WORK ON
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {serviceLinks.map((link) => (
                <li key={link.to}>
                  <SiteLink
                    to={link.to}
                    className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3 text-[13px] font-semibold text-white transition hover:bg-white/10"
                  >
                    {link.label.replace(' Brampton', '')}
                    <span aria-hidden="true" className="text-white/40">
                      →
                    </span>
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
        </Main>
      <SiteFooter />
    </div>
  )
}
