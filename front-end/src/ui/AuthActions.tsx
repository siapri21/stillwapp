import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'
import { userFullName } from '../api/types.ts'

type AuthActionsProps = {
  compact?: boolean
}

export function AuthActions({ compact }: AuthActionsProps) {
  const navigate = useNavigate()
  const { isAuthenticated, currentUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  if (!isAuthenticated) {
    return (
      <Link
        to="/auth"
        className={[
          'inline-flex items-center justify-center rounded-xl bg-[var(--sw-orange)] font-semibold text-black shadow-sm transition hover:brightness-95',
          compact ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm',
        ].join(' ')}
      >
        Connexion
      </Link>
    )
  }

  const name = currentUser ? currentUser.name : 'Compte'

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/profile"
        className={[
          'hidden font-semibold text-[var(--sw-text-strong)] hover:text-[var(--sw-pink)] sm:inline',
          compact ? 'text-xs' : 'text-sm',
        ].join(' ')}
      >
        {currentUser ? userFullName(currentUser).split(' ')[0] : name}
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className={[
          'inline-flex items-center justify-center rounded-xl border-2 border-[var(--sw-pink)] font-semibold text-[var(--sw-pink)] transition hover:bg-[var(--sw-pink)] hover:text-white',
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
        ].join(' ')}
      >
        Se déconnecter
      </button>
    </div>
  )
}
