import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Select } from '../../../components/ui/Select'
import { DiscCard } from '../../../components/disc/DiscCard'
import { CollectionByMoldView } from '../components/CollectionByMoldView'
import { useDiscs } from '../hooks/useDiscs'
import type { DiscCategory, DiscStatus } from '../../../domain/disc/models'

type ViewMode = 'list' | 'byMold'

const STATUS_OPTIONS: Array<{ value: DiscStatus | ''; label: string }> = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'retired', label: 'Retired' },
  { value: 'lost', label: 'Lost' },
  { value: 'traded', label: 'Traded' },
]

const CATEGORY_OPTIONS: Array<{ value: DiscCategory | ''; label: string }> = [
  { value: '', label: 'All categories' },
  { value: 'putter', label: 'Putter' },
  { value: 'midrange', label: 'Midrange' },
  { value: 'fairway_driver', label: 'Fairway driver' },
  { value: 'distance_driver', label: 'Distance driver' },
]

export function DiscListScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [status, setStatus] = useState<DiscStatus | ''>('')
  const [category, setCategory] = useState<DiscCategory | ''>('')

  const { data: discs, isLoading, isError } = useDiscs(status ? { status } : {})

  const filtered = useMemo(() => {
    if (!discs) return []
    if (!category) return discs
    return discs.filter((d) => d.catalogEntry?.category === category)
  }, [discs, category])

  return (
    <div className="px-6 py-8 pb-24">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Discs</h1>
        <Link
          to="/discs/new"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-brand-green/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
        >
          Add disc
        </Link>
      </div>

      <div className="mb-6 flex gap-2 rounded-lg border border-white/10 p-1">
        <button
          type="button"
          onClick={() => setViewMode('list')}
          className={`flex min-h-11 flex-1 items-center justify-center rounded-md py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green ${
            viewMode === 'list' ? 'bg-brand-green text-black' : 'text-white/60'
          }`}
        >
          List
        </button>
        <button
          type="button"
          onClick={() => setViewMode('byMold')}
          className={`flex min-h-11 flex-1 items-center justify-center rounded-md py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green ${
            viewMode === 'byMold' ? 'bg-brand-green text-black' : 'text-white/60'
          }`}
        >
          By mold
        </button>
      </div>

      {viewMode === 'byMold' ? (
        <CollectionByMoldView />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3">
            <Select
              id="statusFilter"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as DiscStatus | '')}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
            <Select
              id="categoryFilter"
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as DiscCategory | '')}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          {isLoading && <p className="text-white/50">Loading your discs…</p>}
          {isError && <p className="text-red-400">Unable to load your discs.</p>}

          {!isLoading && !isError && filtered.length === 0 && (
            <p className="text-white/50">
              {discs && discs.length > 0
                ? 'No discs match these filters.'
                : "You haven't added any discs yet."}
            </p>
          )}

          <div className="flex flex-col gap-3">
            {filtered.map((d) => (
              <DiscCard key={d.disc.id} discWithCatalog={d} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
