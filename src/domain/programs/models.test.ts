import { describe, expect, it } from 'vitest'
import { programDayLabel } from './models'

describe('programDayLabel', () => {
  it('formats week and day number', () => {
    expect(programDayLabel({ weekNumber: 2, dayNumber: 3 })).toBe('Week 2 Day 3')
  })
})
