import { useEffect } from 'react'
import { buildHead } from '../data/head'

export interface SeoProps {
  title: string
  description: string
  /**
   * Site-relative path for this route, e.g. "/brake-repair-brampton".
   * Canonical and og:url are both derived from it, so they can never drift
   * apart or point at a stale domain.
   */
  path: string
  ogTitle?: string
  ogDescription?: string
  ogType?: string
  /** Absolute or site-relative image URL. Defaults to the shared social card. */
  image?: string
  imageAlt?: string
  /** Keeps the page out of the index (used by the 404 route). */
  noindex?: boolean
  jsonLd?: object[]
}

/** Marks every tag this component owns, so stale ones can be reclaimed. */
const MANAGED = 'data-seo-managed'
const JSONLD = 'data-seo-jsonld'

/**
 * Applies the document head for a route: title, description, robots directive,
 * canonical, Open Graph, Twitter card, and structured data.
 *
 * Prerendered pages already ship these tags in their HTML. This keeps them
 * correct across client-side navigation, adopting the prerendered tags rather
 * than appending duplicates alongside them.
 */
export default function Seo(props: SeoProps) {
  const {
    title,
    description,
    path,
    ogTitle,
    ogDescription,
    ogType,
    image,
    imageAlt,
    noindex,
    jsonLd,
  } = props

  useEffect(() => {
    const head = buildHead({
      title,
      description,
      path,
      ogTitle,
      ogDescription,
      ogType,
      image,
      imageAlt,
      noindex,
      jsonLd,
    })

    document.title = head.title

    const seen = new Set<string>()

    for (const meta of head.metas) {
      const id = `meta:${meta.attr}:${meta.key}`
      seen.add(id)
      let el = document.head.querySelector<HTMLMetaElement>(
        `meta[${meta.attr}="${meta.key}"]`,
      )
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(meta.attr, meta.key)
        document.head.appendChild(el)
      }
      el.setAttribute(MANAGED, id)
      el.setAttribute('content', meta.content)
    }

    for (const link of head.links) {
      const id = `link:${link.rel}`
      seen.add(id)
      let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${link.rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', link.rel)
        document.head.appendChild(el)
      }
      el.setAttribute(MANAGED, id)
      el.setAttribute('href', link.href)
    }

    // Drop anything this component owned on a previous route but no longer
    // sets, so an optional tag from the last page cannot leak onto this one.
    document.head.querySelectorAll(`[${MANAGED}]`).forEach((el) => {
      if (!seen.has(el.getAttribute(MANAGED) ?? '')) el.remove()
    })

    document.head.querySelectorAll(`script[${JSONLD}]`).forEach((el) => el.remove())
    for (const entry of head.jsonLd) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute(JSONLD, '')
      script.textContent = JSON.stringify(entry)
      document.head.appendChild(script)
    }
  }, [
    title,
    description,
    path,
    ogTitle,
    ogDescription,
    ogType,
    image,
    imageAlt,
    noindex,
    jsonLd,
  ])

  return null
}
