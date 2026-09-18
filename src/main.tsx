import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { lazyPages } from './pages/lazy'

const container = document.getElementById('root')!
const tree = (
  <StrictMode>
    <BrowserRouter>
      <App pages={lazyPages} />
    </BrowserRouter>
  </StrictMode>
)

/*
 * The production build ships prerendered HTML in #root, which React hydrates
 * in place. The dev server serves the bare template with an empty #root, and
 * hydrating nothing would only produce mismatch warnings, so it renders fresh.
 */
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
