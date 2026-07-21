import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { SectionLabel } from '../../../components/ui/SectionLabel'
import { ExerciseCard } from '../components/ExerciseCard'
import { useResolvedProgramDayExercises } from '../hooks/useResolvedProgramDayExercises'
import { useAbandonResistanceSession, useCompleteResistanceSession, useResistanceSession } from '../hooks/useResistanceSession'

export function ResistanceWorkoutScreen() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const { data: session, isLoading: sessionLoading } = useResistanceSession(sessionId)
  const { data: exercises, isLoading: exercisesLoading } = useResolvedProgramDayExercises(
    session?.programDayId ?? undefined,
  )
  const completeSession = useCompleteResistanceSession()
  const abandonSession = useAbandonResistanceSession()

  if (sessionLoading) {
    return <div className="px-6 py-8 text-white/50">Loading workout…</div>
  }
  if (!session || !sessionId) {
    return <div className="px-6 py-8 text-red-400">Workout not found.</div>
  }

  if (session.status === 'completed') {
    return (
      <div className="px-6 py-8 pb-24">
        <div className="rounded-xl border border-brand-green/40 bg-brand-green/10 p-5 text-center">
          <p className="mb-1 text-2xl">💪</p>
          <p className="font-semibold text-white">Workout complete!</p>
        </div>
        <div className="mt-6">
          <Button onClick={() => navigate('/programs/active')}>Back to program</Button>
        </div>
      </div>
    )
  }

  function handleComplete() {
    completeSession.mutate(sessionId!, { onSuccess: () => navigate('/programs/active') })
  }

  function handleAbandon() {
    if (!confirm('Abandon this workout?')) return
    abandonSession.mutate(sessionId!, { onSuccess: () => navigate('/programs/active') })
  }

  return (
    <div className="px-6 py-8 pb-24">
      <h1 className="mb-6 text-2xl font-bold text-white">Today&apos;s workout</h1>

      <SectionLabel className="mb-3">Exercises</SectionLabel>
      {exercisesLoading && <p className="text-white/50">Loading exercises…</p>}
      {!exercisesLoading && (!exercises || exercises.length === 0) && (
        <p className="text-white/50">No exercises are scheduled for this workout.</p>
      )}

      <div className="mb-8 flex flex-col gap-3">
        {exercises?.map((item) => (
          <ExerciseCard key={item.planned.id} item={item} />
        ))}
      </div>

      {completeSession.isError && <p className="mb-3 text-sm text-red-400">Unable to complete this workout.</p>}

      <div className="flex flex-col gap-3">
        <Button onClick={handleComplete} disabled={completeSession.isPending}>
          {completeSession.isPending ? 'Saving…' : 'Complete workout'}
        </Button>
        <Button variant="secondary" onClick={handleAbandon} disabled={abandonSession.isPending}>
          Abandon
        </Button>
      </div>
    </div>
  )
}
