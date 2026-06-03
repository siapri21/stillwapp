import { NavLink } from 'react-router-dom'
import { accountNavItems, publicNavItems } from '../config/nav.ts'
import { useAuth } from '../context/AuthContext.tsx'
import { AuthActions } from './AuthActions.tsx'
import { NavLinkItem } from './NavLinkItem.tsx'
import { NotificationLink } from './NotificationLink.tsx'

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-xl px-3 py-2 font-body text-sm font-semibold transition xl:px-4',
    isActive
      ? 'bg-[var(--sw-pink)]/10 text-[var(--sw-pink)]'
      : 'text-[var(--sw-muted)] hover:bg-black/5 hover:text-[var(--sw-text-strong)]',
  ].join(' ')

export function TopNav() {
  const { isAuthenticated } = useAuth()
  const items = isAuthenticated ? [...publicNavItems, ...accountNavItems] : publicNavItems

  return (
    <header className="fixed top-0 left-0 right-0 z-50 hidden border-b border-black/10 bg-white/95 backdrop-blur lg:block">
      <div className="flex items-center gap-4 px-[10%] py-3">
        <NavLink to="/" className="shrink-0">
          <img src="/logoskillwapp.png" alt="SkillWapp" className="h-10 w-12" />
        </NavLink>

        <nav className="flex flex-1 items-center justify-center gap-1">
          {items.map((it) => (
            <NavLinkItem key={it.to} item={it} isAuthenticated={isAuthenticated} className={navClass} showLock />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <NavLink
            to="/search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5"
            aria-label="Recherche"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </NavLink>
          <NotificationLink />
          <AuthActions />
        </div>
      </div>
    </header>
  )
}
