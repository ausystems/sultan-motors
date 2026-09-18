import SiteLink from './SiteLink'
import type { Crumb } from '../data/seo'

interface BreadcrumbsProps {
  trail: Crumb[]
  theme?: 'dark' | 'light'
  className?: string
}

/**
 * Visible breadcrumb trail. The matching BreadcrumbList JSON-LD is emitted by
 * the page's Seo props from the same `trail`, so the two never disagree.
 */
export default function Breadcrumbs({ trail, theme = 'dark', className = '' }: BreadcrumbsProps) {
  const mute = theme === 'dark' ? 'text-paper/55' : 'text-mute'
  const strong = theme === 'dark' ? 'text-paper' : 'text-ink'
  return (
    <nav aria-label="Breadcrumb" className={`t-small ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1
          return (
            <li key={crumb.to} className="flex items-center gap-x-2.5">
              {last ? (
                <span aria-current="page" className={strong}>
                  {crumb.label}
                </span>
              ) : (
                <SiteLink to={crumb.to} exact className={`link-ul ${mute} hover:${strong}`}>
                  {crumb.label}
                </SiteLink>
              )}
              {!last && (
                <span aria-hidden="true" className={mute}>
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
