import type { ComponentProps, MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { leavePage } from '../motion/transition'

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
    void leavePage().then(() => navigate(to))
  }

  return (
    <Link
      to={to}
      className={active ? `${className} ${activeClassName}` : className}
      data-status={active ? 'active' : undefined}
      aria-current={active ? 'page' : undefined}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Link>
  )
}
