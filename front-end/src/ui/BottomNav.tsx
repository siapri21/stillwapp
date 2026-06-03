import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Accueil', icon: HomeIcon, end: true },
  { to: '/explore', label: 'Explorer', icon: CompassIcon, end: false },
  { to: '/messages', label: 'Messages', icon: ChatIcon, end: false },
  { to: '/planning', label: 'Planning', icon: CalendarIcon, end: false },
  { to: '/profile', label: 'Profil', icon: UserIcon, end: false },
] as const

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white/92 backdrop-blur supports-[backdrop-filter]:bg-white/70 lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-2 py-2 sm:px-4 sm:py-3">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              [
                'flex min-w-0 flex-1 flex-col items-center gap-0.5 text-[10px] font-semibold sm:gap-1 sm:text-xs',
                isActive ? 'text-[var(--sw-pink)]' : 'text-[var(--sw-muted)] hover:text-[var(--sw-text-strong)]',
              ].join(' ')
            }
          >
            <it.icon />
            <span className="truncate">{it.label}</span>
          </NavLink>
        ))}
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
