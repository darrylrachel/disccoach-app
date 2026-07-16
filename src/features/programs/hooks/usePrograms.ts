import { useQuery } from '@tanstack/react-query'
import { getTrainingProgram, listProgramDays, listTrainingPrograms } from '../../../services/programs.service'

export function usePrograms() {
  return useQuery({
    queryKey: ['trainingPrograms'],
    queryFn: listTrainingPrograms,
  })
}

export function useProgram(programId: string | undefined) {
  return useQuery({
    queryKey: ['trainingProgram', programId],
    queryFn: () => getTrainingProgram(programId!),
    enabled: !!programId,
  })
}

export function useProgramDays(programId: string | undefined) {
  return useQuery({
    queryKey: ['programDays', programId],
    queryFn: () => listProgramDays(programId!),
    enabled: !!programId,
  })
}
