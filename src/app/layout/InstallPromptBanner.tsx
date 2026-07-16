import { useState } from 'react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

export function InstallPromptBanner() {
  const { canInstall, promptInstall } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(false)

  if (!canInstall || dismissed) return null

  return (
    <div className="flex items-center justify-between gap-3 bg-brand-green/10 px-4 py-2 text-sm text-white">
      <span>Install DiscCoach for quicker access on the course.</span>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={promptInstall}
          className="min-h-11 rounded-full bg-brand-green px-3 text-xs font-semibold text-black transition-colors hover:bg-brand-green/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
        >
          Install
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss install prompt"
          className="min-h-11 rounded-full px-3 text-xs text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
        >
          Not now
        </button>
      </div>
    </div>
  )
}
