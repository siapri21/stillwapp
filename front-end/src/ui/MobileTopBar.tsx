import { Link } from 'react-router-dom'
import { assetUrl } from '../utils/assetUrl.ts'
import { AuthActions } from './AuthActions.tsx'
import { NotificationLink } from './NotificationLink.tsx'

export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-[var(--sw-bg)]/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 md:px-6">
        <Link to="/" className="shrink-0">
          <img src={assetUrl('logoskillwapp.png')} alt="SkillWapp" className="h-10 w-12" />
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <NotificationLink />
          <Link
            to="/search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5"
            aria-label="Recherche"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
          <AuthActions compact />
        </div>
      </div>
    </header>
  )
}
