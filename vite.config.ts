import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Resolves the origin every canonical, Open Graph URL, JSON-LD @id, and sitemap
 * entry is built from.
 *
 * Order matters:
 *  1. VITE_SITE_URL — an explicit setting always wins.
 *  2. The Vercel project's production domain, so a deploy with nothing
 *     configured still self-references instead of pointing every page at a
 *     domain that may not be serving this site yet.
 *  3. The checked-in default, for local builds.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.VITE_SITE_URL
  if (explicit) return explicit.replace(/\/+$/, '')

  // Set by Vercel on every build; the stable production domain, not the
  // per-deployment URL.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`

  return 'https://www.sultanmotors.ca'
}

/**
 * Preview and branch deployments must not be indexed. Without this, Vercel
 * preview URLs get crawled and compete with production for the same content.
 */
function resolveNoindex(): boolean {
  if (process.env.VITE_FORCE_NOINDEX === 'true') return true
  const env = process.env.VERCEL_ENV
  return Boolean(env) && env !== 'production'
}

export default defineConfig(() => {
  const siteUrl = resolveSiteUrl()
  const noindex = resolveNoindex()

  // Surfaced in the build log so a wrong domain is visible before it ships.
  console.log(`\n  site origin: ${siteUrl}${noindex ? '  (noindex — non-production deploy)' : ''}\n`)

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl),
      'import.meta.env.VITE_NOINDEX': JSON.stringify(noindex),
    },
    build: {
      // Photos are already optimised WebP; inlining them as base64 would bloat
      // the JS bundle and make them uncacheable.
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          /**
           * Splits the rarely-changing framework code out of the app chunk so a
           * copy edit does not invalidate the whole bundle in visitors' caches.
           */
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
              return 'react'
            }
            if (id.includes('react-router')) return 'router'
            if (id.includes('zod')) return 'zod'
          },
        },
      },
    },
  }
})
