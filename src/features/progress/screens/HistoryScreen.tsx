import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { PracticeCategory } from '../../../domain/practice/models'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../../practice/categoryLabels'
import { usePracticeHistory } from '../hooks/usePracticeHistory'

function formatSessionDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function HistoryScreen() {
  const { data: sessions, isLoading, isError } = usePracticeHistory()
  const [categoryFilter, setCategoryFilter] = useState<PracticeCategory | null>(null)

  const filteredSessions = sessions?.filter((session) => !categoryFilter || session.category === categoryFilter)

  return (
    <div className="px-6 py-8 pb-24">
      <h1 className="mb-6 text-2xl font-bold text-white">History</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoryFilter(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            categoryFilter === null
              ? 'bg-brand-green text-black'
              : 'border border-white/20 text-white/60 hover:border-white/40'
          }`}
        >
          All
        </button>
        {CATEGORY_ORDER.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setCategoryFilter(category)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              categoryFilter === category
                ? 'bg-brand-green text-black'
                : 'border border-white/20 text-white/60 hover:border-white/40'
            }`}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-white/50">Loading history…</p>}
      {isError && <p className="text-red-400">Unable to load your practice history.</p>}
      {!isLoading && !isError && filteredSessions?.length === 0 && (
        <p className="text-white/50">No sessions here yet.</p>
      )}

      <div className="flex flex-col gap-2">
        {filteredSessions?.map((session) => (
          <Link
            key={session.id}
            to={`/practice/${session.id}/summary`}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div>
              <p className="font-medium text-white">{CATEGORY_LABELS[session.category]}</p>
              <p className="text-xs text-white/50">
                {formatSessionDate(session.startedAt)} · {session.durationMinutes} min
              </p>
            </div>
            {session.status === 'abandoned' && (
              <span className="shrink-0 rounded-full border border-white/20 px-3 py-1 text-xs text-white/50">
                Abandoned
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
