import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  abandonResistanceSession,
  completeResistanceSession,
  getActiveResistanceSession,
  getResistanceSession,
  recordResistanceDayCompletion,
  startResistanceSession,
} from '../../../services/resistanceTraining.service'
import { useSession } from '../../auth/hooks/useSession'

export function useResistanceSession(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['resistanceSession', sessionId],
    queryFn: () => getResistanceSession(sessionId!),
    enabled: !!sessionId,
  })
}

export function useActiveResistanceSession() {
  const { user } = useSession()

  return useQuery({
    queryKey: ['activeResistanceSession', user?.id],
    queryFn: () => getActiveResistanceSession(user!.id),
    enabled: !!user,
  })
}

export function useStartResistanceSession() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { programDayId?: string | null; enrollmentId?: string | null }) =>
      startResistanceSession(user!.id, input),
    onSuccess: (session) => {
      queryClient.setQueryData(['activeResistanceSession', user?.id], session)
    },
  })
}

export function useCompleteResistanceSession() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const session = await completeResistanceSession(sessionId)
      // Advances training-program progress when this session was launched
      // from a resistance program day; a no-op otherwise.
      await recordResistanceDayCompletion(session)
      return session
    },
    onSuccess: (session) => {
      queryClient.setQueryData(['resistanceSession', session.id], session)
      queryClient.setQueryData(['activeResistanceSession', user?.id], null)
      if (session.enrollmentId) {
        queryClient.invalidateQueries({ queryKey: ['activeEnrollment', user?.id] })
        queryClient.invalidateQueries({ queryKey: ['programCompletions', session.enrollmentId] })
        queryClient.invalidateQueries({ queryKey: ['enrollmentHistory', user?.id] })
      }
    },
  })
}

export function useAbandonResistanceSession() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => abandonResistanceSession(sessionId),
    onSuccess: (session) => {
      queryClient.setQueryData(['resistanceSession', session.id], session)
      queryClient.setQueryData(['activeResistanceSession', user?.id], null)
    },
  })
}
