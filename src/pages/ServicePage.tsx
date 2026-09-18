import { useRef, useState } from 'react'
import SiteLink from '../components/SiteLink'
import SiteNavbar from '../components/SiteNavbar'
import SiteFooter from '../components/SiteFooter'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { SkipToContent, Main } from '../components/PageShell'
import SitePhoto from '../components/SitePhoto'
import { pageSeo, breadcrumbTrails } from '../data/seo'
import { business } from '../data/site'
import { photo } from '../data/photos'
import type { ServiceConfig, DetailSection } from '../data/services'
import { useHeroReveal } from '../motion/useHeroReveal'
import { useReveal } from '../motion/useReveal'

/**
 * The service template. One composition system, but the sections a page
 * shows are decided by its content: the safety certificate page carries an
 * explainer, a checklist and a closing block that the brake page does not,
 * and the brake page carries a gallery and a brand line the safety page does
 * not. Nothing is boxed; hierarchy comes from scale, numbering and rules.
 */
export default function ServicePage({ config }: { config: ServiceConfig }) {
  const hero = useRef<HTMLElement>(null)
  const page = useRef<HTMLDivElement>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  useHeroReveal(hero)
  useReveal(page)

  const slot = (role: string) => `svc.${config.slug}.${role}`
  const heroPhoto = photo(slot('hero'))
  const gallery = config.gallery?.images.filter((_, i) => photo(slot(`g${i + 1}`))) ?? []
  const galleryLayout = [
    'md:col-span-7 aspect-[4/3]',
    'md:col-span-5 aspect-[4/5] md:mt-24',
    'md:col-span-5 md:col-start-8 aspect-[4/3] md:-mt-16',
  ]

  return (
    <div className="bg-paper text-ink">
      <Seo {...pageSeo[config.slug]} />
      <SkipToContent />
      <Main>
        <div ref={page}>
          <section ref={hero} className="relative flex min-h-[88svh] flex-col bg-ink text-paper">
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
                  className="h-full w-full object-cover object-center opacity-60"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
            </div>

            <SiteNavbar theme="dark" />

            <div className="wrap relative z-10 flex flex-1 flex-col justify-between pb-[clamp(2.5rem,6vh,5rem)] pt-4">
              <Breadcrumbs data-hero-rest trail={breadcrumbTrails[config.slug]} theme="dark" />
              <div className="grid-12 items-end gap-y-8 pt-16">
                <h1 data-hero-title className="t-h1 col-span-12 max-w-[16ch] lg:col-span-9">
                  {config.h1}
                </h1>
                <p
                  data-hero-rest
                  className="t-lead col-span-12 max-w-[50ch] text-paper/75 lg:col-span-7"
                >
                  {config.heroSubtitle}
                </p>
                <div
                  data-hero-rest
                  className="col-span-12 flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-5 lg:justify-end"
                >
                  <SiteLink to="/contact" className="btn btn-accent">
                    {config.heroCta ?? 'Book your repair'}
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

          {/* Introduction: the argument on the left, the evidence on the right. */}
          <section className="section-y">
            <div className="wrap grid-12 gap-y-12">
              <div className="col-span-12 lg:col-span-6">
                <h2 data-reveal className="t-h2 max-w-[18ch]">
                  {config.intro.heading}
                </h2>
                {(Array.isArray(config.intro.body) ? config.intro.body : [config.intro.body]).map(
                  (para) => (
                    <p key={para.slice(0, 40)} data-reveal className="t-body mt-7 max-w-[56ch] text-mute">
                      {para}
                    </p>
                  ),
                )}
                <ul data-reveal data-reveal-group className="mt-10 max-w-[56ch]">
                  {config.intro.bullets.map((bullet) => (
                    <li key={bullet} className="rule flex gap-5 py-3.5">
                      <span aria-hidden="true" className="mt-[0.7em] h-1 w-1 shrink-0 bg-ink" />
                      <span className="t-body">{bullet}</span>
                    </li>
                  ))}
                  <li className="rule" aria-hidden="true" />
                </ul>
              </div>
              <div data-reveal="image" className="col-span-12 overflow-hidden bg-paper-3 lg:col-span-5 lg:col-start-8">
                <SitePhoto
                  slot={slot('intro')}
                  sizes="(max-width: 1023px) 100vw, 42vw"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* What is covered, as a numbered index. */}
          <section className="section-y bg-paper-2">
            <div className="wrap">
              <div className="grid-12 gap-y-6">
                <h2 data-reveal className="t-h2 col-span-12 max-w-[18ch] lg:col-span-7">
                  {config.serviceCards.heading}
                </h2>
                {config.serviceCards.subheading && (
                  <p data-reveal className="t-body col-span-12 max-w-[46ch] self-end text-mute lg:col-span-4 lg:col-start-9">
                    {config.serviceCards.subheading}
                  </p>
                )}
              </div>
              <ol data-reveal data-reveal-group className="mt-12 md:mt-16">
                {config.serviceCards.cards.map((card, i) => {
                  const inner = (
                    <>
                      <span className="t-index tnum pt-1 text-mute-2">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="t-h3 transition-colors duration-300 group-hover:text-ink">
                        {card.title}
                      </span>
                      <span className="t-body max-w-[50ch] text-mute md:col-start-3">
                        {card.description}
                      </span>
                      {card.to && (
                        <span
                          aria-hidden="true"
                          className="t-small self-start justify-self-end text-mute-2 transition-transform duration-500 group-hover:translate-x-1 md:col-start-4"
                        >
                          →
                        </span>
                      )}
                    </>
                  )
                  const cls =
                    'group rule grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-3 py-7 md:grid-cols-[3.5rem_minmax(0,18rem)_1fr_2rem] md:gap-x-8 md:py-8'
                  return (
                    <li key={card.title}>
                      {card.to ? (
                        <SiteLink to={card.to} className={cls}>
                          {inner}
                        </SiteLink>
                      ) : (
                        <div className={cls}>{inner}</div>
                      )}
                    </li>
                  )
                })}
                <li className="rule" aria-hidden="true" />
              </ol>
            </div>
          </section>

          {/* Why it matters. */}
          <section className="section-y">
            <div className="wrap grid-12 gap-y-12">
              <div data-reveal="image" className="col-span-12 overflow-hidden bg-paper-3 md:col-span-5">
                <SitePhoto
                  slot={slot('why')}
                  sizes="(max-width: 767px) 100vw, 40vw"
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
              <div className="col-span-12 md:col-span-6 md:col-start-7">
                <h2 data-reveal className="t-h2 max-w-[16ch]">
                  {config.whyUs.heading}
                </h2>
                <ol data-reveal data-reveal-group className="mt-10">
                  {config.whyUs.points.map((point, i) => (
                    <li key={point.title} className="rule grid grid-cols-[2.5rem_1fr] gap-x-4 py-6">
                      <span className="t-index tnum pt-1.5 text-mute-2">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="t-h3 text-[1.25rem] md:text-[1.375rem]">{point.title}</h3>
                        <p className="t-body mt-2 max-w-[50ch] text-mute">{point.description}</p>
                      </div>
                    </li>
                  ))}
                  <li className="rule" aria-hidden="true" />
                </ol>
              </div>
            </div>
          </section>

          {config.whenYouNeed && <DetailBlock section={config.whenYouNeed} tone="light" columns={2} />}

          {/* Process. */}
          <section className="section-y bg-ink text-paper">
            <div className="wrap grid-12 gap-y-12">
              <div className="col-span-12 lg:col-span-4">
                <h2 data-reveal className="t-h2 max-w-[12ch] lg:sticky lg:top-28">
                  {config.process.heading}
                </h2>
              </div>
              <ol data-reveal data-reveal-group className="col-span-12 lg:col-span-7 lg:col-start-6">
                {config.process.steps.map((step, i) => (
                  <li
                    key={step.title}
                    className="rule-dark grid grid-cols-[3.5rem_1fr] gap-x-6 py-7 md:grid-cols-[5rem_1fr] md:py-9"
                  >
                    <span className="t-h3 tnum font-medium text-paper/35">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="t-h3">{step.title}</h3>
                      <p className="t-body mt-3 max-w-[52ch] text-paper/60">{step.description}</p>
                    </div>
                  </li>
                ))}
                <li className="rule-dark" aria-hidden="true" />
              </ol>
            </div>
          </section>

          {config.brands && (
            <section className="section-y-sm">
              <div className="wrap grid-12 gap-y-8">
                <div className="col-span-12 lg:col-span-4">
                  <h2 data-reveal className="t-h3 max-w-[16ch]">
                    {config.brands.heading}
                  </h2>
                  {config.brands.subheading && (
                    <p data-reveal className="t-small mt-4 max-w-[36ch] text-mute">
                      {config.brands.subheading}
                    </p>
                  )}
                </div>
                <p
                  data-reveal
                  className="t-h2 col-span-12 font-medium leading-[1.15] text-ink/85 lg:col-span-8"
                >
                  {/*
                    Real spaces between the names, so the line has break
                    opportunities: a middle dot alone is not one, and without
                    the spaces the whole list lays out as one unbreakable run.
                  */}
                  {config.brands.items.map((brand, i) => (
                    <span key={brand}>
                      {brand}
                      {i < config.brands!.items.length - 1 && (
                        <>
                          {' '}
                          <span aria-hidden="true" className="text-mute-2">
                            ·
                          </span>{' '}
                        </>
                      )}
                    </span>
                  ))}
                </p>
              </div>
            </section>
          )}

          {config.inspectChecklist && (
            <DetailBlock section={config.inspectChecklist} tone="muted" columns={2} compact />
          )}

          {config.readyBlock && (
            <section className="section-y bg-ink-4 text-paper">
              <div className="wrap">
                <h2 data-reveal className="t-h2 max-w-[18ch]">
                  {config.readyBlock.heading}
                </h2>
                <div data-reveal data-reveal-group className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-3">
                  {config.readyBlock.paragraphs.map((para) => (
                    <p key={para.slice(0, 40)} className="t-body text-paper/65">
                      {para}
                    </p>
                  ))}
                </div>
                <div data-reveal className="mt-12 flex flex-wrap gap-3">
                  <SiteLink to="/contact" className="btn btn-accent">
                    {config.heroCta ?? 'Book an appointment'}
                    <span className="arrow" aria-hidden="true">
                      ↗
                    </span>
                  </SiteLink>
                  <a href={`tel:${business.phoneRaw}`} className="btn btn-ghost-dark">
                    Call {business.phoneDisplay}
                  </a>
                </div>
              </div>
            </section>
          )}

          {config.gallery && gallery.length > 0 && (
            <section className="section-y">
              <div className="wrap">
                <div className="grid-12 gap-y-4">
                  <h2 data-reveal className="t-h2 col-span-12 max-w-[16ch] lg:col-span-7">
                    {config.gallery.heading}
                  </h2>
                  {config.gallery.subheading && (
                    <p data-reveal className="t-body col-span-12 max-w-[40ch] self-end text-mute lg:col-span-4 lg:col-start-9">
                      {config.gallery.subheading}
                    </p>
                  )}
                </div>
                <div className="grid-12 mt-12 gap-y-8 md:mt-16">
                  {gallery.map((image, i) => (
                    <figure key={image.caption ?? i} className={`col-span-12 ${galleryLayout[i] ?? ''}`}>
                      <div data-reveal="image" className="h-full w-full overflow-hidden bg-paper-3">
                        <SitePhoto
                          slot={slot(`g${i + 1}`)}
                          sizes="(max-width: 767px) 100vw, 58vw"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {image.caption && (
                        <figcaption className="t-index mt-3 text-mute">{image.caption}</figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Questions. */}
          <section className="section-y bg-paper-2">
            <div className="wrap grid-12 gap-y-10">
              <h2 data-reveal className="t-h2 col-span-12 max-w-[14ch] lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
                {config.faqHeading ?? 'Questions Brampton drivers ask.'}
              </h2>
              <div data-reveal className="col-span-12 lg:col-span-6 lg:col-start-7">
                {config.faqs.map((faq, i) => {
                  const open = openFaq === i
                  const id = `faq-${config.slug}-${i}`
                  return (
                    <div key={faq.q} className="rule">
                      <h3>
                        <button
                          type="button"
                          onClick={() => setOpenFaq(open ? null : i)}
                          aria-expanded={open}
                          aria-controls={id}
                          className="grid w-full grid-cols-[1fr_1.5rem] items-start gap-6 py-6 text-left"
                        >
                          <span className="t-h3 text-[1.25rem] md:text-[1.375rem]">{faq.q}</span>
                          <span
                            aria-hidden="true"
                            className="relative mt-2 block h-4 w-4 justify-self-end"
                          >
                            <span className="absolute left-0 top-1/2 h-px w-full bg-ink" />
                            <span
                              className={`absolute left-1/2 top-0 h-full w-px bg-ink transition-transform duration-400 ${
                                open ? 'scale-y-0' : 'scale-y-100'
                              }`}
                            />
                          </span>
                        </button>
                      </h3>
                      <div
                        id={id}
                        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="t-body max-w-[54ch] pb-7 text-mute">{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div className="rule" aria-hidden="true" />
              </div>
            </div>
          </section>

          {/* The close: one clear ask, and where to go next. */}
          <section className="section-y bg-ink text-paper">
            <div className="wrap grid-12 gap-y-14">
              <div className="col-span-12 lg:col-span-6">
                <h2 data-reveal className="t-h2 max-w-[14ch]">
                  {config.cta?.heading ?? 'Ready when your vehicle is.'}
                </h2>
                <p data-reveal className="t-body mt-7 max-w-[46ch] text-paper/65">
                  {config.cta?.body ??
                    `Speak with a Sultan Motors technician for a clear quote, an honest timeline and warranty backed work at ${business.streetAddress} in ${business.addressLocality}.`}
                </p>
                <div data-reveal className="mt-10 flex flex-wrap gap-3">
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
              <nav className="col-span-12 lg:col-span-5 lg:col-start-8" aria-label="Related services">
                <p data-reveal className="t-index text-paper/45">
                  Related
                </p>
                <ul data-reveal data-reveal-group className="mt-5">
                  {config.internalLinks.map((link) => (
                    <li key={link.to + link.label} className="rule-dark">
                      <SiteLink to={link.to} className="group flex items-baseline justify-between gap-6 py-4">
                        <span>
                          <span className="block font-medium transition-colors duration-300 group-hover:text-accent">
                            {link.label.replace(' Brampton', '')}
                          </span>
                          <span className="t-small mt-1 block text-paper/50">{link.description}</span>
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
                  <li className="rule-dark" aria-hidden="true" />
                </ul>
              </nav>
            </div>
          </section>

          <section className="section-y">
            <div className="wrap">
              <h2 data-reveal className="t-h2 max-w-[14ch]">
                {business.streetAddress}, {business.addressLocality}.
              </h2>
              <div data-reveal className="mt-10 overflow-hidden bg-paper-3">
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

/**
 * A numbered explainer or checklist: heading, an optional paragraph, then
 * rows. Used for the safety certificate page's "when you need it" and "what
 * we inspect" content.
 */
function DetailBlock({
  section,
  tone,
  columns,
  compact,
}: {
  section: DetailSection
  tone: 'light' | 'muted'
  columns: 1 | 2
  compact?: boolean
}) {
  return (
    <section className={`section-y ${tone === 'muted' ? 'bg-paper-2' : ''}`}>
      <div className="wrap">
        <div className="grid-12 gap-y-6">
          <h2 data-reveal className="t-h2 col-span-12 max-w-[18ch] lg:col-span-7">
            {section.heading}
          </h2>
          {section.body && (
            <p data-reveal className="t-body col-span-12 max-w-[46ch] self-end text-mute lg:col-span-4 lg:col-start-9">
              {section.body}
            </p>
          )}
        </div>
        <ol
          data-reveal
          data-reveal-group
          className={`mt-12 md:mt-16 ${columns === 2 ? 'grid gap-x-10 md:grid-cols-2' : ''}`}
        >
          {section.items.map((item, i) => (
            <li
              key={item.title}
              className={`rule grid grid-cols-[2.5rem_1fr] gap-x-4 ${compact ? 'py-5' : 'py-7'}`}
            >
              <span className="t-index tnum pt-1.5 text-mute-2">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className={compact ? 'font-medium' : 't-h3 text-[1.25rem] md:text-[1.375rem]'}>
                  {item.title}
                </h3>
                <p className={`t-body max-w-[48ch] text-mute ${compact ? 'mt-1 t-small' : 'mt-2'}`}>
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
