/*
 * The homepage hero's image sources, shared by the page (for the <picture>)
 * and by the server entry (for the preloads it writes into <head>).
 *
 * The preloads are written by the server rather than rendered as <link>
 * elements in JSX for a hydration reason: React does not hoist a <link>
 * without an href, so a JSX link stays inline in the section on the server,
 * and moving it to <head> afterwards leaves the client expecting an element
 * the section no longer contains. React then throws a hydration mismatch and
 * re-renders the page from scratch. Keeping the links out of the React tree
 * entirely means the server HTML and the client tree agree.
 */
import portrait900 from '../assets/sultan-motors-brampton-auto-repair-shop-portrait-900.webp'
import portrait1440 from '../assets/sultan-motors-brampton-auto-repair-shop-portrait-1440.webp'
import portrait1620 from '../assets/sultan-motors-brampton-auto-repair-shop-portrait-1620.webp'
import landscape960 from '../assets/sultan-motors-brampton-auto-repair-shop-960.webp'
import landscape1600 from '../assets/sultan-motors-brampton-auto-repair-shop-1600.webp'
import landscape2400 from '../assets/sultan-motors-brampton-auto-repair-shop-2400.webp'
import landscape3200 from '../assets/sultan-motors-brampton-auto-repair-shop-3200.webp'

export const heroImages = {
  portrait: {
    srcSet: `${portrait900} 900w, ${portrait1440} 1440w, ${portrait1620} 1620w`,
    /* The hero is a tall box on a phone; height, not width, decides the frame. */
    sizes: 'max(100vw, 75vh)',
    media: '(max-width: 767px)',
  },
  landscape: {
    src: landscape1600,
    srcSet: `${landscape960} 960w, ${landscape1600} 1600w, ${landscape2400} 2400w, ${landscape3200} 3200w`,
    /* object-cover on a viewport squarer than 16:9 is bound by height. */
    sizes: 'max(100vw, 177.8vh)',
    media: '(min-width: 768px)',
    width: 1600,
    height: 900,
  },
} as const

/** The two <link rel="preload"> tags for the hero, one per art-directed source. */
export function heroPreloadHtml(): string {
  const tag = (s: { srcSet: string; sizes: string; media: string }) =>
    `<link rel="preload" as="image" media="${s.media}" imagesrcset="${s.srcSet}" imagesizes="${s.sizes}" fetchpriority="high" />`
  return [tag(heroImages.portrait), tag(heroImages.landscape)].join('\n    ')
}
