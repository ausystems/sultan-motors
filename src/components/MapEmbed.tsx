import { useState } from 'react'
import { business, mapsEmbedUrl, mapsSearchUrl } from '../data/site'

interface MapEmbedProps {
  tone?: 'light' | 'dark'
}

/**
 * A facade for the Google Maps embed.
 *
 * The embed pulls well over a megabyte of script and tiles the moment it
 * scrolls into view, on every page, for a map most visitors never touch. This
 * renders the address as text, with two actions: load the map in place, or
 * open the location in Google Maps, which on a phone hands off to the native
 * app for directions. Nothing from Google loads until someone asks for it.
 */
export default function MapEmbed({ tone = 'light' }: MapEmbedProps) {
  const [shown, setShown] = useState(false)
  const dark = tone === 'dark'

  if (shown) {
    return (
      <div>
        <iframe
          title="Sultan Motors location map"
          src={mapsEmbedUrl}
          loading="lazy"
          className={`h-[320px] w-full sm:h-[420px] md:h-[520px] ${
            dark ? 'grayscale invert-[0.92] hue-rotate-180' : 'grayscale'
          }`}
          style={{ border: 0 }}
        />
        <a
          href={mapsSearchUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={`group mt-3 inline-flex min-h-11 items-center ${dark ? 'text-paper/80' : 'text-ink'}`}
        >
          <span className="link-ul">Open in Google Maps</span>
        </a>
      </div>
    )
  }

  return (
    <div
      className={`flex h-[320px] w-full flex-col justify-between p-6 sm:h-[420px] sm:p-8 md:h-[520px] md:p-10 ${
        dark ? 'bg-ink-3 text-paper' : 'bg-paper-3 text-ink'
      }`}
    >
      <address className="not-italic">
        <p className="t-index mb-4 opacity-50">Find us</p>
        <p className="t-h3">{business.streetAddress}</p>
        <p className="t-h3">
          {business.addressLocality}, {business.addressRegion} {business.postalCode}
        </p>
      </address>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setShown(true)}
          className={`btn ${dark ? 'btn-accent' : 'btn-ink'}`}
        >
          Show map
        </button>
        <a
          href={mapsSearchUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={`btn ${dark ? 'btn-ghost-dark' : 'btn-ghost'}`}
        >
          Open in Google Maps
          <span className="arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>
    </div>
  )
}
