import { Fragment } from 'react'
import SiteLink from './SiteLink'
import type { Crumb } from '../data/seo'

interface BreadcrumbsProps {
  trail: Crumb[]
  /** Light text for dark hero sections, dark text for white sections. */
  theme?: 'dark' | 'light'
  className?: string
}

/**
 * Visible breadcrumb trail. The matching BreadcrumbList JSON-LD is emitted by
 * the page's Seo entry, so the markup and the structured data always describe
 * the same path.
 */
export default function Breadcrumbs({
  trail,
  theme = 'dark',
  className = '',
}: BreadcrumbsProps) {
  if (trail.length < 2) return null

  const muted = theme === 'dark' ? 'text-white/55' : 'text-neutral-500'
  const link =
    theme === 'dark'
      ? 'text-white/70 underline-offset-4 transition hover:text-[#e6ff3d] hover:underline'
      : 'text-neutral-600 underline-offset-4 transition hover:text-[#111] hover:underline'
  const current = theme === 'dark' ? 'text-white' : 'text-[#111]'

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold tracking-[0.12em] sm:text-xs">
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1
          return (
            <Fragment key={crumb.to}>
              <li>
                {isLast ? (
                  <span className={current} aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <SiteLink to={crumb.to} className={link} activeClassName="">
                    {crumb.label}
                  </SiteLink>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true" className={muted}>
                  /
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
