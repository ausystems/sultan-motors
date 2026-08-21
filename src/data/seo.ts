import type { SeoProps } from '../components/Seo'
import {
  SITE_LANG,
  SITE_NAME,
  absoluteUrl,
  businessSchema,
  websiteSchema,
  schemaId,
  ogImageUrl,
  OG_IMAGE,
  business,
} from './site'
import { serviceConfigs, type Faq } from './services'
import { photo } from './photos'

/* -------------------------------------------------------------------------- */
/* Breadcrumbs                                                                 */
/* -------------------------------------------------------------------------- */

export interface Crumb {
  label: string
  to: string
}

/**
 * Visible breadcrumb trail per route, also emitted as BreadcrumbList JSON-LD.
 * Trails stay two levels deep because the site has no /services index page —
 * every entry here resolves to a real, indexable URL.
 */
export const breadcrumbTrails: Record<string, Crumb[]> = {
  'about-us': [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about-us' },
  ],
  contact: [
    { label: 'Home', to: '/' },
    { label: 'Book an Appointment', to: '/contact' },
  ],
}

/* -------------------------------------------------------------------------- */
/* Schema builders                                                             */
/* -------------------------------------------------------------------------- */

function breadcrumbSchema(path: string, trail: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': schemaId.breadcrumb(path),
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.to),
    })),
  }
}

/**
 * The page's own lead photograph, as a proper ImageObject.
 *
 * schema.org's range for `primaryImageOfPage` is ImageObject, not a URL string,
 * and pointing every page at the shared social card would have each service
 * page declaring that its primary image is a generic shot of the building.
 */
function primaryImage(slot: string) {
  const p = photo(slot)
  if (!p) return undefined
  return {
    '@type': 'ImageObject',
    url: absoluteUrl(p.src),
    width: p.width,
    height: p.height,
    caption: p.alt,
  }
}

function webPageSchema(
  path: string,
  name: string,
  description: string,
  hasBreadcrumb: boolean,
  imageSlot?: string,
) {
  const image = imageSlot ? primaryImage(imageSlot) : undefined
  return {
    '@type': 'WebPage',
    '@id': schemaId.page(path),
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: SITE_LANG,
    isPartOf: { '@id': schemaId.website },
    about: { '@id': schemaId.business },
    primaryImageOfPage: image ?? {
      '@type': 'ImageObject',
      url: ogImageUrl,
      width: OG_IMAGE.width,
      height: OG_IMAGE.height,
      caption: OG_IMAGE.alt,
    },
    ...(hasBreadcrumb ? { breadcrumb: { '@id': schemaId.breadcrumb(path) } } : {}),
  }
}

function faqSchema(path: string, faqs: Faq[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    mainEntity: faqs.map((faq, i) => ({
      '@type': 'Question',
      '@id': `${absoluteUrl(path)}#faq-${i + 1}`,
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }
}

function serviceSchema(
  serviceType: string,
  description: string,
  path: string,
  imageSlot: string,
) {
  const image = primaryImage(imageSlot)
  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(path)}#service`,
    name: serviceType,
    serviceType,
    description,
    url: absoluteUrl(path),
    ...(image ? { image: image.url } : {}),
    provider: { '@id': schemaId.business },
    areaServed: business.areaServed.map((name) => ({ '@type': 'City', name })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: absoluteUrl('/contact'),
      servicePhone: business.phoneSchema,
      serviceLocation: { '@id': schemaId.business },
    },
  }
}

/** Wraps every node for a page into one `@graph`, emitted as a single script. */
function graph(nodes: object[]): object[] {
  return [{ '@context': 'https://schema.org', '@graph': nodes }]
}

/* -------------------------------------------------------------------------- */
/* Per-service metadata                                                        */
/* -------------------------------------------------------------------------- */

interface ServiceMeta {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  serviceType: string
  serviceDescription: string
  /** Breadcrumb label — shorter than the page title. */
  crumb: string
}

const serviceMeta: Record<string, ServiceMeta> = {
  'auto-repair-brampton': {
    title: 'Auto Repair Brampton | Trusted Mechanics | Sultan Motors',
    description:
      'Full service auto repair in Brampton at Sultan Motors. Diagnostics, engines, brakes, suspension and maintenance, with a written quote before any work starts.',
    ogTitle: 'Auto Repair Brampton | Sultan Motors',
    ogDescription:
      'Expert auto repair in Brampton. Diagnostics, engines, brakes, maintenance and collision service backed by 20 years in the bay.',
    serviceType: 'Auto Repair',
    serviceDescription:
      'Full service auto repair, computerised diagnostics, scheduled maintenance and mechanical work for cars, SUVs and light trucks in Brampton, Ontario.',
    crumb: 'Auto Repair',
  },
  'car-diagnostics-brampton': {
    title: 'Car Diagnostics Brampton | Check Engine Light Experts',
    description:
      'Check engine light on? Sultan Motors runs full system scans, live data and circuit testing in Brampton to find the real fault before you pay for parts.',
    ogTitle: 'Car Diagnostics Brampton | Sultan Motors',
    ogDescription:
      'Professional car diagnostics in Brampton. Advanced scan tools, live data testing and honest repair recommendations.',
    serviceType: 'Car Diagnostics',
    serviceDescription:
      'Vehicle diagnostics, OBD-II scanning, live data analysis and check engine light diagnosis in Brampton, Ontario.',
    crumb: 'Car Diagnostics',
  },
  'engine-repair-brampton': {
    title: 'Engine Repair Brampton | Diagnostics, Timing & Rebuilds',
    description:
      'Engine repair in Brampton by experienced mechanics. Misfires, oil leaks, overheating, timing work and full engine replacement, quoted in writing first.',
    ogTitle: 'Engine Repair Brampton | Sultan Motors',
    ogDescription:
      'Professional engine repair in Brampton. Diagnostics, timing, rebuilds and complete engine replacement.',
    serviceType: 'Engine Repair',
    serviceDescription:
      'Engine diagnostics, mechanical repair, timing service, head gasket work and engine replacement in Brampton, Ontario.',
    crumb: 'Engine Repair',
  },
  'brake-repair-brampton': {
    title: 'Brake Repair Brampton | Pads, Rotors & Brake Service',
    description:
      'Brake repair in Brampton at Sultan Motors. Pads, rotors, calipers and brake fluid service, measured against factory specs and road tested before pickup.',
    ogTitle: 'Brake Repair Brampton | Sultan Motors',
    ogDescription:
      'Full brake repair in Brampton. Pads, rotors, calipers, fluid service and safety inspections.',
    serviceType: 'Brake Repair',
    serviceDescription:
      'Brake pad replacement, rotor service, caliper repair and brake fluid flushes in Brampton, Ontario.',
    crumb: 'Brake Repair',
  },
  'car-maintenance-brampton': {
    title: 'Car Maintenance Brampton | Oil Change & Scheduled Service',
    description:
      "Car maintenance in Brampton on your manufacturer's schedule. Oil services, fluid flushes, tune ups and a multi point inspection at every visit.",
    ogTitle: 'Car Maintenance Brampton | Sultan Motors',
    ogDescription:
      'Manufacturer scheduled car maintenance in Brampton. Oil, fluids, tune ups and multi point inspections.',
    serviceType: 'Car Maintenance',
    serviceDescription:
      'Manufacturer scheduled maintenance, oil and filter service, fluid flushes and preventative inspections in Brampton, Ontario.',
    crumb: 'Car Maintenance',
  },
  'transmission-repair-brampton': {
    title: 'Transmission Repair Brampton | Automatic, Manual & CVT',
    description:
      'Transmission repair in Brampton for automatic, manual, CVT and dual clutch. Sultan Motors diagnoses first, so you never pay for a rebuild you did not need.',
    ogTitle: 'Transmission Repair Brampton | Sultan Motors',
    ogDescription:
      'Transmission diagnostics, fluid service and repair in Brampton. Honest quotes and skilled technicians.',
    serviceType: 'Transmission Repair',
    serviceDescription:
      'Transmission diagnostics, fluid and filter service, solenoid and valve body repair, and full rebuilds in Brampton, Ontario.',
    crumb: 'Transmission Repair',
  },
  'suspension-repair-brampton': {
    title: 'Suspension Repair Brampton | Shocks, Struts & Steering',
    description:
      'Suspension repair in Brampton at Sultan Motors. Shocks, struts, control arms, ball joints and steering work, finished with a wheel alignment.',
    ogTitle: 'Suspension Repair Brampton | Sultan Motors',
    ogDescription:
      'Suspension repair in Brampton. Shocks, struts, control arms and steering repair with alignment.',
    serviceType: 'Suspension Repair',
    serviceDescription:
      'Shock and strut replacement, control arms, ball joints, tie rods and steering repair in Brampton, Ontario.',
    crumb: 'Suspension Repair',
  },
  'auto-electrical-repair-brampton': {
    title: 'Auto Electrical Repair Brampton | Battery & Wiring Fixes',
    description:
      'Auto electrical repair in Brampton. Battery, alternator, starter, sensor and wiring faults traced with meters and factory diagrams, not guesswork.',
    ogTitle: 'Auto Electrical Repair Brampton | Sultan Motors',
    ogDescription:
      'Auto electrical repair in Brampton. Battery, alternator, starter, sensor and wiring diagnostics done right.',
    serviceType: 'Auto Electrical Repair',
    serviceDescription:
      'Battery, alternator, starter, sensor, wiring and parasitic drain diagnostics and repair in Brampton, Ontario.',
    crumb: 'Auto Electrical Repair',
  },
  'collision-repair-brampton': {
    title: 'Collision Repair Brampton | Insurance Claims Welcome',
    description:
      'Collision repair in Brampton at Sultan Motors. Frame straightening, structural work, panel replacement and colour matched paint, with insurance handled.',
    ogTitle: 'Collision Repair Brampton | Sultan Motors',
    ogDescription:
      'Collision repair in Brampton. Structural, frame, panel and paint refinishing with insurance claim support.',
    serviceType: 'Collision Repair',
    serviceDescription:
      'Accident repair, unibody and frame straightening, panel replacement and colour matched refinishing in Brampton, Ontario.',
    crumb: 'Collision Repair',
  },
  'auto-body-repair-brampton': {
    title: 'Auto Body Repair Brampton | Dents & Panels | Sultan Motors',
    description:
      'Auto body repair in Brampton. Dent removal, panel work, rust repair, bumper refinishing and paint correction that blends into your original paint.',
    ogTitle: 'Auto Body Repair Brampton | Sultan Motors',
    ogDescription:
      'Body shop in Brampton. Dents, panels, rust repair, paint correction and full body restoration.',
    serviceType: 'Auto Body Repair',
    serviceDescription:
      'Dent repair, panel replacement, rust repair, bumper refinishing and paint correction in Brampton, Ontario.',
    crumb: 'Auto Body Repair',
  },
  'car-painting-brampton': {
    title: 'Car Painting Brampton | Auto Paint Shop & Colour Match',
    description:
      'Car painting in Brampton at Sultan Motors. Colour matched refinishing, scratch repair and full repaints sprayed in a filtered downdraft booth.',
    ogTitle: 'Car Painting Brampton | Sultan Motors',
    ogDescription:
      'Auto paint shop in Brampton. Colour matched refinishing, scratch repair and full repaints.',
    serviceType: 'Car Painting',
    serviceDescription:
      'Colour matched car painting, scratch and chip repair, clear coat restoration and full repaints in Brampton, Ontario.',
    crumb: 'Car Painting',
  },
  'safety-standards-certificate-brampton': {
    title: 'Safety Standards Certificate Brampton | Ontario Inspection',
    description:
      'Need an Ontario Safety Standards Certificate in Brampton? Sultan Motors inspects for ownership transfers, out of province registration and unfit to fit.',
    ogTitle: 'Safety Standards Certificate Brampton | Sultan Motors',
    ogDescription:
      'Ontario safety inspections in Brampton for used vehicle transfers, out of province registration and unfit to fit status changes.',
    serviceType: 'Safety Standards Certificate Inspection',
    serviceDescription:
      'Ontario Safety Standards Certificate inspections and safety related repairs for vehicle transfers and registration in Brampton, Ontario.',
    crumb: 'Safety Standards Certificate',
  },
}

/* -------------------------------------------------------------------------- */
/* Page metadata                                                               */
/* -------------------------------------------------------------------------- */

const homeSeo: SeoProps = {
  title: 'Auto Repair & Collision Shop Brampton | Sultan Motors',
  description:
    'Sultan Motors is a full service auto repair and collision shop in Brampton, ON. Diagnostics, engine, brake, bodywork and paint. Call (905) 799-1331.',
  path: '/',
  ogTitle: 'Sultan Motors | Brampton Auto Repair & Collision',
  ogDescription:
    'Trusted auto repair, maintenance and collision specialists in Brampton, Ontario. Precision craftsmanship on every vehicle.',
  jsonLd: graph([
    businessSchema,
    websiteSchema,
    webPageSchema(
      '/',
      'Auto Repair & Collision Shop in Brampton',
      'Full service auto repair and collision shop in Brampton, Ontario.',
      false,
      'home.visit',
    ),
  ]),
}

const aboutSeo: SeoProps = {
  title: 'About Sultan Motors | Certified Mechanics in Brampton',
  description:
    'Sultan Motors has served Brampton drivers since 2004. Meet the licensed 310S technicians, shop credentials and standards behind every repair we deliver.',
  path: '/about-us',
  ogTitle: 'About Sultan Motors | Certified Technicians Brampton',
  ogDescription:
    'Two decades of trusted auto repair in Brampton. Meet the certified technicians, values and workshop behind Sultan Motors.',
  jsonLd: graph([
    businessSchema,
    websiteSchema,
    webPageSchema(
      '/about-us',
      'About Sultan Motors',
      'The people, credentials and standards behind Sultan Motors in Brampton.',
      true,
      'about.hero',
    ),
    breadcrumbSchema('/about-us', breadcrumbTrails['about-us']),
    {
      '@type': 'AboutPage',
      '@id': `${absoluteUrl('/about-us')}#aboutpage`,
      mainEntity: { '@id': schemaId.business },
    },
  ]),
}

const contactSeo: SeoProps = {
  title: 'Book an Appointment | Sultan Motors Auto Repair Brampton',
  description:
    'Book your Brampton auto repair appointment online at Sultan Motors. Pick a service, choose a time slot and confirm in minutes. Call (905) 799-1331.',
  path: '/contact',
  ogTitle: 'Book an Appointment | Sultan Motors Brampton',
  ogDescription:
    'Online scheduling for auto repair, diagnostics, brakes, tires and more at Sultan Motors in Brampton, Ontario.',
  jsonLd: graph([
    businessSchema,
    websiteSchema,
    webPageSchema(
      '/contact',
      'Book an Appointment',
      'Schedule an auto repair appointment at Sultan Motors in Brampton.',
      true,
    ),
    breadcrumbSchema('/contact', breadcrumbTrails['contact']),
    {
      '@type': 'ContactPage',
      '@id': `${absoluteUrl('/contact')}#contactpage`,
      mainEntity: { '@id': schemaId.business },
    },
  ]),
}

export const notFoundSeo: SeoProps = {
  title: 'Page Not Found | Sultan Motors Brampton',
  description:
    'That page is no longer here. Browse Sultan Motors auto repair services in Brampton or call (905) 799-1331 and we will point you the right way.',
  path: '/404',
  noindex: true,
  jsonLd: graph([businessSchema, websiteSchema]),
}

/* -------------------------------------------------------------------------- */
/* Assembled map                                                               */
/* -------------------------------------------------------------------------- */

function buildServiceSeo(): Record<string, SeoProps> {
  const entries: Record<string, SeoProps> = {}

  for (const config of serviceConfigs) {
    const meta = serviceMeta[config.slug]
    if (!meta) continue

    const path = `/${config.slug}`
    const heroSlot = `svc.${config.slug}.hero`
    const trail: Crumb[] = [
      { label: 'Home', to: '/' },
      { label: meta.crumb, to: path },
    ]
    breadcrumbTrails[config.slug] = trail

    const webPage = webPageSchema(
      path,
      meta.serviceType,
      meta.description,
      true,
      heroSlot,
    )

    entries[config.slug] = {
      title: meta.title,
      description: meta.description,
      path,
      ogTitle: meta.ogTitle,
      ogDescription: meta.ogDescription,
      // Each service page shares its own branded 1200x630 card built from that
      // service's hero photo (scripts/optimize_images.py), so a link to "brake
      // repair" previews brake work instead of a generic shot of the building.
      image: `/og/${config.slug}.jpg`,
      imageAlt: `${meta.serviceType} at Sultan Motors in Brampton, Ontario`,
      jsonLd: graph([
        businessSchema,
        websiteSchema,
        {
          ...webPage,
          // Wire the Service and FAQ into the page node instead of leaving them
          // as unreferenced siblings in the graph.
          mainEntity: { '@id': `${absoluteUrl(path)}#service` },
          significantLink: absoluteUrl('/contact'),
        },
        breadcrumbSchema(path, trail),
        serviceSchema(meta.serviceType, meta.serviceDescription, path, heroSlot),
        faqSchema(path, config.faqs),
      ]),
    }
  }

  return entries
}

export const pageSeo: Record<string, SeoProps> = {
  home: homeSeo,
  'about-us': aboutSeo,
  contact: contactSeo,
  ...buildServiceSeo(),
}

/** Every indexable route, in sitemap priority order. Consumed by the prerenderer. */
export const indexableRoutes: { path: string; changefreq: string; priority: number }[] = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  ...serviceConfigs
    .filter((config) => serviceMeta[config.slug])
    .map((config) => ({
      path: `/${config.slug}`,
      changefreq: 'monthly',
      priority: config.slug === 'auto-repair-brampton' ? 0.9 : 0.8,
    })),
  { path: '/about-us', changefreq: 'yearly', priority: 0.6 },
  { path: '/contact', changefreq: 'monthly', priority: 0.7 },
]

export { SITE_NAME }
