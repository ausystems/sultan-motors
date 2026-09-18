import { useEffect, useState } from 'react'

/**
 * Tracks a media query on the client. It reports `false` during server
 * rendering and the first client render, so hydration always matches, then
 * updates once mounted. Use it to keep desktop-only media out of the DOM on
 * phones: a hidden element still downloads its image, a missing one does not.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])
  return matches
}
