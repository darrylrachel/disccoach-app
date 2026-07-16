import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSignOut } from '../../auth/hooks/useAuthMutations'
import { useBags } from '../../bags/hooks/useBags'
import { useBagAnalysis } from '../../bags/hooks/useBagAnalysis'
import { CATEGORY_LABELS } from '../../practice/categoryLabels'
import { usePersonalRecords } from '../hooks/usePersonalRecords'
import { useRecentPracticeSessions } from '../hooks/usePracticeHistory'
import { usePuttingTrend } from '../hooks/usePuttingTrend'
import { useStreaks } from '../hooks/useStreaks'
import { recordLabel, recordValueLabel } from '../recordLabels'
import { TrendSparkline } from '../../../components/charts/TrendSparkline'

function formatSessionDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function DashboardScreen() {
  const signOut = useSignOut()

  const { data: bags } = useBags()
  const activeBag = bags?.find((bag) => bag.isActive) ?? null
  const { analysis: activeBagAnalysis } = useBagAnalysis(activeBag?.id)

  const { streaks } = useStreaks()
  const { data: records } = usePersonalRecords()
  const { data: recentSessions, isLoading: sessionsLoading } = useRecentPracticeSessions(5)
  const { distances, trendFor } = usePuttingTrend()

  const [selectedDistance, setSelectedDistance] = useState<number | null>(null)
  const effectiveDistance = selectedDistance ?? distances[0] ?? null
  const trend = effectiveDistance !== null ? trendFor(effectiveDistance) : []

  return (
    <div className="px-6 py-8 pb-24">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">DiscCoach</h1>
        <button
          type="button"
          onClick={() => signOut.mutate()}
          className="text-sm text-white/50 hover:text-white"
        >
          Sign out
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-2xl font-bold text-white">{streaks?.currentStreak ?? '—'}</p>
          <p className="text-xs uppercase tracking-wide text-white/40">Day streak</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-2xl font-bold text-white">{streaks?.longestStreak ?? '—'}</p>
          <p className="text-xs uppercase tracking-wide text-white/40">Longest streak</p>
        </div>
      </div>

      <p className="mb-3 text-xs uppercase tracking-wide text-white/40">Active bag</p>
      {activeBag ? (
        <Link
          to={`/bags/${activeBag.id}`}
          className="mb-8 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <div>
            <p className="font-semibold text-white">{activeBag.name}</p>
            <p className="text-xs text-white/50">{activeBagAnalysis?.discCount ?? 0} discs</p>
          </div>
          {activeBagAnalysis && activeBagAnalysis.insights.length > 0 && (
            <span className="shrink-0 rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold text-brand-gold">
              {activeBagAnalysis.insights.length} insight{activeBagAnalysis.insights.length === 1 ? '' : 's'}
            </span>
          )}
        </Link>
      ) : (
        <Link
          to="/bags"
          className="mb-8 block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/50 hover:text-white/70"
        >
          No default bag set yet — pick one in Bags.
        </Link>
      )}

      <p className="mb-3 text-xs uppercase tracking-wide text-white/40">Personal records</p>
      {records && records.length > 0 ? (
        <div className="mb-8 grid grid-cols-2 gap-3">
          {records.map((record) => (
            <div key={record.recordType} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-lg font-bold text-white">{recordValueLabel(record.recordType, record.value)}</p>
              <p className="text-xs uppercase tracking-wide text-white/40">{recordLabel(record.recordType)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-8 text-sm text-white/50">Complete a practice session to start setting PRs.</p>
      )}

      {distances.length > 0 && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-white/40">Putting trend</p>
            <div className="flex gap-2">
              {distances.map((distance) => (
                <button
                  key={distance}
                  type="button"
                  onClick={() => setSelectedDistance(distance)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    distance === effectiveDistance
                      ? 'bg-brand-green text-black'
                      : 'border border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  {distance}ft
                </button>
              ))}
            </div>
          </div>
          <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-4">
            {trend.length > 1 ? (
              <TrendSparkline points={trend} />
            ) : (
              <p className="text-sm text-white/50">Log a few more sessions to see a trend here.</p>
            )}
          </div>
        </>
      )}

      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-white/40">Recent sessions</p>
        <Link to="/history" className="text-xs text-brand-green">
          View all
        </Link>
      </div>

      {sessionsLoading && <p className="text-white/50">Loading sessions…</p>}
      {!sessionsLoading && recentSessions?.length === 0 && (
        <p className="text-white/50">No sessions logged yet — head to Practice to get started.</p>
      )}

      <div className="flex flex-col gap-2">
        {recentSessions?.map((session) => (
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
