import { Suspense, useEffect, useRef, type ComponentType } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { serviceConfigs, type ServiceConfig } from './data/services'
import { enterPage } from './motion/transition'

export interface PageModules {
  Home: ComponentType
  About: ComponentType
  Contact: ComponentType
  Service: ComponentType<{ config: ServiceConfig }>
  NotFound: ComponentType
}

/**
 * Resets scroll on navigation and settles the incoming page. The very first
 * render is skipped: the hero's own entrance handles that, and the server
 * rendered markup must not be touched before hydration completes.
 */
function RouteChange() {
  const { pathname } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    window.scrollTo(0, 0)
    if (first.current) {
      first.current = false
      return
    }
    enterPage()
  }, [pathname])
  return null
}

/**
 * The route table. `pages` is injected so the server can render from static
 * imports while the client loads each route on demand; the tree is otherwise
 * identical, which is what keeps hydration exact.
 */
export default function App({ pages }: { pages: PageModules }) {
  const { Home, About, Contact, Service, NotFound } = pages
  return (
    <>
      <RouteChange />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {serviceConfigs.map((config) => (
            <Route
              key={config.slug}
              path={`/${config.slug}`}
              element={<Service config={config} />}
            />
          ))}
          {/*
            Dent repair was retired; the auto body repair page carries that
            content. The real 301 comes from the generated dist/_redirects (see
            redirectsFile in entry-server.tsx) and from vercel.json. This route
            only covers in-app navigation to the old path.
          */}
          <Route
            path="/dent-repair-brampton"
            element={<Navigate to="/auto-body-repair-brampton" replace />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
