import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ServicePage from './pages/ServicePage'
import NotFoundPage from './pages/NotFoundPage'
import { serviceConfigs } from './data/services'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
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
        {/*
          Unknown URLs render a real 404 page rather than redirecting home.
          Redirecting every bad URL to `/` produces soft 404s, which Google
          reports as errors and which hide broken inbound links.
        */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
