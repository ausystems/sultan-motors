# Sultan Motors

Marketing site for Sultan Motors, an auto repair and collision shop at
5 Melanie Dr Unit 2, Brampton, Ontario. Vite + React + TypeScript + Tailwind
CSS v4, prerendered to static HTML at build time.

## Before you deploy

**Set the production domain.** Every canonical tag, Open Graph URL, JSON-LD
`@id`, and sitemap entry is derived from one constant. Copy `.env.example` to
`.env` (or set the variable in your host's dashboard) and point it at the real
domain:

```bash
VITE_SITE_URL=https://www.your-real-domain.ca
```

If that value is wrong, the whole site tells search engines its content belongs
to a domain you do not control. Everything else in `src/data/site.ts` — phone,
address, hours, coordinates, social profiles — should be checked against the
Google Business Profile listing at the same time. The name, address, and phone
must match that listing character for character.

Two values in `src/data/site.ts` are placeholders that need confirming:

- `business.latitude` / `business.longitude` — approximate. Google cross-checks
  these against the Business Profile pin.
- `socialProfiles` — all empty. Filling one in both links it in the header and
  footer and adds it to the `sameAs` array in structured data. Empty entries are
  filtered out, so nothing ships as a dead link.
- `public/icon-512.png` — a generated "SM" monogram standing in for the real
  logo. It is what the `logo` property in structured data points at, so replace
  it with the shop's actual mark (square, at least 112×112) when one exists.

No `aggregateRating` or `review` markup is emitted. Review structured data must
describe reviews that genuinely exist and are visible on the page; inventing it
is a manual-action risk. Wire it to real Google reviews before adding any.

## Google Search Console

Verify the property once the domain is live, then submit the sitemap.

Prefer **DNS TXT verification** on the domain (not the URL prefix): it covers
`http`, `https`, `www`, and the apex in one property, and it survives redeploys.
If you must verify per-URL instead, either drop Google's HTML file into
`public/` — anything there is copied to the site root verbatim — or add its
meta tag to `index.html` *outside* the `<!--seo-head-->` markers, since the
prerenderer replaces everything between them on every build.

After verification: submit `https://<your-domain>/sitemap.xml`, then check
Indexing → Pages for **Soft 404** and **Duplicate, Google chose a different
canonical**. Both were failure modes of the previous build and both should now
be empty.

## Getting started

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # typecheck, bundle, prerender, sitemap, robots.txt
npm run serve     # serve dist/ with production semantics at http://localhost:4180
```

**Verify with `npm run serve`, not `npm run preview`.** `vite preview` applies an
SPA fallback: it returns `dist/index.html` for every path it does not match as a
file, so `/brake-repair-brampton` silently serves the *homepage's* HTML and lets
the client re-render over it. Every route still looks correct in the browser,
which makes it useless for checking prerendering — and it reports 200 for URLs
that should 404.

`npm run serve` (`scripts/serve_dist.mjs`) does what a static host does: resolves
`/some-route` to `dist/some-route/index.html`, applies `dist/_redirects`, and
returns `dist/404.html` with a real 404 status for anything unmatched. Use it to
confirm each route ships its own HTML and that bad URLs really 404:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:4180/nope
```

Two supporting scripts:

```bash
npm run images    # regenerate hero variants, social cards, app icons
npm run audit     # audit dist/, exits non-zero on failure
npm run verify    # build + lint + audit, the full gate
```

`npm run audit` (`scripts/audit_seo.py`) checks every built page for title and
description length, a single non-empty H1, heading-order jumps, headings whose
words ran together, canonical/`og:url` agreement, Open Graph completeness,
JSON-LD parse validity plus duplicate or dangling `@id`s, `primaryImageOfPage`
being an ImageObject rather than a bare string, image alt and intrinsic
dimensions, a `<main>` landmark and skip link, labelled form controls, resource
hints landing in `<head>`, dead links, cross-page title/description/H1
uniqueness, duplicate alt text across different photos, and that `/404` is not
a crawlable 200 route. It is not wired into `npm run build`, because the build
runs on hosts that may not have Python — run `npm run verify` locally or in CI.

## How the build works

`npm run build` runs four steps:

1. `tsc -b` — typecheck.
2. `vite build` — the client bundle, split into `react` / `router` / `zod` /
   app chunks so a copy edit does not invalidate the framework code in
   visitors' caches.
3. `vite build --ssr src/entry-server.tsx` — a Node-loadable build of the app.
4. `node scripts/prerender.mjs` — renders every route to static HTML.

Step 4 is what makes this site indexable. Before it existed, every URL served
one `index.html` with the homepage's title, no canonical, and an empty
`<div id="root">`. Now each route ships its own `<title>`, description,
canonical, Open Graph tags, JSON-LD, and fully rendered body markup in the
initial response, and React hydrates over it.

Output layout:

```
dist/
  index.html                    # /
  brake-repair-brampton/
    index.html                  # /brake-repair-brampton
  …one directory per route…
  404/index.html
  404.html                      # copy, for hosts that serve it on 404
  sitemap.xml
  robots.txt
```

### Head metadata

`src/data/head.ts` builds the document head for a route once. `Seo.tsx` applies
that model to the live DOM on client-side navigation; the prerenderer
serialises the same model into static HTML. Sharing one builder is what keeps
the crawled head and the hydrated head identical.

`Seo.tsx` adopts the prerendered tags rather than appending beside them, and
removes any tag it set on a previous route but not this one, so metadata cannot
leak between pages during navigation.

### Structured data

Every page emits a single `@graph` containing the shared `AutoRepair` business
entity (referenced by a stable `@id`, so search engines resolve one business
rather than fifteen near-duplicates), the `WebSite`, a per-page `WebPage`, and
where applicable a `BreadcrumbList`, `Service`, and `FAQPage`. FAQ entries are
generated from the same `services.ts` data that renders the visible FAQ, so the
markup and the page can never disagree.

## Routes

| Route | Page |
| --- | --- |
| `/` | Homepage |
| `/about-us` | About |
| `/contact` | Booking wizard + location |
| `/auto-repair-brampton` | Service page |
| `/car-diagnostics-brampton` | Service page |
| `/engine-repair-brampton` | Service page |
| `/brake-repair-brampton` | Service page |
| `/car-maintenance-brampton` | Service page |
| `/transmission-repair-brampton` | Service page |
| `/suspension-repair-brampton` | Service page |
| `/auto-electrical-repair-brampton` | Service page |
| `/collision-repair-brampton` | Service page |
| `/auto-body-repair-brampton` | Service page |
| `/car-painting-brampton` | Service page |
| `/safety-standards-certificate-brampton` | Service page |
| `*` | 404 (noindex) |

`/dent-repair-brampton` is retired and 301s to `/auto-body-repair-brampton`,
which carries the dent-repair content. A 301 has to land on the closest
equivalent page — pointing it somewhere topically unrelated makes Google treat
it as a soft 404 and discard the old URL's accumulated signals.

The 404 is emitted only as `dist/404.html`, never as `dist/404/index.html`. The
second form would publish `/404` as a crawlable URL answering 200, which is the
exact soft-404 pattern this build exists to remove.

All 12 service pages share one template ([ServicePage.tsx](src/pages/ServicePage.tsx))
driven by per-page content in [services.ts](src/data/services.ts).

## Hosting

`public/_headers` and a generated `dist/_redirects` cover Netlify and
Cloudflare Pages; `vercel.json` covers Vercel. Between them they set HSTS and
the other security headers, cache fingerprinted assets for a year while
revalidating HTML, canonicalise the host and scheme, and 301 the retired URL.

`_redirects` is written by the prerenderer from `VITE_SITE_URL` rather than
checked in, so the host-canonicalisation rules cannot drift from the canonical
tags. Changing the domain updates the redirects, `robots.txt`, `sitemap.xml`,
and every canonical together.

**There is deliberately no SPA fallback rewrite.** Every route is prerendered to
its own file, so unmatched paths fall through to `404.html` with a real 404
status. A catch-all rewrite to `index.html` would return 200 for every bad URL,
which Google reports as a soft 404.

On a host not covered by those files, replicate three things: serve
`dist/404.html` with a 404 status for unmatched paths, do not rewrite unmatched
paths to `index.html`, and redirect `/dent-repair-brampton`.

## Structure

```
src/
  components/
    Breadcrumbs.tsx  # visible trail; the matching JSON-LD comes from seo.ts
    SiteNavbar.tsx   # fixed pill navbar: shrink-on-scroll, services dropdown, mobile menu
    SiteFooter.tsx   # footer with giant SULTAN wordmark
    SiteLink.tsx     # Link wrapper that marks the active route
    BookCta.tsx      # yellow "Book an appointment" pill
    Seo.tsx          # applies the head model per route
    SitePhoto.tsx    # responsive <img> with intrinsic dimensions
    icons.tsx        # inline SVG icons
  pages/
    HomePage.tsx     # hero, marquee, story, services accordion, process, why, visit
    AboutPage.tsx    # story, milestones, stats, certifications, values
    ContactPage.tsx  # 5-step booking wizard (calendar, time slots, localStorage)
    ServicePage.tsx  # shared service-page template
    NotFoundPage.tsx # 404
  data/
    site.ts          # domain, NAP, hours, schema entities — the single source of truth
    head.ts          # builds the head model shared by Seo.tsx and the prerenderer
    seo.ts           # per-page titles, descriptions, breadcrumbs, JSON-LD graphs
    services.ts      # content for the 12 service pages
    photos.ts        # generated photo manifest with curated alt text
    links.ts         # shared nav/footer link lists
  entry-server.tsx   # SSR render + sitemap/robots generation
scripts/
  prerender.mjs      # static HTML per route
  serve_dist.mjs     # serves dist/ with production semantics (npm run serve)
  optimize_images.py # hero variants, OG card, app icons
  audit_seo.py       # on-page audit of dist/, gates deploys
```

## Notes

- Bookings are stored client-side under the `sultan_motors_bookings_v1`
  localStorage key. Nothing is sent to a server.
- The homepage marquee animates in CSS (`.marquee-animate` in `index.css`) and
  honours `prefers-reduced-motion`. It replaced a GSAP tween, which removed the
  library from the bundle entirely.
- The homepage hero is the LCP element on mobile. It ships as three WebP
  variants (960/1600/2400) generated by `npm run images`; the mobile variant is
  59 KB against the 524 KB single file it replaced.
- The decorative backdrop behind service-page hero copy (`backgroundImageSet`
  in `SitePhoto.tsx`) deliberately serves the small variant at every pixel
  density. It renders at 30–40% opacity under a gradient, so the retina source
  was spending 304 KB per page on detail nobody can see — and CSS backgrounds
  are discovered late, so those bytes landed at the worst possible moment.

  Known consequence: the 2000px variants of the twelve service heroes are still
  emitted into `dist/` (about 2.4 MB) even though no browser now requests them.
  That is deploy weight only, not a user-facing cost. Clearing it means dropping
  those sources from `src/data/photos.ts`, which is generated — so it belongs in
  the generator, not a hand edit.

- Each service page ships its own 1200×630 social card in `public/og/`, built
  from that service's hero photo by `npm run images`. They are JPEG rather than
  WebP on purpose: the source photography is WebP, but link-preview scrapers
  still handle WebP unevenly, and a card that fails to render on one platform
  costs more than the extra bytes.
- The other photos are left as-is on purpose. `optimize_images.py` re-encodes
  anything over 200 KB but keeps the result only when it saves meaningfully;
  the shop photography is high-texture and already near its rate-distortion
  floor, so every file currently declines the swap.
