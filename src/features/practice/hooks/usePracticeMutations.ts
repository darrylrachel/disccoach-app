import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  abandonPracticeSession,
  addLogEntry,
  completePracticeSession,
  createPracticeSession,
} from '../../../services/practice.service'
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
    mutationFn: (sessionId: string) => completePracticeSession(sessionId),
    onSuccess: (session) => {
      queryClient.setQueryData(['practiceSession', session.id], session)
      queryClient.setQueryData(['activePracticeSession', user?.id], null)
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
    },
  })
}
