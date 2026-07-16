import { useQuery } from '@tanstack/react-query'
import { listPracticeSessionsForUser, listPuttingLogEntriesForUser } from '../../../services/practice.service'
import { useSession } from '../../auth/hooks/useSession'

const PAST_SESSION_STATUSES = ['completed', 'abandoned'] as const

export function useRecentPracticeSessions(limit = 5) {
  const { user } = useSession()

  return useQuery({
    queryKey: ['practiceSessions', user?.id, 'recent', limit],
    queryFn: () => listPracticeSessionsForUser(user!.id, { statuses: [...PAST_SESSION_STATUSES], limit }),
    enabled: !!user,
  })
}

export function usePracticeHistory() {
  const { user } = useSession()

  return useQuery({
    queryKey: ['practiceSessions', user?.id, 'history'],
    queryFn: () => listPracticeSessionsForUser(user!.id, { statuses: [...PAST_SESSION_STATUSES] }),
    enabled: !!user,
  })
}

export function useCompletedPracticeSessions() {
  const { user } = useSession()

  return useQuery({
    queryKey: ['practiceSessions', user?.id, 'completed'],
    queryFn: () => listPracticeSessionsForUser(user!.id, { statuses: ['completed'] }),
    enabled: !!user,
  })
}

export function usePuttingLogEntries() {
  const { user } = useSession()

  return useQuery({
    queryKey: ['puttingLogEntries', user?.id],
    queryFn: () => listPuttingLogEntriesForUser(user!.id),
    enabled: !!user,
  })
}
