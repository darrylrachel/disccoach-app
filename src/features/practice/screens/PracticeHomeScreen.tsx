import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { selectTemplate } from '../../../domain/practice/sessionGenerator'
import type { PracticeCategory } from '../../../domain/practice/models'
import { useProfile } from '../../profile/hooks/useProfile'
import { usePracticeTemplates } from '../hooks/usePracticeTemplates'
import { useActivePracticeSession } from '../hooks/usePracticeSession'
import { useAbandonPracticeSession, useStartPracticeSession } from '../hooks/usePracticeMutations'
import { CATEGORY_LABELS, CATEGORY_ORDER, DURATION_OPTIONS } from '../categoryLabels'

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green ${
        active
          ? 'border-brand-green bg-brand-green/15 text-brand-green'
          : 'border-white/15 bg-white/5 text-white/70 hover:border-white/30'
      }`}
    >
      {children}
    </button>
  )
}

function ResumeSessionCard({
  session,
}: {
  session: NonNullable<ReturnType<typeof useActivePracticeSession>['data']>
}) {
  const navigate = useNavigate()
  const abandonSession = useAbandonPracticeSession()

  function handleAbandon() {
    if (!confirm('Abandon this session? Your progress so far will be saved.')) return
    abandonSession.mutate(session.id)
  }

  return (
    <div className="mb-8 rounded-xl border border-brand-green/40 bg-brand-green/10 p-5">
      <p className="mb-1 text-xs uppercase tracking-wide text-brand-green/80">Session in progress</p>
      <p className="mb-4 text-lg font-semibold text-white">
        {CATEGORY_LABELS[session.category]} · {session.durationMinutes} min
      </p>
      <div className="flex gap-3">
        <Button onClick={() => navigate(`/practice/${session.id}`)}>Resume session</Button>
        <Button variant="secondary" onClick={handleAbandon} disabled={abandonSession.isPending}>
          Abandon
        </Button>
      </div>
      {abandonSession.isError && <p className="mt-3 text-sm text-red-400">Unable to abandon that session.</p>}
    </div>
  )
}

export function PracticeHomeScreen() {
  const navigate = useNavigate()
  const [duration, setDuration] = useState<(typeof DURATION_OPTIONS)[number]>(20)
  const [category, setCategory] = useState<PracticeCategory>('putting')

  const { data: profile } = useProfile()
  const activeSessionQuery = useActivePracticeSession()
  const templatesQuery = usePracticeTemplates(category)
  const startSession = useStartPracticeSession()

  function handleStart() {
    const templates = templatesQuery.data ?? []
    const template = selectTemplate(templates, {
      durationMinutes: duration,
      category,
      skillLevel: profile?.skillLevel ?? null,
    })
    if (!template) return

    startSession.mutate(
      { templateId: template.id, category, durationMinutes: template.durationMinutes },
      { onSuccess: (session) => navigate(`/practice/${session.id}`) },
    )
  }

  const noTemplatesAvailable = templatesQuery.isSuccess && templatesQuery.data.length === 0
  const activeSession = activeSessionQuery.data

  return (
    <div className="px-6 py-8 pb-24">
      <h1 className="mb-2 text-2xl font-bold text-white">Practice</h1>

      {activeSession && <ResumeSessionCard session={activeSession} />}

      {!activeSession && (
        <>
          <p className="mb-8 text-white/50">How much time do you have?</p>

          <p className="mb-3 text-xs uppercase tracking-wide text-white/55">Time available</p>
          <div className="mb-8 grid grid-cols-3 gap-3">
            {DURATION_OPTIONS.map((minutes) => (
              <OptionButton key={minutes} active={duration === minutes} onClick={() => setDuration(minutes)}>
                {minutes} min
              </OptionButton>
            ))}
          </div>

          <p className="mb-3 text-xs uppercase tracking-wide text-white/55">Focus</p>
          <div className="mb-8 grid grid-cols-2 gap-3">
            {CATEGORY_ORDER.map((c) => (
              <OptionButton key={c} active={category === c} onClick={() => setCategory(c)}>
                {CATEGORY_LABELS[c]}
              </OptionButton>
            ))}
          </div>

          <Button onClick={handleStart} disabled={startSession.isPending || noTemplatesAvailable}>
            {startSession.isPending ? 'Starting…' : 'Start session'}
          </Button>

          {noTemplatesAvailable && (
            <p className="mt-3 text-sm text-red-400">
              No {CATEGORY_LABELS[category].toLowerCase()} templates are available yet.
            </p>
          )}
          {startSession.isError && (
            <p className="mt-3 text-sm text-red-400">Unable to start a session. Try again.</p>
          )}
        </>
      )}
    </div>
  )
}
