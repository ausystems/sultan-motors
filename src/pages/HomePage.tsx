import { useState } from 'react'
import { ChevronDownIcon } from '../components/icons'
import SiteLink from '../components/SiteLink'
import SiteNavbar from '../components/SiteNavbar'
import SiteFooter from '../components/SiteFooter'
import BookCta from '../components/BookCta'
import Seo from '../components/Seo'
import SitePhoto from '../components/SitePhoto'
import { pageSeo } from '../data/seo'
import { SkipToContent, Main } from '../components/PageShell'
import { serviceLinks } from '../data/links'
import { business } from '../data/site'
import heroShop from '../assets/sultan-motors-brampton-auto-repair-shop-1600.webp'
import heroShop960 from '../assets/sultan-motors-brampton-auto-repair-shop-960.webp'
import heroShop2400 from '../assets/sultan-motors-brampton-auto-repair-shop-2400.webp'

const services = [
  {
    tag: '01',
    label: 'DIAGNOSTICS',
    heading: 'Car diagnostics in Brampton',
    copy: 'Data driven fault finding for check engine lights, electrical faults, drivability issues, and stubborn intermittent problems.',
    details:
      'Our Brampton diagnostic bay uses OEM level scan tools, oscilloscopes, and live data logging to trace faults at the source. We test sensors, wiring, and control modules across every make and model. You get a clear written report with root cause, recommended repair, and a firm estimate before any work begins.',
    slot: 'home.svc.diagnostics',
    to: '/car-diagnostics-brampton',
    linkLabel: 'car diagnostics',
  },
  {
    tag: '02',
    label: 'REPAIRS',
    heading: 'Mechanical auto repair in Brampton',
    copy: 'Engine, transmission, suspension, and electrical repairs completed with quality parts and clean workmanship.',
    details:
      'From timing chains and head gaskets to alternators, starters, and full suspension overhauls, our licensed technicians handle heavy mechanical work in house. We install OEM or premium aftermarket parts backed by a nationwide warranty. Every repair is road tested before your vehicle leaves the shop.',
    slot: 'home.svc.repairs',
    to: '/auto-repair-brampton',
    linkLabel: 'auto repair',
  },
  {
    tag: '03',
    label: 'MAINTENANCE',
    heading: 'Car maintenance in Brampton',
    copy: 'Oil services, brake service, fluid flushes, tune ups, and scheduled maintenance to keep your vehicle dependable.',
    details:
      'Stay ahead of costly failures with manufacturer aligned service intervals for oil, coolant, brake fluid, transmission, and differential. We inspect belts, hoses, filters, and brake wear at every visit. Consistent maintenance at Sultan Motors protects your warranty and extends the life of your vehicle.',
    slot: 'home.svc.maintenance',
    to: '/car-maintenance-brampton',
    linkLabel: 'car maintenance',
  },
  {
    tag: '04',
    label: 'BODYWORK',
    heading: 'Auto body repair in Brampton',
    copy: 'Panel repair, paint matching, dent removal, and refinishing performed with a keen eye for factory alignment.',
    details:
      'Our body shop restores dents, scratches, rust, and damaged panels to factory finish. We use computerized paint matching and a heated downdraft booth for a flawless, durable coat. Whether it is a bumper scuff or a full panel replacement, the result blends seamlessly with your original paint.',
    slot: 'home.svc.bodywork',
    to: '/auto-body-repair-brampton',
    linkLabel: 'auto body repair',
  },
  {
    tag: '05',
    label: 'COLLISION REPAIR',
    heading: 'Collision repair in Brampton',
    copy: 'Full collision recovery, frame straightening, structural work, and insurance coordination handled end to end.',
    details:
      'After an accident, we handle everything from tow in to final polish. Our frame machines and measuring systems restore structural integrity to manufacturer specifications. We work directly with every major insurance provider in Ontario so you can focus on getting back on the road.',
    slot: 'home.svc.collision',
    to: '/collision-repair-brampton',
    linkLabel: 'collision repair',
  },
]

const values = [
  {
    label: 'PRECISION FIRST',
    copy: 'Every diagnosis starts with data, not guesses. Our technicians use calibrated equipment and proven methods to pinpoint issues with ruthless accuracy.',
  },
  {
    label: 'WORK THAT HOLDS UP',
    copy: 'Repairs are done with the long game in mind. Quality parts, clean workmanship, and zero tolerance for shortcuts on any vehicle that rolls through our bay.',
  },
  {
    label: 'STRAIGHTFORWARD SERVICE',
    copy: 'We tell you what matters, what can wait, and what is optional. Clear pricing, honest recommendations, and updates you never have to chase.',
  },
  {
    label: 'A TEAM THAT CARES',
    copy: 'Sultan Motors is built by people who take pride in doing the job right. Skill, accountability, and genuine respect for every driver we serve.',
  },
]

const processSteps = [
  {
    step: 'STEP 01',
    title: 'INSPECT',
    copy: "Full multi point inspection and honest assessment of your vehicle's condition.",
  },
  {
    step: 'STEP 02',
    title: 'DIAGNOSE',
    copy: 'Advanced scan tools and expert technicians isolate the true root cause of the issue.',
  },
  {
    step: 'STEP 03',
    title: 'QUOTE',
    copy: 'Transparent estimate with clear pricing, timelines, and no surprises down the line.',
  },
  {
    step: 'STEP 04',
    title: 'REPAIR',
    copy: 'Meticulous repair or restoration using quality parts and proven procedures.',
  },
  {
    step: 'STEP 05',
    title: 'DELIVER',
    copy: 'Final quality check, road test, and a clean vehicle ready to drive with confidence.',
  },
]

const marqueeItems = [
  'DIAGNOSTICS',
  'ENGINE REPAIR',
  'BRAKES',
  'MAINTENANCE',
  'BODYWORK',
  'COLLISION',
  'PAINT',
  'SUSPENSION',
]

export default function HomePage() {
  const [openService, setOpenService] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-white font-sans">
      <Seo {...pageSeo['home']} />
      <SkipToContent />
      <Main>
      <section className="relative overflow-hidden rounded-b-[1.5rem] bg-[#2a2d33] text-white md:rounded-b-[2rem]">
        <img
          src={heroShop}
          srcSet={`${heroShop960} 960w, ${heroShop} 1600w, ${heroShop2400} 2400w`}
          sizes="100vw"
          alt="Sultan Motors auto repair and collision shop in Brampton with vehicles on hoists"
          width={1600}
          height={900}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#111214]/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0e10]/65 via-[#0d0e10]/40 to-[#0d0e10]/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0e10]/45 via-transparent to-[#0d0e10]/70" />
        <SiteNavbar theme="dark" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-14 pb-32 sm:px-6 sm:pt-16 md:px-8 md:pt-20 md:pb-40">
          <div className="mb-5 flex items-center gap-3 md:mb-6">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-white/80 sm:text-[11px]">
              THE CRAFT AND PRECISION BEHIND SULTAN MOTORS
            </span>
          </div>
          <h1 className="max-w-3xl text-[2rem] font-extrabold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            EXPERT AUTO REPAIR AND COLLISION SERVICE IN BRAMPTON
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            Sultan Motors is a full service auto repair and collision shop at{' '}
            {business.streetAddress} in Brampton, Ontario. Diagnostics, engine
            and brake work, bodywork, and paint, handled in one bay by licensed
            technicians since {business.foundingYear}.
          </p>
          <div className="mt-8 sm:mt-10 md:mt-12">
            <BookCta />
          </div>
        </div>
      </section>
      <div
        className="overflow-hidden border-y border-neutral-200 bg-white py-4 md:py-6"
        aria-hidden="true"
      >
        <div className="marquee-track marquee-animate flex w-max gap-10 whitespace-nowrap text-xl font-extrabold tracking-tight text-neutral-900 sm:gap-16 sm:text-2xl md:text-4xl">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 sm:gap-16">
              {marqueeItems.map((item) => (
                <span key={item + i}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <section id="story" className="bg-gradient-to-b from-white to-[#f3f4f6] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center gap-3 md:mb-6">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-neutral-500 sm:text-[11px]">
              THE CRAFT AND PRECISION BEHIND SULTAN MOTORS
            </span>
          </div>
          <h2 className="max-w-5xl text-3xl font-extrabold leading-[1.1] tracking-tight text-[#111] sm:text-4xl md:text-5xl lg:text-6xl">
            FROM A HUMBLE BRAMPTON WORKSHOP TO A TRUSTED DESTINATION, SULTAN
            MOTORS IS BUILT ON SKILL, GRIT, AND GENUINE CARE FOR EVERY DRIVER WE
            SERVE.
          </h2>
          <p className="mt-6 max-w-3xl text-sm text-neutral-500 sm:text-base md:mt-8">
            Meet the people who keep Sultan Motors running. One repair, one rebuild, one loyal customer at a time, right here in Brampton.
          </p>
          <div className="mt-8 sm:mt-10">
            <BookCta />
          </div>
          <figure className="group relative mt-10 overflow-hidden rounded-2xl bg-[#111214] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] sm:rounded-3xl md:mt-14">
            <SitePhoto
              slot="home.story"
              title="Sultan Motors Brampton auto repair workshop"
              sizes="(max-width: 1279px) 100vw, 1280px"
              className="h-[260px] w-full object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] sm:h-[360px] md:h-[520px] lg:h-[620px]"
            />
          </figure>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 md:mt-16">
            {values.map((value) => (
              <div
                key={value.label}
                className="group flex flex-col justify-between rounded-2xl bg-white p-7 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)] sm:p-8 md:p-9"
              >
                <h3 className="text-base font-bold tracking-[0.15em] text-[#111] sm:text-lg md:text-xl">
                  {value.label}
                </h3>
                <p className="mt-8 text-lg leading-relaxed text-neutral-600 sm:text-xl sm:leading-relaxed md:mt-10 md:text-[22px] md:leading-9">
                  {value.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="services" className="bg-[#111214] px-4 py-16 text-white sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-14 md:flex-row md:items-end">
            <div className="min-w-0">
              <div className="mb-5 flex items-center gap-3 md:mb-6">
                <span className="text-[10px] font-semibold tracking-[0.2em] text-white/70 sm:text-[11px]">
                  WHAT WE DO IN THE BAY
                </span>
              </div>
              <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                A FULL SERVICE AUTO REPAIR SHOP FOR EVERY MAKE AND MODEL.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-white/60 md:block">
              Sultan Motors covers the full lifecycle of automotive care, from routine service to full collision recovery, all under one roof in Brampton.
            </p>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {services.map((service) => {
              const open = openService === service.tag
              return (
                <div key={service.tag} className="service-row group">
                  <button
                    type="button"
                    onClick={() => setOpenService(open ? null : service.tag)}
                    aria-expanded={open}
                    aria-controls={`service-panel-${service.tag}`}
                    className="grid w-full grid-cols-12 items-center gap-3 py-6 text-left transition-colors hover:bg-white/[0.03] sm:gap-6 sm:py-8"
                  >
                    <div className="col-span-2 text-[11px] font-bold tracking-[0.2em] text-[#e6ff3d] sm:text-xs">
                      {service.tag}
                    </div>
                    <div className="col-span-8 text-xl font-extrabold tracking-tight sm:col-span-4 sm:text-2xl md:text-4xl">
                      {service.label}
                    </div>
                    <p className="col-span-12 order-last text-[12px] leading-relaxed text-white/60 sm:order-none sm:col-span-4 sm:text-[13px]">
                      {service.copy}
                    </p>
                    <div className="col-span-2 flex items-center justify-end sm:col-span-2">
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-full border border-white/20 transition-all duration-500 sm:h-12 sm:w-12 ${
                          open ? 'rotate-180 border-[#e6ff3d] bg-[#e6ff3d] text-black' : 'text-white'
                        }`}
                      >
                        <ChevronDownIcon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
                      </span>
                    </div>
                  </button>
                  <div
                    id={`service-panel-${service.tag}`}
                    className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-out ${
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="min-h-0">
                      <div className="grid grid-cols-1 gap-6 pb-8 sm:grid-cols-12 sm:gap-8 sm:pb-10">
                        <div className="sm:col-span-5 sm:col-start-3">
                          <h3 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                            {service.heading}
                          </h3>
                          <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
                            {service.details}
                          </p>
                          <SiteLink
                            to={service.to}
                            className="mt-4 inline-flex items-center gap-2 py-2 text-[11px] font-bold tracking-[0.2em] text-[#e6ff3d] underline-offset-4 transition hover:underline"
                          >
                            EXPLORE {service.linkLabel.toUpperCase()}
                            <span aria-hidden="true">→</span>
                          </SiteLink>
                        </div>
                        <div className="sm:col-span-4 sm:col-start-9">
                          <div className="overflow-hidden rounded-2xl">
                            <SitePhoto
                              slot={service.slot}
                              sizes="(max-width: 639px) 100vw, 33vw"
                              className="h-48 w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-56"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-12 md:mt-16">
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-white/70">
              EVERY SERVICE WE OFFER IN BRAMPTON
            </h3>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {serviceLinks.map((link) => (
                <li key={link.to}>
                  <SiteLink
                    to={link.to}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-[13px] font-semibold text-white/90 transition hover:border-[#e6ff3d]/40 hover:bg-white/[0.07] hover:text-white"
                  >
                    {link.label}
                    <span aria-hidden="true" className="text-white/35">
                      →
                    </span>
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section id="process" className="bg-[#111214] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-center gap-3 md:mb-14">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-white/70 sm:text-[11px]">
              HOW WE WORK
            </span>
          </div>
          <h2 className="mb-10 max-w-4xl text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl md:mb-16 md:text-5xl lg:text-6xl">
            A CLEAR PROCESS FROM DROP OFF TO DELIVERY.
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((item, i) => (
              <div
                key={item.step}
                className="process-item group relative rounded-2xl border border-white/10 bg-[#1a1b1f] p-5 transition duration-500 hover:border-white/20 hover:bg-[#222328] sm:p-6"
              >
                <div className="mb-5 flex items-center justify-between md:mb-6">
                  <div className="text-[11px] font-bold tracking-[0.2em] text-white/90">
                    {item.step}
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e6ff3d] text-[10px] font-bold text-black">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-extrabold tracking-tight text-white sm:text-2xl md:mb-4">
                  {item.title}
                </h3>
                <p className="text-[13px] font-bold leading-relaxed text-white/80">{item.copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 sm:mt-12 md:mt-14">
            <BookCta />
          </div>
        </div>
      </section>
      <section id="why" className="relative overflow-hidden bg-[#1e2025] px-4 py-16 text-white sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="mb-5 flex items-center gap-3 md:mb-6">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-white/70 sm:text-[11px]">
                WHY DRIVERS CHOOSE SULTAN MOTORS
              </span>
            </div>
            <h2 className="text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              CRAFTSMANSHIP YOU CAN FEEL IN EVERY MILE.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:mt-8">
              Every vehicle that leaves our shop is inspected, road tested, and delivered with the same standard of care we would want for our own family. That is the Sultan Motors promise, and it is why Brampton drivers keep coming back.
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">
              OEM quality parts, straightforward estimates, fast turnaround, and a warranty on parts and workmanship across the board. No pressure, no surprises, just honest work done right the first time.
            </p>
            <div className="mt-10">
              <BookCta />
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)] sm:rounded-3xl">
              <SitePhoto
                slot="home.why"
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="h-[420px] w-full object-cover sm:h-[520px] lg:h-[640px]"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="visit" className="bg-white px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-center gap-3 md:mb-14">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-neutral-500 sm:text-[11px]">
              VISIT SULTAN MOTORS
            </span>
          </div>
          <h2 className="mb-10 max-w-4xl text-3xl font-extrabold leading-[1.05] tracking-tight text-[#111] sm:text-4xl md:mb-16 md:text-5xl lg:text-6xl">
            DROP BY THE SHOP IN BRAMPTON. WE WILL TAKE IT FROM THERE.
          </h2>
          <div className="mb-8 overflow-hidden rounded-2xl sm:rounded-3xl md:mb-10">
            <SitePhoto
              slot="home.visit"
              title="Sultan Motors Brampton shop exterior"
              sizes="(max-width: 1279px) 100vw, 1280px"
              className="h-[220px] w-full object-cover object-center sm:h-[320px] md:h-[460px] lg:h-[520px]"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            <div className="rounded-2xl bg-[#f3f4f6] p-6 sm:p-8">
              <h3 className="mb-4 text-[11px] font-bold tracking-[0.2em] text-neutral-500">
                LOCATION
              </h3>
              <address className="not-italic">
                <p className="text-base font-semibold text-[#111] sm:text-lg">
                  {business.streetAddress}
                </p>
                <p className="text-base font-semibold text-[#111] sm:text-lg">
                  {business.addressLocality}, {business.addressRegion}{' '}
                  {business.postalCode}
                </p>
              </address>
            </div>
            <div className="rounded-2xl bg-[#f3f4f6] p-6 sm:p-8">
              <h3 className="mb-4 text-[11px] font-bold tracking-[0.2em] text-neutral-500">
                PHONE
              </h3>
              <a
                href={`tel:${business.phoneRaw}`}
                className="text-base font-semibold text-[#111] sm:text-lg"
              >
                {business.phoneDisplay}
              </a>
              <p className="mt-2 text-sm text-neutral-500">
                Call for estimates, bookings, and questions.
              </p>
            </div>
            <div className="rounded-2xl bg-[#111214] p-6 text-white sm:col-span-2 md:col-span-1 sm:p-8">
              <h3 className="mb-4 text-[11px] font-bold tracking-[0.2em] text-[#e6ff3d]">
                HOURS
              </h3>
              <p className="text-base font-semibold sm:text-lg">Mon to Fri: 8am to 6pm</p>
              <p className="text-base font-semibold sm:text-lg">Saturday: 9am to 3pm</p>
              <p className="text-sm text-white/60">Sunday: Closed</p>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200">
            <iframe
              title="Sultan Motors location map"
              src="https://maps.google.com/maps?q=5%20Melanie%20Dr%20Unit%202%20Brampton%20ON%20L6T%204K8&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="420"
              loading="lazy"
              className="h-[280px] w-full sm:h-[360px] md:h-[420px]"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </section>
        </Main>
      <SiteFooter />
    </div>
  )
}
