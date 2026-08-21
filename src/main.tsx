import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

const container = document.getElementById('root')!

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Production pages ship prerendered markup (see scripts/prerender.mjs), so
// hydrate over it instead of throwing it away and painting again.
//
// The test is firstElementChild, not hasChildNodes: the dev server serves the
// template's literal `<div id="root"><!--app-html--></div>`, and a comment
// counts as a child node. Checking for any child would make dev try to hydrate
// against markup that is not there.
if (container.firstElementChild) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
