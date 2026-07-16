import { useMemo } from 'react'
import { calculatePuttingTrend, puttingDistancesInEntries } from '../../../domain/progress/progressCalculations'
import type { TrendPoint } from '../../../domain/progress/models'
import { usePuttingLogEntries } from './usePracticeHistory'

export function usePuttingTrend() {
  const entriesQuery = usePuttingLogEntries()

  const distances = useMemo(
    () => (entriesQuery.data ? puttingDistancesInEntries(entriesQuery.data) : []),
    [entriesQuery.data],
  )

  function trendFor(distanceFeet: number): TrendPoint[] {
    return entriesQuery.data ? calculatePuttingTrend(entriesQuery.data, distanceFeet) : []
  }

  return { ...entriesQuery, distances, trendFor }
}
