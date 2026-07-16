import { useMemo } from 'react'
import { calculateStreaks } from '../../../domain/progress/progressCalculations'
import { useCompletedPracticeSessions } from './usePracticeHistory'

export function useStreaks() {
  const sessionsQuery = useCompletedPracticeSessions()

  const streaks = useMemo(() => {
    if (!sessionsQuery.data) return undefined
    const timestamps = sessionsQuery.data.map((session) => session.completedAt ?? session.startedAt)
    return calculateStreaks(timestamps, new Date().toISOString())
  }, [sessionsQuery.data])

  return { ...sessionsQuery, streaks }
}
