import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const from = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/auth?from=${from}`} replace />
  }

  return <Outlet />
}
