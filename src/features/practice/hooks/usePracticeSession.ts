import { useQuery } from '@tanstack/react-query'
import {
  getActivePracticeSession,
  getPracticeSession,
  listSessionLogEntries,
} from '../../../services/practice.service'
import { useSession } from '../../auth/hooks/useSession'

export function usePracticeSession(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['practiceSession', sessionId],
    queryFn: () => getPracticeSession(sessionId!),
    enabled: !!sessionId,
  })
}

export function useActivePracticeSession() {
  const { user } = useSession()

  return useQuery({
    queryKey: ['activePracticeSession', user?.id],
    queryFn: () => getActivePracticeSession(user!.id),
    enabled: !!user,
  })
}

export function useSessionLogEntries(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['practiceLogEntries', sessionId],
    queryFn: () => listSessionLogEntries(sessionId!),
    enabled: !!sessionId,
  })
}
