import { useState } from 'react'
import { DiscCard } from '../../../components/disc/DiscCard'
import { useDiscCollection } from '../hooks/useDiscCollection'

export function CollectionByMoldView() {
  const { groups, isLoading, isError } = useDiscCollection()
  const [expandedKey, setExpandedKey] = useState<string | null>(null)

  if (isLoading) return <p className="text-white/50">Loading your collection…</p>
  if (isError) return <p className="text-red-400">Unable to load your collection.</p>
  if (!groups || groups.length === 0) {
    return <p className="text-white/50">You haven&apos;t added any discs yet.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => {
        const expanded = expandedKey === group.key
        return (
          <div key={group.key} className="rounded-xl border border-white/10 bg-white/5">
            <button
              type="button"
              onClick={() => setExpandedKey(expanded ? null : group.key)}
              className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{group.moldName}</p>
                <p className="truncate text-xs text-white/50">{group.manufacturer}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-xs">
                <span className="rounded-full bg-brand-green/15 px-2 py-1 font-semibold text-brand-green">
                  {group.ownedCount} owned
                </span>
                <span className="rounded-full bg-white/10 px-2 py-1 text-white/60">{group.inBagCount} in bag</span>
                <span className="rounded-full bg-white/10 px-2 py-1 text-white/60">
                  {group.inStorageCount} storage
                </span>
              </div>
            </button>

            {expanded && (
              <div className="flex flex-col gap-2 border-t border-white/10 p-3">
                {group.discs.map((d) => (
                  <DiscCard key={d.disc.id} discWithCatalog={d} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
