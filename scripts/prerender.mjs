/**
 * Turns the client-rendered bundle into one static HTML file per route.
 *
 * Without this step every URL served the same index.html: the same homepage
 * title, the same description, no canonical, and an empty <div id="root">.
 * Crawlers that do not execute JavaScript — and every social and messaging
 * link preview — saw nothing page-specific. Search engines that do render JS
 * still had to wait a full render pass to learn what the page was about.
 *
 * After this step each route ships its own title, description, canonical,
 * Open Graph tags, JSON-LD, and fully rendered body markup in the initial
 * response, and React hydrates over it.
 *
 * Run as part of `npm run build`.
 */

import { mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const SSR_DIST = join(ROOT, '.ssr-dist')

const HEAD_OPEN = '<!--seo-head-->'
const HEAD_CLOSE = '<!--/seo-head-->'
const APP_MARKER = '<!--app-html-->'

function fail(message) {
  console.error(`\n  prerender failed: ${message}\n`)
  process.exit(1)
}

const template = await readFile(join(DIST, 'index.html'), 'utf8').catch(() =>
  fail('dist/index.html not found — run `vite build` first'),
)

if (!template.includes(HEAD_OPEN) || !template.includes(HEAD_CLOSE)) {
  fail(`index.html is missing the ${HEAD_OPEN} … ${HEAD_CLOSE} markers`)
}
if (!template.includes(APP_MARKER)) {
  fail(`index.html is missing the ${APP_MARKER} marker`)
}

const server = await import(join(SSR_DIST, 'entry-server.js')).catch((error) =>
  fail(`could not load the SSR bundle (${error.message})`),
)

const { renderRoute, allRoutes, sitemapXml, robotsTxt, redirectsFile, SITE_URL } =
  server
const lastmod = new Date().toISOString().slice(0, 10)

console.log(`\n  Prerendering for ${SITE_URL}\n`)

const routes = allRoutes()
let longest = 0
for (const path of routes) longest = Math.max(longest, path.length)

for (const path of routes) {
  let rendered
  try {
    rendered = renderRoute(path)
  } catch (error) {
    fail(`rendering ${path} threw: ${error.stack ?? error.message}`)
  }

  const headStart = template.indexOf(HEAD_OPEN)
  const headEnd = template.indexOf(HEAD_CLOSE) + HEAD_CLOSE.length
  const page = (
    template.slice(0, headStart) +
    rendered.head +
    template.slice(headEnd)
  ).replace(APP_MARKER, rendered.html)

  const outPath = join(DIST, rendered.file)
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, page, 'utf8')

  const kb = (Buffer.byteLength(page) / 1024).toFixed(0)
  console.log(`  ${path.padEnd(longest)}  ->  ${rendered.file.padEnd(46)} ${kb} KB`)
}

await writeFile(join(DIST, 'sitemap.xml'), sitemapXml(lastmod), 'utf8')
await writeFile(join(DIST, 'robots.txt'), robotsTxt(), 'utf8')
await writeFile(join(DIST, '_redirects'), redirectsFile(), 'utf8')

console.log(`\n  sitemap.xml  ${routes.length - 1} indexable URLs, lastmod ${lastmod}`)
console.log('  robots.txt   written')
console.log('  _redirects   host canonicalisation derived from the site URL')

await rm(SSR_DIST, { recursive: true, force: true })

console.log(`\n  Prerendered ${routes.length} routes.\n`)
