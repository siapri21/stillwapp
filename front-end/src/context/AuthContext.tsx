import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ApiUser } from '../api/types.ts'

const USER_KEY = 'skillwapp_user'
const TOKEN_KEY = 'skillwapp_token'

type AuthContextValue = {
  currentUser: ApiUser | null
  isAuthenticated: boolean
  login: (user: ApiUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): ApiUser | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const raw = localStorage.getItem(USER_KEY)
    if (!token || !raw) return null
    return JSON.parse(raw) as ApiUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(() => readStoredUser())

  const login = useCallback((user: ApiUser) => {
    const token = `sw_${user.id}_${Date.now()}`
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(TOKEN_KEY, token)
    setCurrentUser(user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    setCurrentUser(null)
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: currentUser !== null,
      login,
      logout,
    }),
    [currentUser, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
