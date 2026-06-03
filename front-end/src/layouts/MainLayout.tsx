import { Outlet } from 'react-router-dom'
import { BottomNav } from '../ui/BottomNav.tsx'
import { MobileTopBar } from '../ui/MobileTopBar.tsx'
import { SiteFooter } from '../ui/SiteFooter.tsx'
import { TopNav } from '../ui/TopNav.tsx'

export function MainLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--sw-bg)] text-[var(--sw-text)] lg:pt-16">
      <TopNav />
      <MobileTopBar />
      <main className="flex-1 lg:px-[10%]">
        <Outlet />
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  )
}
