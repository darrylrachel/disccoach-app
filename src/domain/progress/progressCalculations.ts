import type { PracticeLogEntry } from '../practice/models'
import {
  MAX_DISTANCE_RECORD_TYPE,
  puttingDistanceFromRecordType,
  puttingPercentageRecordType,
  type NewPersonalRecordInput,
  type PersonalRecord,
  type StreakSummary,
  type TrendPoint,
} from './models'

const PUTTING_DRILL_LABEL_PATTERN = /^(\d+)ft putts$/i

export function extractPuttingDistance(drillLabel: string): number | null {
  const match = PUTTING_DRILL_LABEL_PATTERN.exec(drillLabel.trim())
  return match ? Number(match[1]) : null
}

// UTC calendar-day key. Timestamps come from the server, so bucketing in
// UTC keeps this deterministic and free of local-timezone/DST arithmetic.
function toDateKey(iso: string): string {
  return iso.slice(0, 10)
}

function addDays(dateKey: string, delta: number): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  date.setUTCDate(date.getUTCDate() + delta)
  return date.toISOString().slice(0, 10)
}

// Current streak counts consecutive calendar days with a completed session,
// ending today (or yesterday, if today has no session yet so an in-progress
// streak isn't shown as broken before the day is over).
export function calculateStreaks(completedSessionTimestamps: string[], todayIso: string): StreakSummary {
  const dayKeys = Array.from(new Set(completedSessionTimestamps.map(toDateKey))).sort()
  if (dayKeys.length === 0) return { currentStreak: 0, longestStreak: 0 }

  let longestStreak = 1
  let run = 1
  for (let i = 1; i < dayKeys.length; i++) {
    run = addDays(dayKeys[i - 1], 1) === dayKeys[i] ? run + 1 : 1
    longestStreak = Math.max(longestStreak, run)
  }

  const daySet = new Set(dayKeys)
  let cursor = toDateKey(todayIso)
  if (!daySet.has(cursor)) cursor = addDays(cursor, -1)

  let currentStreak = 0
  while (daySet.has(cursor)) {
    currentStreak += 1
    cursor = addDays(cursor, -1)
  }

  return { currentStreak, longestStreak }
}

export function puttingDistancesInEntries(logEntries: PracticeLogEntry[]): number[] {
  const distances = new Set<number>()
  for (const entry of logEntries) {
    const distance = extractPuttingDistance(entry.drillLabel)
    if (distance !== null) distances.add(distance)
  }
  return Array.from(distances).sort((a, b) => a - b)
}

// Daily putting make-percentage at one distance, for trend charts. Multiple
// entries logged for the same distance on the same day are pooled before
// computing the percentage, rather than averaged per-entry.
export function calculatePuttingTrend(logEntries: PracticeLogEntry[], distanceFeet: number): TrendPoint[] {
  const byDay = new Map<string, { makes: number; attempts: number }>()

  for (const entry of logEntries) {
    if (entry.metricType !== 'makes_attempts') continue
    if (extractPuttingDistance(entry.drillLabel) !== distanceFeet) continue
    if (entry.attempts === null || entry.makes === null || entry.attempts === 0) continue

    const day = toDateKey(entry.loggedAt)
    const existing = byDay.get(day)
    if (existing) {
      existing.makes += entry.makes
      existing.attempts += entry.attempts
    } else {
      byDay.set(day, { makes: entry.makes, attempts: entry.attempts })
    }
  }

  return Array.from(byDay.entries())
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([date, { makes, attempts }]) => ({ date, value: Math.round((makes / attempts) * 100) }))
}

function detectDistancePR(
  sessionId: string,
  logEntries: PracticeLogEntry[],
  currentBest: number | null,
): NewPersonalRecordInput | null {
  let best: PracticeLogEntry | null = null
  for (const entry of logEntries) {
    if (entry.metricType !== 'distance_feet' || entry.distanceFeet === null) continue
    if (!best || entry.distanceFeet > best.distanceFeet!) best = entry
  }
  if (!best || best.distanceFeet === null) return null
  if (currentBest !== null && best.distanceFeet <= currentBest) return null

  return {
    recordType: MAX_DISTANCE_RECORD_TYPE,
    value: best.distanceFeet,
    achievedAt: best.loggedAt,
    sourceSessionId: sessionId,
  }
}

function detectPuttingPercentagePRs(
  sessionId: string,
  logEntries: PracticeLogEntry[],
  currentBestByDistance: Map<number, number>,
): NewPersonalRecordInput[] {
  const byDistance = new Map<number, { makes: number; attempts: number; loggedAt: string }>()

  for (const entry of logEntries) {
    if (entry.metricType !== 'makes_attempts') continue
    const distance = extractPuttingDistance(entry.drillLabel)
    if (distance === null || entry.attempts === null || entry.makes === null || entry.attempts === 0) continue

    const existing = byDistance.get(distance)
    if (existing) {
      existing.makes += entry.makes
      existing.attempts += entry.attempts
    } else {
      byDistance.set(distance, { makes: entry.makes, attempts: entry.attempts, loggedAt: entry.loggedAt })
    }
  }

  const records: NewPersonalRecordInput[] = []
  for (const [distance, { makes, attempts, loggedAt }] of byDistance) {
    const percentage = Math.round((makes / attempts) * 100)
    const currentBest = currentBestByDistance.get(distance) ?? null
    if (currentBest !== null && percentage <= currentBest) continue

    records.push({
      recordType: puttingPercentageRecordType(distance),
      value: percentage,
      achievedAt: loggedAt,
      sourceSessionId: sessionId,
    })
  }

  return records
}

// Given a just-completed session's log entries and the user's existing PRs,
// returns only the records that were actually beaten (empty if none were).
export function detectSessionRecords(
  sessionId: string,
  logEntries: PracticeLogEntry[],
  existingRecords: PersonalRecord[],
): NewPersonalRecordInput[] {
  const existingByType = new Map(existingRecords.map((r) => [r.recordType, r.value]))

  const puttingBests = new Map<number, number>()
  for (const [recordType, value] of existingByType) {
    const distance = puttingDistanceFromRecordType(recordType)
    if (distance !== null) puttingBests.set(distance, value)
  }

  const distancePR = detectDistancePR(sessionId, logEntries, existingByType.get(MAX_DISTANCE_RECORD_TYPE) ?? null)
  const puttingPRs = detectPuttingPercentagePRs(sessionId, logEntries, puttingBests)

  return distancePR ? [distancePR, ...puttingPRs] : puttingPRs
}
