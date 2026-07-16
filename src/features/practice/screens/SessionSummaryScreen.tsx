import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import type { PracticeLogEntry } from '../../../domain/practice/models'
import { usePracticeSession, useSessionLogEntries } from '../hooks/usePracticeSession'
import { CATEGORY_LABELS } from '../categoryLabels'

function EntryResult({ entry }: { entry: PracticeLogEntry }) {
  if (entry.metricType === 'makes_attempts') {
    const pct = entry.attempts ? Math.round(((entry.makes ?? 0) / entry.attempts) * 100) : 0
    return (
      <span className="text-white/70">
        {entry.makes}/{entry.attempts} ({pct}%)
      </span>
    )
  }
  if (entry.metricType === 'distance_feet') {
    return <span className="text-white/70">{entry.distanceFeet} ft</span>
  }
  return <span className="text-brand-green">Completed</span>
}

export function SessionSummaryScreen() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const { data: session, isLoading: sessionLoading } = usePracticeSession(sessionId)
  const { data: logEntries, isLoading: entriesLoading } = useSessionLogEntries(sessionId)

  if (sessionLoading || entriesLoading) {
    return <div className="px-6 py-8 text-white/50">Loading summary…</div>
  }
  if (!session || !logEntries) {
    return <div className="px-6 py-8 text-red-400">Session not found.</div>
  }

  const makesAttemptsEntries = logEntries.filter((e) => e.metricType === 'makes_attempts')
  const totalAttempts = makesAttemptsEntries.reduce((sum, e) => sum + (e.attempts ?? 0), 0)
  const totalMakes = makesAttemptsEntries.reduce((sum, e) => sum + (e.makes ?? 0), 0)
  const overallPct = totalAttempts > 0 ? Math.round((totalMakes / totalAttempts) * 100) : null

  return (
    <div className="px-6 py-8 pb-24">
      <h1 className="mb-1 text-2xl font-bold text-white">Session complete</h1>
      <p className="mb-8 text-white/50">
        {CATEGORY_LABELS[session.category]} · {session.durationMinutes} min
      </p>

      <div className="mb-8 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-2xl font-bold text-white">{logEntries.length}</p>
          <p className="text-xs uppercase tracking-wide text-white/40">Drills logged</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-2xl font-bold text-white">{overallPct !== null ? `${overallPct}%` : '—'}</p>
          <p className="text-xs uppercase tracking-wide text-white/40">Overall makes</p>
        </div>
      </div>

      <p className="mb-3 text-xs uppercase tracking-wide text-white/40">Results</p>
      <div className="mb-8 flex flex-col gap-2">
        {logEntries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <span className="text-white">{entry.drillLabel}</span>
            <EntryResult entry={entry} />
          </div>
        ))}
      </div>

      <Button onClick={() => navigate('/practice')}>Back to practice</Button>
    </div>
  )
}
