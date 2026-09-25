import { mapsEmbedUrl } from '../data/site'

/**
 * The Google Maps embed, present from the first render and in full colour.
 *
 * `loading="eager"` is deliberate: the default for an iframe is lazy, which
 * would hold the map back until it neared the viewport, and the map sits at
 * the foot of every page. The shop's location should be there the moment the
 * page is, so it loads with everything else.
 *
 * No CSS filter is applied. A map is a wayfinding tool before it is a
 * graphic element, and the colour is what makes it legible at a glance:
 * highways, parks and water all read by hue.
 */
export default function MapEmbed() {
  return (
    <iframe
      title="Map showing Sultan Motors at 5 Melanie Dr Unit 2, Brampton, Ontario"
      src={mapsEmbedUrl}
      loading="eager"
      referrerPolicy="no-referrer-when-downgrade"
      className="h-[320px] w-full sm:h-[420px] md:h-[520px]"
      style={{ border: 0 }}
    />
  )
}
