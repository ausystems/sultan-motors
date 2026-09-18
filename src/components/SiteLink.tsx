import { startTransition, type ComponentProps, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { leavePage } from '../motion/transition'
import { preloadForPath } from '../pages/lazy'

interface SiteLinkProps extends ComponentProps<typeof Link> {
  to: string
  /** Class appended when the link's route is active. */
  activeClassName?: string
  /** Only match the exact path (used by links to "/"). */
  exact?: boolean
}

/**
 * Internal link. Beyond marking the active route, it owns the page-to-page
 * transition: a plain left click on a different route runs the short leave
 * animation before navigating. Modified clicks (new tab, etc.) and the
 * browser's own back/forward are left entirely to the browser.
 */
export default function SiteLink({
  to,
  activeClassName = 'active',
  exact,
  className = '',
  children,
  onClick,
  ...rest
}: SiteLinkProps) {
  const { onMouseEnter: _me, onFocus: _f, onTouchStart: _ts, ...restWithoutHandlers } = rest
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const active =
    to === '/' || exact ? pathname === to : pathname === to || pathname.startsWith(to + '/')

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0
    if (modified || rest.target === '_blank') return
    const target = to.split('#')[0]
    if (target === pathname) return
    e.preventDefault()
    preloadForPath(to)
    // A transition keeps the current page on screen until the next route's
    // chunk has loaded, instead of flashing the Suspense fallback.
    void leavePage().then(() => startTransition(() => navigate(to)))
  }

  const warm = () => preloadForPath(to)

  return (
    <Link
      to={to}
      className={active ? `${className} ${activeClassName}` : className}
      data-status={active ? 'active' : undefined}
      aria-current={active ? 'page' : undefined}
      onClick={handleClick}
      onMouseEnter={(e) => {
        rest.onMouseEnter?.(e)
        warm()
      }}
      onFocus={(e) => {
        rest.onFocus?.(e)
        warm()
      }}
      onTouchStart={(e) => {
        rest.onTouchStart?.(e)
        warm()
      }}
      {...restWithoutHandlers}
    >
      {children}
    </Link>
  )
}
