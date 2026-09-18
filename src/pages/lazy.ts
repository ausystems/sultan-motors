import { lazy, type ComponentType } from 'react'
import type { PageModules } from '../App'
import { serviceConfigs } from '../data/services'

/*
 * Client-side route modules, loaded on demand.
 *
 * Every page used to ship in one bundle, so the homepage carried the booking
 * form's validation library and Formspree client, and the contact page carried
 * the homepage. Each route is now its own chunk. The server never uses these:
 * it renders from static imports (see entry-server.tsx), and because the same
 * <Suspense> boundary wraps the routes on both sides, hydration keeps the
 * server's HTML on screen until the route's chunk has arrived.
 */

/** A lazy component that also exposes its loader, so a link can warm it early. */
function withPreload<P extends object>(load: () => Promise<{ default: ComponentType<P> }>) {
  return Object.assign(lazy(load), { preload: load })
}

const Home = withPreload(() => import('./HomePage'))
const About = withPreload(() => import('./AboutPage'))
const Contact = withPreload(() => import('./ContactPage'))
const Service = withPreload(() => import('./ServicePage'))
const NotFound = withPreload(() => import('./NotFoundPage'))

export const lazyPages: PageModules = { Home, About, Contact, Service, NotFound }

const serviceSlugs = new Set(serviceConfigs.map((c) => `/${c.slug}`))

/**
 * Starts fetching the chunk for a path. Links call this on hover, focus and
 * touch, so by the time the click lands the module is usually already here
 * and the transition has nothing to wait for.
 */
export function preloadForPath(path: string) {
  const clean = path.split('#')[0].split('?')[0]
  const target =
    clean === '/'
      ? Home
      : clean === '/about-us'
        ? About
        : clean === '/contact'
          ? Contact
          : serviceSlugs.has(clean)
            ? Service
            : NotFound
  void target.preload()
}
