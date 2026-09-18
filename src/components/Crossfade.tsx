import { useEffect, useState } from 'react'
import SitePhoto from './SitePhoto'

interface CrossfadeProps {
  /** The photo slot that should be showing. */
  slot: string
  sizes: string
  className?: string
}

/**
 * Shows one photograph and dissolves to the next when `slot` changes.
 *
 * It keeps at most two layers mounted: the outgoing image and the incoming
 * one. Stacking every candidate image and toggling opacity would put all of
 * them in the viewport at once, which defeats lazy loading and, for a dozen
 * 1100px heroes, costs a couple of megabytes before anyone hovers anything.
 * This way the first image loads, and each hover loads exactly one more.
 */
export default function Crossfade({ slot, sizes, className = '' }: CrossfadeProps) {
  // The previous slot is adjusted during render when the prop changes, which
  // is React's sanctioned pattern for state that derives from a prop.
  const [current, setCurrent] = useState(slot)
  const [outgoing, setOutgoing] = useState<string | null>(null)
  if (slot !== current) {
    setOutgoing(current)
    setCurrent(slot)
  }

  // Once the incoming image has had time to fade in, drop the outgoing one.
  useEffect(() => {
    if (!outgoing) return
    const t = window.setTimeout(() => setOutgoing(null), 750)
    return () => window.clearTimeout(t)
  }, [outgoing])

  const layers = outgoing ? [outgoing, current] : [current]

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
      {layers.map((layer) => (
        <SitePhoto
          key={layer}
          slot={layer}
          sizes={sizes}
          alt=""
          loading={layer === current && !outgoing ? 'eager' : 'lazy'}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
            layer === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}
