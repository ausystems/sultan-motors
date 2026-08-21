import { photo, type Photo } from '../data/photos'

interface SitePhotoProps {
  /** Slot id from src/data/photos.ts, e.g. "home.story" or "svc.brake-repair-brampton.hero". */
  slot: string
  className?: string
  /** Responsive `sizes` hint. Should match the slot's rendered CSS width. */
  sizes: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
  title?: string
  /** Overrides the curated alt only when the surrounding copy already names the subject. */
  alt?: string
}

/**
 * Renders a prepared photo with its responsive srcset and intrinsic dimensions
 * so the layout never shifts while the image loads.
 */
export default function SitePhoto({
  slot,
  className = '',
  sizes,
  loading = 'lazy',
  fetchPriority,
  title,
  alt,
}: SitePhotoProps) {
  const p = photo(slot)
  if (!p) return null
  return (
    <img
      src={p.src}
      srcSet={p.srcSet}
      sizes={sizes}
      width={p.width}
      height={p.height}
      alt={alt ?? p.alt}
      title={title}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      className={className}
    />
  )
}

/**
 * Background-image value for the decorative backdrop behind hero copy.
 *
 * These backdrops render at 30–40% opacity beneath a full-bleed gradient, so
 * the extra detail in the 2x source is not perceptible — but the bytes are.
 * Serving the retina variant here cost 304 KB on every service page for an
 * image the visitor mostly cannot see, and because CSS backgrounds are found
 * only after the stylesheet is parsed, those bytes land in the middle of the
 * page's most latency-sensitive moment.
 *
 * The smallest prepared source is therefore used at every density. Use
 * `SitePhoto` instead wherever the image is actual content.
 */
export function backgroundImageSet(p: Photo | undefined): string | undefined {
  if (!p) return undefined
  return `url("${p.sources[0]?.url ?? p.src}")`
}
