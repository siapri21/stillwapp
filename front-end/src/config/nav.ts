export type NavItemDef = {
  to: string
  label: string
  end?: boolean
  requiresAuth?: boolean
}

export const publicNavItems: NavItemDef[] = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/explore', label: 'Explorer' },
  { to: '/matching', label: 'Matchs', requiresAuth: true },
]

export const accountNavItems: NavItemDef[] = [
  { to: '/messages', label: 'Messagerie', requiresAuth: true },
  { to: '/planning', label: 'Planning', requiresAuth: true },
  { to: '/profile', label: 'Profil', requiresAuth: true },
]

export function navTarget(item: NavItemDef, isAuthenticated: boolean) {
  if (item.requiresAuth && !isAuthenticated) {
    return `/auth?from=${encodeURIComponent(item.to)}`
  }
  return item.to
}
