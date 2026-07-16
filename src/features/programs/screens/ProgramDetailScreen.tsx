import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { SectionLabel } from '../../../components/ui/SectionLabel'
import type { ProgramDay } from '../../../domain/programs/models'
import { sortProgramDays } from '../../../domain/programs/programProgress'
import { useProgram, useProgramDays } from '../hooks/usePrograms'
import { useActiveEnrollment } from '../hooks/useProgramEnrollment'
import { useEnrollInProgram } from '../hooks/useProgramMutations'
import { PROGRAM_DIFFICULTY_LABELS } from '../programLabels'

function groupByWeek(days: ProgramDay[]): Map<number, ProgramDay[]> {
  const groups = new Map<number, ProgramDay[]>()
  for (const day of sortProgramDays(days)) {
    const list = groups.get(day.weekNumber) ?? []
    list.push(day)
    groups.set(day.weekNumber, list)
  }
  return groups
}

export function ProgramDetailScreen() {
  const { programId } = useParams<{ programId: string }>()
  const navigate = useNavigate()

  const { data: program, isLoading: programLoading, isError: programError } = useProgram(programId)
  const { data: days, isLoading: daysLoading } = useProgramDays(programId)
  const activeEnrollmentQuery = useActiveEnrollment()
  const enrollInProgram = useEnrollInProgram()

  const weeks = useMemo(() => groupByWeek(days ?? []), [days])

  if (programLoading || daysLoading) {
    return <div className="px-6 py-8 text-white/50">Loading program…</div>
  }
  if (programError || !program || !programId) {
    return <div className="px-6 py-8 text-red-400">Program not found.</div>
  }

  const activeEnrollment = activeEnrollmentQuery.data
  const isThisProgramActive = activeEnrollment?.programId === programId
  const anotherProgramActive = !!activeEnrollment && !isThisProgramActive

  function handleStart() {
    if (!programId) return
    enrollInProgram.mutate(programId, { onSuccess: () => navigate('/programs/active') })
  }

  return (
    <div className="px-6 py-8 pb-24">
      <h1 className="mb-2 text-2xl font-bold text-white">{program.name}</h1>
      <p className="mb-6 text-white/60">{program.description}</p>

      <div className="mb-8 grid grid-cols-3 gap-3">
        <Card>
          <p className="text-xl font-bold text-white">{program.durationWeeks}</p>
          <SectionLabel>Weeks</SectionLabel>
        </Card>
        <Card>
          <p className="text-xl font-bold text-white">{program.sessionsPerWeek}x</p>
          <SectionLabel>Per week</SectionLabel>
        </Card>
        <Card>
          <p className="text-xl font-bold text-white">{PROGRAM_DIFFICULTY_LABELS[program.difficulty]}</p>
          <SectionLabel>Level</SectionLabel>
        </Card>
      </div>

      {isThisProgramActive ? (
        <Button onClick={() => navigate('/programs/active')}>Continue program</Button>
      ) : (
        <>
          <Button onClick={handleStart} disabled={anotherProgramActive || enrollInProgram.isPending}>
            {enrollInProgram.isPending ? 'Starting…' : 'Start program'}
          </Button>
          {anotherProgramActive && (
            <p className="mt-3 text-sm text-white/50">
              You already have an active program. Finish or abandon it before starting a new one.
            </p>
          )}
          {enrollInProgram.isError && <p className="mt-3 text-sm text-red-400">Unable to start this program.</p>}
        </>
      )}

      <SectionLabel className="mb-3 mt-8">Weekly structure</SectionLabel>
      <div className="flex flex-col gap-4">
        {Array.from(weeks.entries()).map(([weekNumber, weekDays]) => (
          <div key={weekNumber}>
            <p className="mb-2 text-sm font-semibold text-white/70">Week {weekNumber}</p>
            <div className="flex flex-col gap-2">
              {weekDays.map((day) => (
                <div key={day.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="font-medium text-white">{day.title}</p>
                  <p className="text-sm text-white/50">{day.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
