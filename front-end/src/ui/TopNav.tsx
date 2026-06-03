import { NavLink } from 'react-router-dom'
import { NotificationLink } from './NotificationLink.tsx'

const items = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/explore', label: 'Explorer', end: false },
  { to: '/messages', label: 'Messagerie', end: false },
  { to: '/planning', label: 'Planning', end: false },
  { to: '/profile', label: 'Profil', end: false },
] as const

export function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 hidden border-b border-black/10 bg-white/95 backdrop-blur lg:block">
      <div className="flex items-center gap-6 px-[10%] py-3">
        <NavLink to="/" className="shrink-0">
          <img src="/logoskillwapp.png" alt="SkillWapp" className="h-10 w-12" />
        </NavLink>

        <nav className="flex flex-1 items-center justify-center gap-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                [
                  'rounded-xl px-4 py-2 font-body text-sm font-semibold transition',
                  isActive
                    ? 'bg-[var(--sw-pink)]/10 text-[var(--sw-pink)]'
                    : 'text-[var(--sw-muted)] hover:bg-black/5 hover:text-[var(--sw-text-strong)]',
                ].join(' ')
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
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
        </div>
      </div>
    </header>
  )
}
