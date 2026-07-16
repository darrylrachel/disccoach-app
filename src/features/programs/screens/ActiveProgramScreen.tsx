import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { SectionLabel } from '../../../components/ui/SectionLabel'
import { programDayLabel } from '../../../domain/programs/models'
import { useProgram } from '../hooks/usePrograms'
import { useActiveEnrollment, useProgramProgress } from '../hooks/useProgramEnrollment'
import { useAbandonEnrollment } from '../hooks/useProgramMutations'
import { useActivePracticeSession } from '../../practice/hooks/usePracticeSession'
import { usePracticeTemplate } from '../../practice/hooks/usePracticeTemplates'
import { useStartPracticeSession } from '../../practice/hooks/usePracticeMutations'
import { CATEGORY_LABELS } from '../../practice/categoryLabels'

export function ActiveProgramScreen() {
  const navigate = useNavigate()
  const enrollmentQuery = useActiveEnrollment()
  const enrollment = enrollmentQuery.data

  const { data: program, isLoading: programLoading } = useProgram(enrollment?.programId)
  const { progress, isLoading: progressLoading } = useProgramProgress(enrollment?.programId, enrollment?.id)
  const activeSessionQuery = useActivePracticeSession()
  const { data: currentTemplate } = usePracticeTemplate(progress?.currentDay?.templateId)
  const startSession = useStartPracticeSession()
  const abandonEnrollment = useAbandonEnrollment()

  if (enrollmentQuery.isLoading || programLoading || progressLoading) {
    return <div className="px-6 py-8 text-white/50">Loading your program…</div>
  }

  if (!enrollment || !program) {
    return (
      <div className="px-6 py-8">
        <p className="mb-4 text-white/60">You do not have an active training program.</p>
        <Button onClick={() => navigate('/programs')}>Browse programs</Button>
      </div>
    )
  }

  const activeSession = activeSessionQuery.data
  const linkedSessionInProgress = activeSession?.enrollmentId === enrollment.id ? activeSession : null
  const otherSessionInProgress = activeSession && activeSession.enrollmentId !== enrollment.id ? activeSession : null

  function handleAbandon() {
    if (!confirm(`Abandon "${program!.name}"? Your progress so far will be saved.`)) return
    abandonEnrollment.mutate(enrollment!.id, { onSuccess: () => navigate('/programs') })
  }

  function handleStartToday() {
    const day = progress?.currentDay
    if (!day || !currentTemplate) return
    startSession.mutate(
      {
        templateId: day.templateId,
        category: currentTemplate.category,
        durationMinutes: currentTemplate.durationMinutes,
        programDayId: day.id,
        enrollmentId: enrollment!.id,
      },
      { onSuccess: (session) => navigate(`/practice/${session.id}`) },
    )
  }

  const isComplete = progress?.isComplete ?? false

  return (
    <div className="px-6 py-8 pb-24">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{program.name}</h1>
          {progress?.currentDay && !isComplete && (
            <p className="text-sm text-white/50">{programDayLabel(progress.currentDay)}</p>
          )}
        </div>
        {!isComplete && (
          <button
            type="button"
            onClick={handleAbandon}
            disabled={abandonEnrollment.isPending}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-400 transition-colors hover:border-red-500/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-50"
          >
            Abandon
          </button>
        )}
      </div>

      {progress && (
        <Card className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <SectionLabel>Progress</SectionLabel>
            <span className="text-sm font-semibold text-white">
              {progress.completedCount}/{progress.totalCount} sessions
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-brand-green transition-all"
              style={{ width: `${progress.percentComplete}%` }}
            />
          </div>
        </Card>
      )}

      {isComplete ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-brand-gold/40 bg-brand-gold/10 p-5 text-center">
            <p className="mb-1 text-2xl">🏆</p>
            <p className="font-semibold text-white">Program complete!</p>
            <p className="mt-1 text-sm text-white/60">
              You finished every session in {program.name}. Nice work.
            </p>
          </div>
          <Button onClick={() => navigate('/programs')}>Browse another program</Button>
        </div>
      ) : (
        <>
          <SectionLabel className="mb-3">Today&apos;s workout</SectionLabel>
          {progress?.currentDay ? (
            <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="mb-1 text-lg font-semibold text-white">{progress.currentDay.title}</p>
              <p className="mb-4 text-sm text-white/50">{progress.currentDay.description}</p>
              {currentTemplate && (
                <p className="mb-4 text-xs uppercase tracking-wide text-white/40">
                  {CATEGORY_LABELS[currentTemplate.category]} · {currentTemplate.durationMinutes} min
                </p>
              )}

              {linkedSessionInProgress ? (
                <Button onClick={() => navigate(`/practice/${linkedSessionInProgress.id}`)}>Resume session</Button>
              ) : otherSessionInProgress ? (
                <>
                  <Button disabled>Start today&apos;s session</Button>
                  <p className="mt-3 text-sm text-white/50">
                    You have another practice session in progress. Finish or abandon it first.
                  </p>
                </>
              ) : (
                <Button onClick={handleStartToday} disabled={!currentTemplate || startSession.isPending}>
                  {startSession.isPending ? 'Starting…' : "Start today's session"}
                </Button>
              )}
              {startSession.isError && (
                <p className="mt-3 text-sm text-red-400">Unable to start that session. Try again.</p>
              )}
            </div>
          ) : (
            <p className="mb-6 text-white/50">No sessions scheduled yet.</p>
          )}
        </>
      )}

      {abandonEnrollment.isError && <p className="mt-3 text-sm text-red-400">Unable to abandon this program.</p>}
    </div>
  )
}
