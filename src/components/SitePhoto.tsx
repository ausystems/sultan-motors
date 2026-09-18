import { photo } from '../data/photos'

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
