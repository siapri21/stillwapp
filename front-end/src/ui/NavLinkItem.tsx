import { NavLink } from 'react-router-dom'
import { navTarget, type NavItemDef } from '../config/nav.ts'

type NavLinkItemProps = {
  item: NavItemDef
  isAuthenticated: boolean
  className: string | ((props: { isActive: boolean }) => string)
  showLock?: boolean
}

export function NavLinkItem({ item, isAuthenticated, className, showLock }: NavLinkItemProps) {
  const to = navTarget(item, isAuthenticated)
  const needsAuth = Boolean(item.requiresAuth && !isAuthenticated)

  return (
    <NavLink to={to} end={item.end} className={className}>
      {item.label}
      {showLock && needsAuth ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="ml-0.5 inline opacity-60">
          <path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ) : null}
    </NavLink>
  )
}
