import { useMemo } from 'react'
import { calculateStreaks, toDateKey } from '../../../domain/progress/progressCalculations'
import { useCompletedPracticeSessions } from './usePracticeHistory'

export function useStreaks() {
  const sessionsQuery = useCompletedPracticeSessions()

  const streaks = useMemo(() => {
    if (!sessionsQuery.data) return undefined
    const timestamps = sessionsQuery.data.map((session) => session.completedAt ?? session.startedAt)
    return calculateStreaks(timestamps, new Date().toISOString())
  }, [sessionsQuery.data])

  const practicedToday = useMemo(() => {
    if (!sessionsQuery.data) return false
    const todayKey = toDateKey(new Date().toISOString())
    return sessionsQuery.data.some((session) => toDateKey(session.completedAt ?? session.startedAt) === todayKey)
  }, [sessionsQuery.data])

  return { ...sessionsQuery, streaks, practicedToday }
}
