import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { InstallPromptBanner } from './InstallPromptBanner'
import { OfflineBanner } from './OfflineBanner'

export function AppShell() {
  return (
    <div className="min-h-svh pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <OfflineBanner />
      <InstallPromptBanner />
      <Outlet />
      <BottomNav />
    </div>
  )
}
