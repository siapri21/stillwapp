import type { JSX } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { accountNavItems, navTarget, publicNavItems } from '../config/nav.ts'
import { useAuth } from '../context/AuthContext.tsx'
import type { NavItemDef } from '../config/nav.ts'

type BottomItem = NavItemDef & {
  icon: (props?: { locked?: boolean }) => JSX.Element
}

function itemsForAuth(isAuthenticated: boolean): BottomItem[] {
  if (isAuthenticated) {
    return [
      { ...publicNavItems[0], icon: HomeIcon },
      { ...publicNavItems[1], icon: CompassIcon },
      { ...accountNavItems[0], icon: ChatIcon },
      { ...accountNavItems[1], icon: CalendarIcon },
      { ...accountNavItems[2], icon: UserIcon },
    ]
  }
  return [
    { ...publicNavItems[0], icon: HomeIcon },
    { ...publicNavItems[1], icon: CompassIcon },
    { to: '/matching', label: 'Matchs', requiresAuth: true, icon: MatchIcon },
    { to: '/auth', label: 'Connexion', icon: LoginIcon },
  ]
}

export function BottomNav() {
  const { isAuthenticated } = useAuth()
  const items = itemsForAuth(isAuthenticated)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white/92 backdrop-blur supports-[backdrop-filter]:bg-white/70 lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-2 py-2 sm:px-4 sm:py-3">
        {items.map((it) => {
          const to = it.to === '/auth' ? '/auth' : navTarget(it, isAuthenticated)
          const needsLock = Boolean(it.requiresAuth && !isAuthenticated)

          if (it.to === '/auth' && !isAuthenticated) {
            return (
              <Link
                key="auth"
                to="/auth"
                className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-[10px] font-semibold text-[var(--sw-orange)] sm:gap-1 sm:text-xs"
              >
                <it.icon />
                <span className="truncate">Connexion</span>
              </Link>
            )
          }

          return (
            <NavLink
              key={it.to}
              to={to}
              end={it.end}
              className={({ isActive }) =>
                [
                  'flex min-w-0 flex-1 flex-col items-center gap-0.5 text-[10px] font-semibold sm:gap-1 sm:text-xs',
                  isActive ? 'text-[var(--sw-pink)]' : 'text-[var(--sw-muted)] hover:text-[var(--sw-text-strong)]',
                ].join(' ')
              }
            >
              {it.to === '/matching' && needsLock ? <MatchIcon locked /> : <it.icon />}
              <span className="truncate">{it.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 11.5 12 4l8 7.5V20a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 20v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M14.8 9.2 13 13l-3.8 1.8L11 11l3.8-1.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 10h8M8 14h5M21 12a8.5 8.5 0 0 1-8.5 8.5H6l-3 1.5 1.2-3A8.5 8.5 0 1 1 21 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 4v2M17 4v2M5 8h14M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12a4.2 4.2 0 1 0 0-8.4A4.2 4.2 0 0 0 12 12Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20.4a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MatchIcon(props: { locked?: boolean } = {}) {
  const { locked } = props
  return (
    <span className="relative inline-flex">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4.5 12h6M13.5 12H20M12 4.5v6M12 13.5v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="16" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
      {locked ? <LockDot /> : null}
    </span>
  )
}

function LoginIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 12H4M12 8l4 4-4 4M20 6v12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LockDot() {
  return (
    <span className="absolute -right-1 -top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-[var(--sw-orange)] text-[8px] text-black">
      🔒
    </span>
  )
}
