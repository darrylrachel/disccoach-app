import { useMutation, useQueryClient } from '@tanstack/react-query'
import { abandonEnrollment, enrollInProgram } from '../../../services/programs.service'
import { useSession } from '../../auth/hooks/useSession'

export function useEnrollInProgram() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (programId: string) => enrollInProgram(user!.id, programId),
    onSuccess: (enrollment) => {
      queryClient.setQueryData(['activeEnrollment', user?.id], enrollment)
      queryClient.invalidateQueries({ queryKey: ['enrollmentHistory', user?.id] })
    },
  })
}

export function useAbandonEnrollment() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (enrollmentId: string) => abandonEnrollment(enrollmentId),
    onSuccess: () => {
      queryClient.setQueryData(['activeEnrollment', user?.id], null)
      queryClient.invalidateQueries({ queryKey: ['enrollmentHistory', user?.id] })
    },
  })
}
