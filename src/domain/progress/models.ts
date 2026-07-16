export type RecordType = string

export const MAX_DISTANCE_RECORD_TYPE = 'max_distance'

const PUTTING_RECORD_TYPE_PATTERN = /^putting_percentage_(\d+)ft$/

export function puttingPercentageRecordType(distanceFeet: number): RecordType {
  return `putting_percentage_${distanceFeet}ft`
}

export function puttingDistanceFromRecordType(recordType: RecordType): number | null {
  const match = PUTTING_RECORD_TYPE_PATTERN.exec(recordType)
  return match ? Number(match[1]) : null
}

export interface PersonalRecord {
  id: string
  userId: string
  recordType: RecordType
  value: number
  achievedAt: string
  sourceSessionId: string | null
}

export interface NewPersonalRecordInput {
  recordType: RecordType
  value: number
  achievedAt: string
  sourceSessionId: string | null
  // The user's best value for this record type before this session, or null
  // if this is the first time it's been set. Carried alongside the upsert
  // payload so callers can render a "previous vs. new" celebration without a
  // second round trip.
  previousValue: number | null
}

export interface StreakSummary {
  currentStreak: number
  longestStreak: number
}

export interface TrendPoint {
  date: string
  value: number
}

export type TrendDirection = 'improving' | 'stable' | 'declining'

export interface TrendSummary {
  direction: TrendDirection
  // Change from the first to the last point in the series, in the trend's
  // own units (percentage points for putting trends).
  change: number
}
