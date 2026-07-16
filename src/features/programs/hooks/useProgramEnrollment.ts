import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getActiveEnrollment,
  listCompletionsForEnrollment,
  listEnrollmentHistory,
} from '../../../services/programs.service'
import { calculateProgramProgress } from '../../../domain/programs/programProgress'
import { useSession } from '../../auth/hooks/useSession'
import { useProgramDays } from './usePrograms'

export function useActiveEnrollment() {
  const { user } = useSession()

  return useQuery({
    queryKey: ['activeEnrollment', user?.id],
    queryFn: () => getActiveEnrollment(user!.id),
    enabled: !!user,
  })
}

export function useEnrollmentHistory() {
  const { user } = useSession()

  return useQuery({
    queryKey: ['enrollmentHistory', user?.id],
    queryFn: () => listEnrollmentHistory(user!.id),
    enabled: !!user,
  })
}

export function useEnrollmentCompletions(enrollmentId: string | undefined) {
  return useQuery({
    queryKey: ['programCompletions', enrollmentId],
    queryFn: () => listCompletionsForEnrollment(enrollmentId!),
    enabled: !!enrollmentId,
  })
}

// Combines a program's day list with an enrollment's completions into the
// derived progress readout (percent, current day, done) — same
// "compute at read time" approach as useBagAnalysis.
export function useProgramProgress(programId: string | undefined, enrollmentId: string | undefined) {
  const daysQuery = useProgramDays(programId)
  const completionsQuery = useEnrollmentCompletions(enrollmentId)

  const progress = useMemo(() => {
    if (!daysQuery.data || !completionsQuery.data) return undefined
    const completedDayIds = new Set(completionsQuery.data.map((c) => c.programDayId))
    return calculateProgramProgress(daysQuery.data, completedDayIds)
  }, [daysQuery.data, completionsQuery.data])

  return {
    progress,
    isLoading: daysQuery.isLoading || completionsQuery.isLoading,
    isError: daysQuery.isError || completionsQuery.isError,
  }
}
