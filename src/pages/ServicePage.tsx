import { useState } from 'react'
import SiteLink from '../components/SiteLink'
import { ChevronDownIcon } from '../components/icons'
import SiteNavbar from '../components/SiteNavbar'
import SiteFooter from '../components/SiteFooter'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { SkipToContent, Main } from '../components/PageShell'
import { pageSeo, breadcrumbTrails } from '../data/seo'
import SitePhoto, { backgroundImageSet } from '../components/SitePhoto'
import { photo } from '../data/photos'
import { business } from '../data/site'
import type { ServiceConfig } from '../data/services'

export default function ServicePage({ config }: { config: ServiceConfig }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const slot = (role: string) => `svc.${config.slug}.${role}`
  const heroBg = photo(slot('hero'))

  return (
    <div className="min-h-screen bg-white font-sans">
      <Seo {...pageSeo[config.slug]} />
      <SkipToContent />
      <Main>
      <div className="bg-[#0d0e10] text-white">
        <SiteNavbar theme="dark" />
        <section className="relative overflow-hidden px-4 pb-20 pt-6 sm:px-6 sm:pb-28 md:px-8 md:pb-32">
          <div
            className="hero-image pointer-events-none absolute inset-0 bg-cover bg-center opacity-30 sm:opacity-40"
            style={{ backgroundImage: backgroundImageSet(heroBg) }}
            role="img"
            aria-label={heroBg?.alt ?? config.heroImageAlt}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0d0e10]/60 via-[#0d0e10]/40 to-[#0d0e10]" />
          <div className="relative z-10 mx-auto max-w-7xl pt-6 md:pt-10">
            <Breadcrumbs
              trail={breadcrumbTrails[config.slug] ?? []}
              theme="dark"
              className="mb-6"
            />
            <div className="hero-reveal text-[10px] font-semibold tracking-[0.24em] text-[#e6ff3d] sm:text-[11px]">
              {config.eyebrow}
            </div>
            <h1 className="hero-reveal mt-4 max-w-5xl text-[2rem] font-extrabold leading-[1.02] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              {config.h1}
            </h1>
            <p className="hero-reveal mt-6 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              {config.heroSubtitle}
            </p>
            <div className="hero-reveal mt-8 flex flex-wrap gap-3">
              <SiteLink
                to="/contact"
                className="rounded-full bg-[#e6ff3d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d9f232]"
              >
                {config.heroCta ?? 'Book Your Repair'}
              </SiteLink>
              <a
                href={`tel:${business.phoneRaw}`}
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Call {business.phoneDisplay}
              </a>
            </div>
            <div className="hero-reveal mt-14 grid max-w-3xl gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
              <div>
                <div className="text-2xl font-extrabold sm:text-3xl">20+</div>
                <div className="mt-1 text-[11px] font-semibold tracking-[0.2em] text-white/60">
                  YEARS EXPERIENCE
                </div>
              </div>
              <div>
                <div className="text-2xl font-extrabold sm:text-3xl">15K+</div>
                <div className="mt-1 text-[11px] font-semibold tracking-[0.2em] text-white/60">
                  VEHICLES SERVICED
                </div>
              </div>
              <div>
                <div className="text-2xl font-extrabold sm:text-3xl">100%</div>
                <div className="mt-1 text-[11px] font-semibold tracking-[0.2em] text-white/60">
                  CERTIFIED TECHNICIANS
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <div className="reveal text-[10px] font-semibold tracking-[0.24em] text-neutral-500 sm:text-[11px]">
              {config.intro.eyebrow}
            </div>
            <h2 className="reveal mt-4 text-3xl font-extrabold leading-[1.05] tracking-tight text-[#111] sm:text-4xl md:text-5xl">
              {config.intro.heading}
            </h2>
            {(Array.isArray(config.intro.body) ? config.intro.body : [config.intro.body]).map((para) => (
              <p
                key={para.slice(0, 40)}
                className="reveal mt-6 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base"
              >
                {para}
              </p>
            ))}
            <ul className="reveal mt-6 space-y-3 text-sm text-neutral-700 sm:text-base">
              {config.intro.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#111]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <div className="overflow-hidden rounded-3xl">
              <SitePhoto
                slot={slot('intro')}
                sizes="(max-width: 767px) 100vw, 50vw"
                className="h-[300px] w-full object-cover sm:h-[400px] md:h-[520px]"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f6f6f6] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="reveal text-[10px] font-semibold tracking-[0.24em] text-neutral-500 sm:text-[11px]">
            WHAT WE COVER
          </div>
          <h2 className="reveal mt-4 max-w-3xl text-3xl font-extrabold leading-[1.05] tracking-tight text-[#111] sm:text-4xl md:text-5xl">
            {config.serviceCards.heading}
          </h2>
          {config.serviceCards.subheading && (
            <p className="reveal mt-4 max-w-2xl text-sm text-neutral-600 sm:text-base">
              {config.serviceCards.subheading}
            </p>
          )}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {config.serviceCards.cards.map((card, i) => {
              const cardBody = (
                <>
                  <div className="text-[11px] font-bold tracking-[0.2em] text-neutral-500">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold text-[#111]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{card.description}</p>
                  {card.to && (
                    <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-[#111]">
                      LEARN MORE →
                    </span>
                  )}
                </>
              )
              const cardCls =
                'reveal group rounded-2xl bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] sm:p-8'
              return card.to ? (
                <SiteLink key={card.title} to={card.to} className={cardCls}>
                  {cardBody}
                </SiteLink>
              ) : (
                <div key={card.title} className={cardCls}>
                  {cardBody}
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:gap-16">
          <div className="order-2 overflow-hidden rounded-3xl md:order-1">
            <SitePhoto
              slot={slot('why')}
              sizes="(max-width: 767px) 100vw, 50vw"
              className="h-[300px] w-full object-cover sm:h-[400px] md:h-[560px]"
            />
          </div>
          <div className="order-1 md:order-2">
            <div className="text-[10px] font-semibold tracking-[0.24em] text-neutral-500 sm:text-[11px]">
              WHY SULTAN MOTORS
            </div>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.05] tracking-tight text-[#111] sm:text-4xl md:text-5xl">
              {config.whyUs.heading}
            </h2>
            <div className="mt-8 space-y-6">
              {config.whyUs.points.map((point, i) => (
                <div key={point.title} className="flex gap-4">
                  <div className="shrink-0 rounded-full bg-[#111] px-3 py-1 text-[11px] font-bold text-[#e6ff3d]">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-[#111] sm:text-lg">
                      {point.title}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {config.whenYouNeed && (
        <section className="bg-[#f6f6f6] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="text-[10px] font-semibold tracking-[0.24em] text-neutral-500 sm:text-[11px]">
              {config.whenYouNeed.eyebrow}
            </div>
            <h2 className="mt-4 max-w-4xl text-3xl font-extrabold leading-[1.05] tracking-tight text-[#111] sm:text-4xl md:text-5xl">
              {config.whenYouNeed.heading}
            </h2>
            {config.whenYouNeed.body && (
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                {config.whenYouNeed.body}
              </p>
            )}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {config.whenYouNeed.items.map((item, i) => (
                <div key={item.title} className="rounded-2xl bg-white p-6 sm:p-8">
                  <div className="text-[11px] font-bold tracking-[0.2em] text-neutral-500">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold text-[#111]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="bg-[#111214] px-4 py-16 text-white sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-[10px] font-semibold tracking-[0.24em] text-white/60 sm:text-[11px]">
            HOW WE WORK
          </div>
          <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
            {config.process.heading}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {config.process.steps.map((step, i) => (
              <div key={step.title} className="rounded-2xl bg-[#1a1b1f] p-6 sm:p-7">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e6ff3d] text-sm font-bold text-black">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="mt-5 text-[11px] font-bold tracking-[0.2em] text-white">
                  STEP {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="mt-2 text-lg font-extrabold text-white sm:text-xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {config.brands && (
        <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="text-[10px] font-semibold tracking-[0.24em] text-neutral-500 sm:text-[11px]">
              BRANDS WE SERVICE
            </div>
            <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.05] tracking-tight text-[#111] sm:text-4xl md:text-5xl">
              {config.brands.heading}
            </h2>
            {config.brands.subheading && (
              <p className="mt-4 max-w-2xl text-sm text-neutral-600 sm:text-base">
                {config.brands.subheading}
              </p>
            )}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {config.brands.items.map((brand) => (
                <div
                  key={brand}
                  className="grid place-items-center rounded-2xl border border-neutral-200 bg-white px-4 py-6 text-sm font-extrabold tracking-wide text-[#111] transition hover:border-[#111]"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {config.inspectChecklist && (
        <section className="bg-[#f6f6f6] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="text-[10px] font-semibold tracking-[0.24em] text-neutral-500 sm:text-[11px]">
              {config.inspectChecklist.eyebrow}
            </div>
            <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.05] tracking-tight text-[#111] sm:text-4xl md:text-5xl">
              {config.inspectChecklist.heading}
            </h2>
            {config.inspectChecklist.body && (
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                {config.inspectChecklist.body}
              </p>
            )}
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {config.inspectChecklist.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-[#111] sm:p-6"
                >
                  <div className="text-[11px] font-bold tracking-[0.2em] text-[#111]">{item.title}</div>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {config.readyBlock && (
        <section className="bg-[#1e2025] px-4 py-16 text-white sm:px-6 sm:py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="text-[10px] font-semibold tracking-[0.24em] text-[#e6ff3d] sm:text-[11px]">
              {config.readyBlock.eyebrow}
            </div>
            <h2 className="mt-4 max-w-4xl text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
              {config.readyBlock.heading}
            </h2>
            <div className="mt-8 grid max-w-5xl gap-5 md:grid-cols-3">
              {config.readyBlock.paragraphs.map((para) => (
                <p key={para.slice(0, 40)} className="text-sm leading-relaxed text-white/70 sm:text-base">
                  {para}
                </p>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <SiteLink
                to="/contact"
                className="rounded-full bg-[#e6ff3d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d9f232]"
              >
                {config.heroCta ?? 'Book an appointment'}
              </SiteLink>
              <a
                href={`tel:${business.phoneRaw}`}
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Call {business.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      )}
      {config.gallery && (
      <section className="bg-[#f6f6f6] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-[10px] font-semibold tracking-[0.24em] text-neutral-500 sm:text-[11px]">
            WORK GALLERY
          </div>
          <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.05] tracking-tight text-[#111] sm:text-4xl md:text-5xl">
            {config.gallery.heading}
          </h2>
          {config.gallery.subheading && (
            <p className="mt-4 max-w-2xl text-sm text-neutral-600 sm:text-base">
              {config.gallery.subheading}
            </p>
          )}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {config.gallery.images.map((image, i) => (
              <figure key={image.caption ?? i} className="overflow-hidden rounded-2xl bg-white">
                <SitePhoto
                  slot={slot(`g${i + 1}`)}
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="h-64 w-full object-cover transition duration-500 hover:scale-105"
                />
                {image.caption && (
                  <figcaption className="px-4 py-3 text-[11px] font-bold tracking-[0.2em] text-neutral-600">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </section>
      )}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="text-[10px] font-semibold tracking-[0.24em] text-neutral-500 sm:text-[11px]">
            FAQ
          </div>
          <h2 className="mt-4 text-3xl font-extrabold leading-[1.05] tracking-tight text-[#111] sm:text-4xl md:text-5xl">
            {config.faqHeading ?? 'Questions Brampton drivers ask.'}
          </h2>
          <div className="mt-10 divide-y divide-neutral-200 border-y border-neutral-200">
            {config.faqs.map((faq, i) => {
              const open = openFaq === i
              return (
                <button
                  key={faq.q}
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="grid w-full grid-cols-[1fr_auto] items-start gap-4 py-5 text-left"
                  aria-expanded={open}
                >
                  <div>
                    <div className="text-base font-extrabold text-[#111] sm:text-lg">{faq.q}</div>
                    <div
                      className={`grid transition-all duration-300 ${
                        open ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ChevronDownIcon
                    className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </section>
      <section className="bg-[#0d0e10] px-4 py-16 text-white sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <div className="text-[10px] font-semibold tracking-[0.24em] text-[#e6ff3d] sm:text-[11px]">
                {config.cta?.eyebrow ?? 'BOOK YOUR APPOINTMENT'}
              </div>
              <h2 className="mt-4 text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
                {config.cta?.heading ?? 'Ready when your vehicle is.'}
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
                {config.cta?.body ??
                  `Speak with a Sultan Motors technician for a clear quote, honest timeline, and warranty backed work at ${business.streetAddress} in ${business.addressLocality}.`}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <SiteLink
                  to="/contact"
                  className="rounded-full bg-[#e6ff3d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d9f232]"
                >
                  Book appointment
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
              <div className="mb-4 text-[11px] font-bold tracking-[0.2em] text-white/60">
                RELATED SERVICES
              </div>
              <ul className="space-y-3">
                {config.internalLinks.map((link) => (
                  <li key={link.to + link.label}>
                    <SiteLink
                      to={link.to}
                      className="group flex items-start justify-between gap-4 rounded-xl bg-white/5 px-4 py-4 transition hover:bg-white/10"
                    >
                      <div>
                        <div className="text-sm font-extrabold text-white">{link.label}</div>
                        <div className="mt-1 text-xs text-white/60">{link.description}</div>
                      </div>
                      <span className="mt-1 text-white/40 transition group-hover:translate-x-1">
                        →
                      </span>
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-[10px] font-semibold tracking-[0.24em] text-neutral-500 sm:text-[11px]">
            FIND US
          </div>
          <h2 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.05] tracking-tight text-[#111] sm:text-4xl md:text-5xl">
            {business.streetAddress}, {business.addressLocality}.
          </h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 sm:rounded-3xl">
            <iframe
              title="Sultan Motors location map"
              src="https://maps.google.com/maps?q=5%20Melanie%20Dr%20Unit%202%20Brampton%20ON%20L6T%204K8&t=&z=15&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              className="h-[320px] w-full sm:h-[440px] md:h-[520px]"
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
