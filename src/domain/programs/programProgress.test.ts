import { describe, expect, it } from 'vitest'
import { calculateProgramProgress, nextIncompleteDay, sortProgramDays } from './programProgress'
import type { ProgramDay } from './models'

function makeDay(overrides: Partial<ProgramDay> & { id: string }): ProgramDay {
  return {
    programId: 'program-1',
    weekNumber: 1,
    dayNumber: 1,
    title: overrides.id,
    description: '',
    dayType: 'practice',
    templateId: 'template-1',
    ...overrides,
  }
}

const days: ProgramDay[] = [
  makeDay({ id: 'w1d2', weekNumber: 1, dayNumber: 2 }),
  makeDay({ id: 'w1d1', weekNumber: 1, dayNumber: 1 }),
  makeDay({ id: 'w2d1', weekNumber: 2, dayNumber: 1 }),
]

describe('sortProgramDays', () => {
  it('orders by week then day', () => {
    expect(sortProgramDays(days).map((d) => d.id)).toEqual(['w1d1', 'w1d2', 'w2d1'])
  })
})

describe('nextIncompleteDay', () => {
  it('returns the first day when nothing is completed', () => {
    expect(nextIncompleteDay(days, new Set())?.id).toBe('w1d1')
  })

  it('skips completed days in order', () => {
    expect(nextIncompleteDay(days, new Set(['w1d1']))?.id).toBe('w1d2')
  })

  it('returns null once every day is completed', () => {
    expect(nextIncompleteDay(days, new Set(['w1d1', 'w1d2', 'w2d1']))).toBeNull()
  })
})

describe('calculateProgramProgress', () => {
  it('reports 0% and the first day for a fresh enrollment', () => {
    const progress = calculateProgramProgress(days, new Set())
    expect(progress).toEqual({
      completedCount: 0,
      totalCount: 3,
      percentComplete: 0,
      currentDay: days[1], // w1d1
      isComplete: false,
    })
  })

  it('reports partial completion and the next day', () => {
    const progress = calculateProgramProgress(days, new Set(['w1d1']))
    expect(progress.completedCount).toBe(1)
    expect(progress.percentComplete).toBe(33)
    expect(progress.currentDay?.id).toBe('w1d2')
    expect(progress.isComplete).toBe(false)
  })

  it('reports 100% completion with no current day once every day is done', () => {
    const progress = calculateProgramProgress(days, new Set(['w1d1', 'w1d2', 'w2d1']))
    expect(progress.percentComplete).toBe(100)
    expect(progress.currentDay).toBeNull()
    expect(progress.isComplete).toBe(true)
  })

  it('treats an empty program as not complete', () => {
    const progress = calculateProgramProgress([], new Set())
    expect(progress.totalCount).toBe(0)
    expect(progress.isComplete).toBe(false)
  })
})
