import type { ComponentProps } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface SiteLinkProps extends ComponentProps<typeof Link> {
  to: string
  /**
   * Class appended when the link's route is active. Mirrors TanStack Router,
   * which appends `active` by default or `activeProps.className` when given.
   */
  activeClassName?: string
  /** Only match the exact path (used by links to "/"). */
  exact?: boolean
}

export default function SiteLink({
  to,
  activeClassName = 'active',
  exact,
  className = '',
  children,
  ...rest
}: SiteLinkProps) {
  const { pathname } = useLocation()
  const active =
    to === '/' || exact ? pathname === to : pathname === to || pathname.startsWith(to + '/')

  return (
    <Link
      to={to}
      className={active ? `${className} ${activeClassName}` : className}
      data-status={active ? 'active' : undefined}
      aria-current={active ? 'page' : undefined}
      {...rest}
    >
      {children}
    </Link>
  )
}
