import { Outlet } from 'react-router-dom'
import { BottomNav } from '../ui/BottomNav.tsx'
import { TopNav } from '../ui/TopNav.tsx'

export function MainLayout() {
  return (
    <div className="min-h-dvh bg-[var(--sw-bg)] text-[var(--sw-text)] lg:pt-16">
      <TopNav />
      <div className="lg:px-[10%]">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
