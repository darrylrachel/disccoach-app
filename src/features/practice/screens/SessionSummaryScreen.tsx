import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { SectionLabel } from '../../../components/ui/SectionLabel'
import type { PracticeLogEntry } from '../../../domain/practice/models'
import type { NewPersonalRecordInput } from '../../../domain/progress/models'
import { usePracticeSession, useSessionLogEntries } from '../hooks/usePracticeSession'
import { usePracticeTemplate } from '../hooks/usePracticeTemplates'
import { CATEGORY_LABELS } from '../categoryLabels'
import { useNewPersonalRecords } from '../../progress/hooks/useNewPersonalRecords'
import { recordImprovementLabel, recordLabel, recordValueLabel } from '../../progress/recordLabels'

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

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

function PersonalRecordCelebration({ records, visible }: { records: NewPersonalRecordInput[]; visible: boolean }) {
  if (records.length === 0) return null

  return (
    <div
      className={`mb-8 flex flex-col gap-3 transition-all duration-500 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <p className="text-sm font-semibold text-brand-gold">
        🏆 New personal record{records.length > 1 ? 's' : ''}
      </p>
      {records.map((record) => (
        <div key={record.recordType} className="rounded-xl border border-brand-gold/40 bg-brand-gold/10 p-4">
          <p className="mb-2 text-sm font-semibold text-white">{recordLabel(record.recordType)}</p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-white/50">
              {record.previousValue !== null ? recordValueLabel(record.recordType, record.previousValue) : 'First attempt'}
            </span>
            <span className="text-white/30">→</span>
            <span className="font-semibold text-brand-gold">{recordValueLabel(record.recordType, record.value)}</span>
            <span className="ml-auto rounded-full bg-brand-gold/20 px-2 py-0.5 text-xs font-medium text-brand-gold">
              {recordImprovementLabel(record.recordType, record.previousValue, record.value)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SessionSummaryScreen() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const { data: session, isLoading: sessionLoading } = usePracticeSession(sessionId)
  const { data: logEntries, isLoading: entriesLoading } = useSessionLogEntries(sessionId)
  const { data: template } = usePracticeTemplate(session?.templateId)

  const newRecords = useNewPersonalRecords(sessionId)
  const [celebrationVisible, setCelebrationVisible] = useState(false)

  // Triggers the entrance transition once records are known; newRecords is
  // fixed for the lifetime of this screen (it's a one-shot read on mount).
  useEffect(() => {
    if (newRecords.length === 0) return
    const frame = requestAnimationFrame(() => setCelebrationVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [newRecords.length])

  if (sessionLoading || entriesLoading) {
    return <div className="px-6 py-8 text-white/50">Loading summary…</div>
  }
  if (!session || !logEntries) {
    return <div className="px-6 py-8 text-red-400">Session not found.</div>
  }

  const isAbandoned = session.status === 'abandoned'
  const difficultyLabel = template ? capitalize(template.difficulty) : null

  const makesAttemptsEntries = logEntries.filter((e) => e.metricType === 'makes_attempts')
  const totalAttempts = makesAttemptsEntries.reduce((sum, e) => sum + (e.attempts ?? 0), 0)
  const totalMakes = makesAttemptsEntries.reduce((sum, e) => sum + (e.makes ?? 0), 0)
  const overallPct = totalAttempts > 0 ? Math.round((totalMakes / totalAttempts) * 100) : null

  const distanceValues = logEntries
    .filter((e) => e.metricType === 'distance_feet' && e.distanceFeet !== null)
    .map((e) => e.distanceFeet as number)
  const bestDistance = distanceValues.length > 0 ? Math.max(...distanceValues) : null

  const statCards =
    session.category === 'putting' || session.category === 'accuracy'
      ? [
          { label: 'Makes / attempts', value: totalAttempts > 0 ? `${totalMakes}/${totalAttempts}` : '—' },
          { label: 'Accuracy', value: overallPct !== null ? `${overallPct}%` : '—' },
        ]
      : session.category === 'distance'
        ? [
            { label: 'Best distance', value: bestDistance !== null ? `${bestDistance} ft` : '—' },
            { label: 'Drills logged', value: String(logEntries.length) },
          ]
        : [
            { label: 'Drills completed', value: String(logEntries.length) },
            { label: 'Duration', value: `${session.durationMinutes} min` },
          ]

  return (
    <div className="px-6 py-8 pb-24">
      <div className="mb-8 flex items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl ${
            isAbandoned ? 'bg-white/10' : 'bg-brand-green/15'
          }`}
        >
          {isAbandoned ? '⏸️' : '✅'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{isAbandoned ? 'Session abandoned' : 'Session complete'}</h1>
          <p className="text-sm text-white/50">
            {CATEGORY_LABELS[session.category]}
            {difficultyLabel ? ` · ${difficultyLabel}` : ''} · {session.durationMinutes} min
          </p>
        </div>
      </div>

      <PersonalRecordCelebration records={newRecords} visible={celebrationVisible} />

      <div className="mb-8 grid grid-cols-2 gap-3">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <SectionLabel>{stat.label}</SectionLabel>
          </Card>
        ))}
      </div>

      <SectionLabel className="mb-3">Results</SectionLabel>
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

      <div className="flex flex-col gap-3">
        <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        <Button variant="secondary" onClick={() => navigate('/practice')}>
          Practice again
        </Button>
      </div>
    </div>
  )
}
