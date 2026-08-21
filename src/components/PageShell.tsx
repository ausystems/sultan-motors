import type { ReactNode } from 'react'

const MAIN_ID = 'main-content'

/**
 * Skip link, rendered as the first focusable element on the page.
 *
 * The fixed navbar puts a logo, five nav items, and a CTA ahead of the heading,
 * so without this a keyboard or screen-reader user tabs through all of it on
 * every page before reaching the content (WCAG 2.4.1).
 *
 * It is visually hidden until focused, then pinned to the top-left.
 */
export function SkipToContent() {
  return (
    <a
      href={`#${MAIN_ID}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#e6ff3d] focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-black focus:outline-none focus:ring-2 focus:ring-black"
    >
      Skip to main content
    </a>
  )
}

/**
 * The page's main landmark. Every route wraps its content in this so assistive
 * technology and content-extraction tooling can identify the primary content
 * region — previously each page was `div` and `section` all the way down, with
 * no landmark at all.
 */
export function Main({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <main id={MAIN_ID} tabIndex={-1} className={className}>
      {children}
    </main>
  )
}
