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
}

export interface StreakSummary {
  currentStreak: number
  longestStreak: number
}

export interface TrendPoint {
  date: string
  value: number
}
