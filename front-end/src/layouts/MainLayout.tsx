import { Outlet } from 'react-router-dom'
import { BottomNav } from '../ui/BottomNav.tsx'

export function MainLayout() {
  return (
    <div className="min-h-dvh bg-[var(--sw-bg)] text-[var(--sw-text)]">
      <Outlet />
      <BottomNav />
    </div>
  )
}
