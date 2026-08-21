import type { SeoProps } from '../components/Seo'
import {
  SITE_NAME,
  SITE_LOCALE,
  SITE_NOINDEX,
  absoluteUrl,
  ogImageUrl,
  OG_IMAGE,
} from './site'

export type MetaTag = { attr: 'name' | 'property'; key: string; content: string }
export type LinkTag = { rel: string; href: string }

export interface HeadModel {
  title: string
  metas: MetaTag[]
  links: LinkTag[]
  jsonLd: object[]
}

/**
 * The complete document head for a route, computed in one place.
 *
 * `Seo` applies this to the live DOM during client-side navigation, and the
 * prerenderer serialises the same model into each route's static HTML. Sharing
 * the builder is what keeps the crawled head and the hydrated head identical —
 * when they diverge, search engines see one thing and users another.
 */
export function buildHead(seo: SeoProps): HeadModel {
  const url = absoluteUrl(seo.path)
  const image = seo.image ? absoluteUrl(seo.image) : ogImageUrl
  const imageAlt = seo.imageAlt ?? OG_IMAGE.alt
  const title = seo.title
  const socialTitle = seo.ogTitle ?? seo.title
  const socialDescription = seo.ogDescription ?? seo.description

  return {
    title,
    links: [{ rel: 'canonical', href: url }],
    metas: [
      { attr: 'name', key: 'description', content: seo.description },
      {
        attr: 'name',
        key: 'robots',
        // SITE_NOINDEX covers preview and branch deployments, where indexing
        // would put a duplicate of the whole site in front of production.
        content:
          seo.noindex || SITE_NOINDEX
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },

      { attr: 'property', key: 'og:site_name', content: SITE_NAME },
      { attr: 'property', key: 'og:locale', content: SITE_LOCALE },
      { attr: 'property', key: 'og:type', content: seo.ogType ?? 'website' },
      { attr: 'property', key: 'og:url', content: url },
      { attr: 'property', key: 'og:title', content: socialTitle },
      { attr: 'property', key: 'og:description', content: socialDescription },
      { attr: 'property', key: 'og:image', content: image },
      { attr: 'property', key: 'og:image:width', content: String(OG_IMAGE.width) },
      { attr: 'property', key: 'og:image:height', content: String(OG_IMAGE.height) },
      { attr: 'property', key: 'og:image:alt', content: imageAlt },

      { attr: 'name', key: 'twitter:card', content: 'summary_large_image' },
      { attr: 'name', key: 'twitter:title', content: socialTitle },
      { attr: 'name', key: 'twitter:description', content: socialDescription },
      { attr: 'name', key: 'twitter:image', content: image },
      { attr: 'name', key: 'twitter:image:alt', content: imageAlt },
    ],
    jsonLd: seo.jsonLd ?? [],
  }
}

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
}

function escapeAttr(value: string): string {
  return value.replace(/[&<>"]/g, (c) => ESCAPES[c])
}

/** Serialises a head model to HTML for the prerendered pages. */
export function renderHeadHtml(head: HeadModel, indent = '    '): string {
  const lines: string[] = [`<title>${escapeAttr(head.title)}</title>`]

  for (const meta of head.metas) {
    lines.push(
      `<meta ${meta.attr}="${escapeAttr(meta.key)}" content="${escapeAttr(meta.content)}" data-seo-managed="meta:${meta.attr}:${escapeAttr(meta.key)}" />`,
    )
  }
  for (const link of head.links) {
    lines.push(
      `<link rel="${escapeAttr(link.rel)}" href="${escapeAttr(link.href)}" data-seo-managed="link:${escapeAttr(link.rel)}" />`,
    )
  }
  for (const entry of head.jsonLd) {
    // `<` is escaped so a stray "</script>" inside the data cannot close the tag.
    const json = JSON.stringify(entry).replace(/</g, '\\u003c')
    lines.push(
      `<script type="application/ld+json" data-seo-jsonld>${json}</script>`,
    )
  }

  return lines.join(`\n${indent}`)
}
