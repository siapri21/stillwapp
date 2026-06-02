import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}
