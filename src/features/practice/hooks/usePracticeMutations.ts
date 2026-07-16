import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  abandonPracticeSession,
  addLogEntry,
  completePracticeSession,
  createPracticeSession,
} from '../../../services/practice.service'
import { updatePersonalRecordsForSession } from '../../../services/progress.service'
import type { NewPracticeLogEntryInput, NewPracticeSessionInput } from '../../../domain/practice/models'
import { useSession } from '../../auth/hooks/useSession'

export function useStartPracticeSession() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: NewPracticeSessionInput) => createPracticeSession(user!.id, input),
    onSuccess: (session) => {
      queryClient.setQueryData(['activePracticeSession', user?.id], session)
    },
  })
}

export function useLogEntry(sessionId: string) {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: NewPracticeLogEntryInput) => addLogEntry(user!.id, sessionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practiceLogEntries', sessionId] })
    },
  })
}

export function useCompletePracticeSession() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const session = await completePracticeSession(sessionId)
      const { brokenRecords } = await updatePersonalRecordsForSession(user!.id, sessionId)
      return { session, brokenRecords }
    },
    // Defined on the hook (not passed to a `.mutate()` call) so it's
    // guaranteed to run even if the component that triggered completion has
    // already unmounted by the time this resolves — see ActiveSessionScreen,
    // whose last-drill screen remounts around the same time this settles.
    onSuccess: ({ session, brokenRecords }, sessionId) => {
      queryClient.setQueryData(['practiceSession', session.id], session)
      queryClient.setQueryData(['activePracticeSession', user?.id], null)
      queryClient.setQueryData(['newPersonalRecords', sessionId], brokenRecords)
      queryClient.invalidateQueries({ queryKey: ['personalRecords', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['practiceSessions', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['puttingLogEntries', user?.id] })
    },
  })
}

export function useAbandonPracticeSession() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => abandonPracticeSession(sessionId),
    onSuccess: (session) => {
      queryClient.setQueryData(['practiceSession', session.id], session)
      queryClient.setQueryData(['activePracticeSession', user?.id], null)
      queryClient.invalidateQueries({ queryKey: ['practiceSessions', user?.id] })
    },
  })
}
