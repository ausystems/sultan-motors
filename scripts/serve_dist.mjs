/**
 * Serves dist/ the way a static host does, so local checks match production.
 *
 * `vite preview` is not a substitute here: it applies an SPA fallback and
 * returns index.html for every unmatched path, so every route appears to work
 * while actually serving the homepage's HTML and letting the client re-render
 * over it. That hides both prerendering bugs and soft 404s.
 *
 * This server instead does what Netlify, Cloudflare Pages, and Vercel do:
 *   /              -> dist/index.html
 *   /some-route    -> dist/some-route/index.html
 *   /assets/x.js   -> the file
 *   anything else  -> dist/404.html with a real 404 status
 * It also applies the redirects from dist/_redirects.
 *
 * Run: node scripts/serve_dist.mjs [port]
 */

import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const PORT = Number(process.env.PORT ?? process.argv[2] ?? 4180)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
}

/** Path-only redirect rules from dist/_redirects (host rules need a real host). */
const redirects = new Map()
try {
  const text = await readFile(join(DIST, '_redirects'), 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [from, to, code] = trimmed.split(/\s+/)
    if (from?.startsWith('/') && to) {
      redirects.set(from, { to, code: Number((code ?? '301').replace('!', '')) })
    }
  }
} catch {
  // No _redirects file; serve without redirect handling.
}

async function readIfFile(path) {
  try {
    const info = await stat(path)
    if (!info.isFile()) return null
    return await readFile(path)
  } catch {
    return null
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  let pathname = decodeURIComponent(url.pathname)

  const redirect = redirects.get(pathname.replace(/\/$/, '') || '/')
  if (redirect) {
    res.writeHead(redirect.code, { Location: redirect.to })
    res.end()
    console.log(`${redirect.code} ${pathname} -> ${redirect.to}`)
    return
  }

  // Contain the path inside dist/ before touching the filesystem.
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
  const candidates = extname(safe)
    ? [join(DIST, safe)]
    : [join(DIST, safe, 'index.html')]

  for (const candidate of candidates) {
    if (!resolve(candidate).startsWith(DIST)) continue
    const body = await readIfFile(candidate)
    if (body) {
      res.writeHead(200, {
        'Content-Type': TYPES[extname(candidate)] ?? 'application/octet-stream',
        'Cache-Control': extname(candidate) === '.html' ? 'no-cache' : 'public, max-age=3600',
      })
      res.end(body)
      console.log(`200 ${pathname}`)
      return
    }
  }

  const notFound = await readIfFile(join(DIST, '404.html'))
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(notFound ?? '<h1>404</h1>')
  console.log(`404 ${pathname}`)
})

server.listen(PORT, () => {
  console.log(`\n  Serving dist/ with production semantics at http://localhost:${PORT}\n`)
})
