import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="bg-brand-gold/15 px-4 py-2 text-center text-sm font-medium text-brand-gold">
      You're offline — showing saved data. New results will save once you're back online.
    </div>
  )
}
