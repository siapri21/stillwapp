import { Outlet } from 'react-router-dom'
import { BottomNav } from '../ui/BottomNav.tsx'
import { MobileTopBar } from '../ui/MobileTopBar.tsx'
import { SiteFooter } from '../ui/SiteFooter.tsx'
import { TopNav } from '../ui/TopNav.tsx'

export function MainLayout() {
  return (
    <div className="flex min-h-dvh w-full max-w-[100vw] flex-col overflow-x-hidden bg-[var(--sw-bg)] text-[var(--sw-text)] lg:pt-16">
      <TopNav />
      <MobileTopBar />
      <main className="flex-1 pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom,0px))] lg:px-[10%] lg:pb-0">
        <Outlet />
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  )
}
