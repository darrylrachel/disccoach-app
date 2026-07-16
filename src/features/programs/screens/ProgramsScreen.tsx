import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { SectionLabel } from '../../../components/ui/SectionLabel'
import type { TrainingProgram } from '../../../domain/programs/models'
import { recommendProgramForGoal } from '../../../domain/programs/recommendation'
import { usePrograms } from '../hooks/usePrograms'
import { useActiveEnrollment, useEnrollmentHistory } from '../hooks/useProgramEnrollment'
import { PROGRAM_CATEGORY_LABELS, PROGRAM_DIFFICULTY_LABELS } from '../programLabels'
import { useProfile, useUpdateProfile } from '../../profile/hooks/useProfile'
import { PRIMARY_GOAL_LABELS, PRIMARY_GOAL_ORDER } from '../../profile/profileLabels'

function ProgramCard({ program, recommended }: { program: TrainingProgram; recommended: boolean }) {
  return (
    <Card className={`flex flex-col gap-3 ${recommended ? 'border-brand-gold/40 bg-brand-gold/5' : ''}`}>
      <div>
        {recommended && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-gold">Recommended for you</p>
        )}
        <p className="text-lg font-semibold text-white">{program.name}</p>
        <p className="mt-1 text-sm text-white/60">{program.description}</p>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-white/50">
        <span className="rounded-full border border-white/15 px-2 py-1">{program.durationWeeks} weeks</span>
        <span className="rounded-full border border-white/15 px-2 py-1">
          {program.sessionsPerWeek}x / week
        </span>
        <span className="rounded-full border border-white/15 px-2 py-1">
          {PROGRAM_DIFFICULTY_LABELS[program.difficulty]}
        </span>
        <span className="rounded-full border border-white/15 px-2 py-1">
          {PROGRAM_CATEGORY_LABELS[program.category]}
        </span>
      </div>
      <Link
        to={`/programs/${program.id}`}
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-green px-4 py-3 text-center font-semibold text-black transition-colors hover:bg-brand-green/90"
      >
        View program
      </Link>
    </Card>
  )
}

// Shown only when a profile has no primary goal yet (in practice this only
// happens for pre-onboarding data anomalies, since onboarding requires a
// goal) — picking one immediately surfaces a recommendation below.
function GoalPicker() {
  const updateProfile = useUpdateProfile()

  return (
    <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-5">
      <p className="mb-1 font-semibold text-white">Not sure where to start?</p>
      <p className="mb-4 text-sm text-white/50">Pick a goal and we&apos;ll recommend a program.</p>
      <div className="flex flex-wrap gap-2">
        {PRIMARY_GOAL_ORDER.map((goal) => (
          <button
            key={goal}
            type="button"
            onClick={() => updateProfile.mutate({ primaryGoal: goal })}
            disabled={updateProfile.isPending}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/70 transition-colors hover:border-brand-green/60 hover:text-white disabled:opacity-50"
          >
            {PRIMARY_GOAL_LABELS[goal]}
          </button>
        ))}
      </div>
      {updateProfile.isError && <p className="mt-3 text-sm text-red-400">Unable to save your goal.</p>}
    </div>
  )
}

export function ProgramsScreen() {
  const navigate = useNavigate()
  const programsQuery = usePrograms()
  const activeEnrollmentQuery = useActiveEnrollment()
  const historyQuery = useEnrollmentHistory()
  const { data: profile } = useProfile()

  const hasActiveProgram = !!activeEnrollmentQuery.data
  const recommended = recommendProgramForGoal(profile?.primaryGoal ?? null, programsQuery.data ?? [])

  return (
    <div className="px-6 py-8 pb-24">
      <h1 className="mb-2 text-2xl font-bold text-white">Training Programs</h1>
      <p className="mb-8 text-white/50">Structured, multi-week plans built from your practice sessions.</p>

      {hasActiveProgram && (
        <div className="mb-8 flex items-center justify-between gap-3 rounded-xl border border-brand-green/40 bg-brand-green/10 p-5">
          <p className="text-sm text-white">You have an active training program.</p>
          <Button className="w-auto shrink-0" onClick={() => navigate('/programs/active')}>
            Continue
          </Button>
        </div>
      )}

      {!hasActiveProgram && profile && !profile.primaryGoal && <GoalPicker />}

      {programsQuery.isLoading && <p className="text-white/50">Loading programs…</p>}
      {programsQuery.isError && <p className="text-red-400">Unable to load training programs.</p>}

      {programsQuery.data && (
        <div className="mb-8 flex flex-col gap-4">
          {programsQuery.data.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              recommended={!hasActiveProgram && program.id === recommended?.id}
            />
          ))}
        </div>
      )}

      {historyQuery.data && historyQuery.data.length > 0 && (
        <>
          <SectionLabel className="mb-3">Program history</SectionLabel>
          <div className="flex flex-col gap-2">
            {historyQuery.data.map((enrollment) => (
              <div
                key={enrollment.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <span className="text-sm text-white/70">
                  Started {new Date(enrollment.startedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    enrollment.status === 'completed'
                      ? 'bg-brand-green/15 text-brand-green'
                      : 'border border-white/20 text-white/50'
                  }`}
                >
                  {enrollment.status === 'completed' ? 'Completed' : 'Abandoned'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
