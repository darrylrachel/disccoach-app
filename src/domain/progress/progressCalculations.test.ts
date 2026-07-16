import { describe, expect, it } from 'vitest'
import {
  calculatePuttingTrend,
  calculateStreaks,
  detectSessionRecords,
  extractPuttingDistance,
  puttingDistancesInEntries,
} from './progressCalculations'
import type { PersonalRecord } from './models'
import type { PracticeLogEntry } from '../practice/models'

function makeEntry(overrides: Partial<PracticeLogEntry> & { id: string }): PracticeLogEntry {
  return {
    sessionId: 'session-1',
    userId: 'user-1',
    drillLabel: '15ft putts',
    metricType: 'makes_attempts',
    attempts: 10,
    makes: 8,
    distanceFeet: null,
    notes: null,
    loggedAt: '2026-07-10T12:00:00.000Z',
    ...overrides,
  }
}

function makeRecord(overrides: Partial<PersonalRecord> & { id: string; recordType: string; value: number }): PersonalRecord {
  return {
    userId: 'user-1',
    achievedAt: '2026-07-01T12:00:00.000Z',
    sourceSessionId: null,
    ...overrides,
  }
}

describe('extractPuttingDistance', () => {
  it('parses a standard putting drill label', () => {
    expect(extractPuttingDistance('20ft putts')).toBe(20)
  })

  it('returns null for non-putting labels', () => {
    expect(extractPuttingDistance('Backhand distance throws')).toBeNull()
    expect(extractPuttingDistance('Warm-up circle putts (10ft)')).toBeNull()
  })
})

describe('puttingDistancesInEntries', () => {
  it('returns sorted, deduplicated distances present in the entries', () => {
    const entries = [
      makeEntry({ id: '1', drillLabel: '20ft putts' }),
      makeEntry({ id: '2', drillLabel: '15ft putts' }),
      makeEntry({ id: '3', drillLabel: '20ft putts' }),
      makeEntry({ id: '4', drillLabel: 'Footwork/stance reps' }),
    ]
    expect(puttingDistancesInEntries(entries)).toEqual([15, 20])
  })
})

describe('calculateStreaks', () => {
  it('counts a current streak ending today', () => {
    const streaks = calculateStreaks(
      ['2026-07-14T10:00:00Z', '2026-07-15T10:00:00Z', '2026-07-16T09:00:00Z'],
      '2026-07-16T18:00:00Z',
    )
    expect(streaks).toEqual({ currentStreak: 3, longestStreak: 3 })
  })

  it('still counts yesterday as current streak if nothing logged yet today', () => {
    const streaks = calculateStreaks(['2026-07-14T10:00:00Z', '2026-07-15T10:00:00Z'], '2026-07-16T08:00:00Z')
    expect(streaks).toEqual({ currentStreak: 2, longestStreak: 2 })
  })

  it('resets current streak to 0 once a day is missed', () => {
    const streaks = calculateStreaks(['2026-07-10T10:00:00Z'], '2026-07-16T08:00:00Z')
    expect(streaks).toEqual({ currentStreak: 0, longestStreak: 1 })
  })

  it('finds the longest streak even when it is not the current one', () => {
    const streaks = calculateStreaks(
      [
        '2026-07-01T10:00:00Z',
        '2026-07-02T10:00:00Z',
        '2026-07-03T10:00:00Z',
        '2026-07-04T10:00:00Z',
        '2026-07-16T10:00:00Z',
      ],
      '2026-07-16T18:00:00Z',
    )
    expect(streaks).toEqual({ currentStreak: 1, longestStreak: 4 })
  })

  it('returns zeros when there are no sessions', () => {
    expect(calculateStreaks([], '2026-07-16T18:00:00Z')).toEqual({ currentStreak: 0, longestStreak: 0 })
  })

  it('pools multiple sessions on the same day into one streak day', () => {
    const streaks = calculateStreaks(
      ['2026-07-16T08:00:00Z', '2026-07-16T18:00:00Z', '2026-07-15T08:00:00Z'],
      '2026-07-16T20:00:00Z',
    )
    expect(streaks).toEqual({ currentStreak: 2, longestStreak: 2 })
  })
})

describe('calculatePuttingTrend', () => {
  it('pools same-day entries at the target distance and sorts by date', () => {
    const entries = [
      makeEntry({ id: '1', drillLabel: '15ft putts', attempts: 10, makes: 5, loggedAt: '2026-07-11T10:00:00Z' }),
      makeEntry({ id: '2', drillLabel: '15ft putts', attempts: 10, makes: 9, loggedAt: '2026-07-10T10:00:00Z' }),
      makeEntry({ id: '3', drillLabel: '15ft putts', attempts: 10, makes: 6, loggedAt: '2026-07-10T14:00:00Z' }),
      makeEntry({ id: '4', drillLabel: '20ft putts', attempts: 10, makes: 1, loggedAt: '2026-07-10T14:00:00Z' }),
    ]
    expect(calculatePuttingTrend(entries, 15)).toEqual([
      { date: '2026-07-10', value: 75 },
      { date: '2026-07-11', value: 50 },
    ])
  })

  it('ignores entries with zero attempts', () => {
    const entries = [makeEntry({ id: '1', drillLabel: '15ft putts', attempts: 0, makes: 0 })]
    expect(calculatePuttingTrend(entries, 15)).toEqual([])
  })
})

describe('detectSessionRecords', () => {
  it('reports a new max_distance PR when no prior record exists', () => {
    const entries = [
      makeEntry({ id: '1', metricType: 'distance_feet', distanceFeet: 320, drillLabel: 'Backhand distance throws' }),
      makeEntry({ id: '2', metricType: 'distance_feet', distanceFeet: 350, drillLabel: 'Max effort throws' }),
    ]
    const records = detectSessionRecords('session-1', entries, [])
    expect(records).toEqual([
      { recordType: 'max_distance', value: 350, achievedAt: entries[1].loggedAt, sourceSessionId: 'session-1' },
    ])
  })

  it('does not report a distance PR that does not beat the existing best', () => {
    const entries = [makeEntry({ id: '1', metricType: 'distance_feet', distanceFeet: 300 })]
    const existing = [makeRecord({ id: 'pr-1', recordType: 'max_distance', value: 320 })]
    expect(detectSessionRecords('session-1', entries, existing)).toEqual([])
  })

  it('reports putting percentage PRs per distance, only when beaten', () => {
    const entries = [
      makeEntry({ id: '1', drillLabel: '15ft putts', attempts: 10, makes: 9 }),
      makeEntry({ id: '2', drillLabel: '20ft putts', attempts: 10, makes: 4 }),
    ]
    const existing = [
      makeRecord({ id: 'pr-1', recordType: 'putting_percentage_15ft', value: 80 }),
      makeRecord({ id: 'pr-2', recordType: 'putting_percentage_20ft', value: 60 }),
    ]
    const records = detectSessionRecords('session-1', entries, existing)
    expect(records).toEqual([
      { recordType: 'putting_percentage_15ft', value: 90, achievedAt: entries[0].loggedAt, sourceSessionId: 'session-1' },
    ])
  })

  it('pools multiple entries at the same distance before comparing to the PR', () => {
    const entries = [
      makeEntry({ id: '1', drillLabel: '15ft putts', attempts: 10, makes: 5, loggedAt: '2026-07-16T10:00:00Z' }),
      makeEntry({ id: '2', drillLabel: '15ft putts', attempts: 10, makes: 9, loggedAt: '2026-07-16T10:05:00Z' }),
    ]
    const records = detectSessionRecords('session-1', entries, [])
    expect(records).toEqual([
      { recordType: 'putting_percentage_15ft', value: 70, achievedAt: '2026-07-16T10:00:00Z', sourceSessionId: 'session-1' },
    ])
  })

  it('returns an empty array when nothing was beaten', () => {
    const entries = [makeEntry({ id: '1', metricType: 'completed_boolean', drillLabel: 'Scramble putts' })]
    expect(detectSessionRecords('session-1', entries, [])).toEqual([])
  })
})
