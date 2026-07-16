import type { ProgramDay } from './models'

export function sortProgramDays(days: ProgramDay[]): ProgramDay[] {
  return [...days].sort((a, b) => a.weekNumber - b.weekNumber || a.dayNumber - b.dayNumber)
}

// The earliest day (by week/day order) not yet in the completed set — null
// once every day has been completed.
export function nextIncompleteDay(days: ProgramDay[], completedDayIds: ReadonlySet<string>): ProgramDay | null {
  const sorted = sortProgramDays(days)
  return sorted.find((day) => !completedDayIds.has(day.id)) ?? null
}

export interface ProgramProgress {
  completedCount: number
  totalCount: number
  percentComplete: number
  currentDay: ProgramDay | null
  isComplete: boolean
}

// Progress is derived at read time from the day list + completion set
// rather than stored, so it can never drift out of sync (same approach as
// domain/bag/bagAnalysis.ts).
export function calculateProgramProgress(
  days: ProgramDay[],
  completedDayIds: ReadonlySet<string>,
): ProgramProgress {
  const totalCount = days.length
  const completedCount = days.filter((day) => completedDayIds.has(day.id)).length

  return {
    completedCount,
    totalCount,
    percentComplete: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    currentDay: nextIncompleteDay(days, completedDayIds),
    isComplete: totalCount > 0 && completedCount >= totalCount,
  }
}
