import { useRegisterSW } from 'virtual:pwa-register/react'

export function UpdateAvailableToast() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="fixed inset-x-0 bottom-20 z-20 mx-auto flex max-w-md items-center justify-between gap-3 rounded-xl border border-white/10 bg-brand-bg px-4 py-3 shadow-lg">
      <span className="text-sm text-white">A new version of DiscCoach is available.</span>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => updateServiceWorker(true)}
          className="min-h-11 rounded-full bg-brand-green px-3 text-xs font-semibold text-black transition-colors hover:bg-brand-green/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
        >
          Refresh
        </button>
        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          aria-label="Dismiss update notice"
          className="min-h-11 rounded-full px-3 text-xs text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
        >
          Later
        </button>
      </div>
    </div>
  )
}
