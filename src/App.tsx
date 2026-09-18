import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ServicePage from './pages/ServicePage'
import NotFoundPage from './pages/NotFoundPage'
import { serviceConfigs } from './data/services'
import { enterPage } from './motion/transition'

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

export default function App() {
  return (
    <>
      <RouteChange />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {serviceConfigs.map((config) => (
          <Route
            key={config.slug}
            path={`/${config.slug}`}
            element={<ServicePage config={config} />}
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
