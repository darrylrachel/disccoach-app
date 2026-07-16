import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { metricTypeForCategory, type DrillStep, type PracticeCategory } from '../../../domain/practice/models'
import { usePracticeSession, useSessionLogEntries } from '../hooks/usePracticeSession'
import { usePracticeTemplate } from '../hooks/usePracticeTemplates'
import {
  useAbandonPracticeSession,
  useCompletePracticeSession,
  useLogEntry,
} from '../hooks/usePracticeMutations'
import { CATEGORY_LABELS } from '../categoryLabels'

export function ActiveSessionScreen() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const { data: session, isLoading: sessionLoading, isError: sessionError } = usePracticeSession(sessionId)
  const { data: template, isLoading: templateLoading } = usePracticeTemplate(session?.templateId)
  const { data: logEntries, isLoading: entriesLoading } = useSessionLogEntries(sessionId)

  // The screen that logs the final drill remounts (its key is the drill
  // count) around the same time the completion mutation resolves, so it
  // can't reliably navigate itself on success — this effect, scoped to the
  // stable parent, is the one place that's guaranteed to see the status
  // flip and redirect, whichever session logged it.
  useEffect(() => {
    if (!session || !sessionId) return
    if (session.status === 'completed') navigate(`/practice/${sessionId}/summary`, { replace: true })
    if (session.status === 'abandoned') navigate('/practice', { replace: true })
  }, [session, sessionId, navigate])

  if (sessionLoading || templateLoading || entriesLoading) {
    return <div className="px-6 py-8 text-white/50">Loading session…</div>
  }
  if (sessionError || !session || !sessionId || !template) {
    return <div className="px-6 py-8 text-red-400">Session not found.</div>
  }
  if (session.status !== 'in_progress') {
    return null
  }

  const drills = template.structure
  const completedCount = Math.min(logEntries?.length ?? 0, drills.length)

  return (
    <ActiveSessionContent
      key={completedCount}
      sessionId={sessionId}
      category={session.category}
      drills={drills}
      completedCount={completedCount}
    />
  )
}

interface ActiveSessionContentProps {
  sessionId: string
  category: PracticeCategory
  drills: DrillStep[]
  completedCount: number
}

function ActiveSessionContent({ sessionId, category, drills, completedCount }: ActiveSessionContentProps) {
  const navigate = useNavigate()
  const metricType = metricTypeForCategory(category)
  const drill = drills[completedCount] as DrillStep | undefined
  const isSessionDone = !drill

  const [attempts, setAttempts] = useState(drill ? String(drill.reps) : '')
  const [makes, setMakes] = useState('')
  const [distanceFeet, setDistanceFeet] = useState('')

  const logEntry = useLogEntry(sessionId)
  const completeSession = useCompletePracticeSession()
  const abandonSession = useAbandonPracticeSession()

  // Navigation on completion is handled by the status-watcher effect in the
  // parent (see comment there) rather than a callback here, since this
  // component can unmount before the mutation settles.
  function finishIfLastDrill(isLast: boolean) {
    if (!isLast) return
    completeSession.mutate(sessionId)
  }

  function handleLogMakesAttempts(event: FormEvent) {
    event.preventDefault()
    if (!drill) return
    const attemptsValue = Number(attempts)
    const makesValue = Number(makes)
    if (!attemptsValue || makesValue < 0 || makesValue > attemptsValue) return

    logEntry.mutate(
      { drillLabel: drill.label, metricType: 'makes_attempts', attempts: attemptsValue, makes: makesValue },
      { onSuccess: () => finishIfLastDrill(completedCount + 1 >= drills.length) },
    )
  }

  function handleLogDistance(event: FormEvent) {
    event.preventDefault()
    if (!drill) return
    const distanceValue = Number(distanceFeet)
    if (!distanceValue || distanceValue <= 0) return

    logEntry.mutate(
      { drillLabel: drill.label, metricType: 'distance_feet', distanceFeet: distanceValue },
      { onSuccess: () => finishIfLastDrill(completedCount + 1 >= drills.length) },
    )
  }

  function handleMarkComplete() {
    if (!drill) return
    logEntry.mutate(
      { drillLabel: drill.label, metricType: 'completed_boolean' },
      { onSuccess: () => finishIfLastDrill(completedCount + 1 >= drills.length) },
    )
  }

  function handleAbandon() {
    if (!confirm('Abandon this session? Your progress so far will be saved.')) return
    abandonSession.mutate(sessionId, { onSuccess: () => navigate('/practice') })
  }

  return (
    <div className="px-6 py-8 pb-24">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{CATEGORY_LABELS[category]} session</h1>
          <p className="text-sm text-white/50">
            Drill {Math.min(completedCount + 1, drills.length)} of {drills.length}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAbandon}
          disabled={abandonSession.isPending}
          className="shrink-0 rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-400 transition-colors hover:border-red-500/70 disabled:opacity-50"
        >
          Abandon
        </button>
      </div>

      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-brand-green transition-all"
          style={{ width: `${Math.round((completedCount / drills.length) * 100)}%` }}
        />
      </div>

      {isSessionDone ? (
        <p className="text-white/50">Finishing up…</p>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="mb-1 text-lg font-semibold text-white">{drill.label}</p>
          <p className="mb-5 text-sm text-white/50">Target: {drill.reps} reps</p>

          {metricType === 'makes_attempts' && (
            <form onSubmit={handleLogMakesAttempts} className="flex flex-col gap-3">
              <Input
                id="attempts"
                label="Attempts"
                type="number"
                min={1}
                value={attempts}
                onChange={(e) => setAttempts(e.target.value)}
              />
              <Input
                id="makes"
                label="Makes"
                type="number"
                min={0}
                value={makes}
                onChange={(e) => setMakes(e.target.value)}
              />
              <Button type="submit" disabled={logEntry.isPending}>
                {logEntry.isPending ? 'Logging…' : 'Log & continue'}
              </Button>
            </form>
          )}

          {metricType === 'distance_feet' && (
            <form onSubmit={handleLogDistance} className="flex flex-col gap-3">
              <Input
                id="distanceFeet"
                label="Best distance (feet)"
                type="number"
                min={1}
                value={distanceFeet}
                onChange={(e) => setDistanceFeet(e.target.value)}
              />
              <Button type="submit" disabled={logEntry.isPending}>
                {logEntry.isPending ? 'Logging…' : 'Log & continue'}
              </Button>
            </form>
          )}

          {metricType === 'completed_boolean' && (
            <Button onClick={handleMarkComplete} disabled={logEntry.isPending}>
              {logEntry.isPending ? 'Logging…' : 'Mark drill complete'}
            </Button>
          )}

          {logEntry.isError && <p className="mt-3 text-sm text-red-400">Unable to log that result.</p>}
        </div>
      )}
    </div>
  )
}
