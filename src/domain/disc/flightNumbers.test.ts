import { describe, expect, it } from 'vitest'
import { categorizeStability, resolveEffectiveFlightNumbers } from './flightNumbers'
import type { Disc } from './models'

function makeDisc(overrides: Partial<Disc> = {}): Pick<
  Disc,
  'personalSpeed' | 'personalGlide' | 'personalTurn' | 'personalFade'
> {
  return {
    personalSpeed: null,
    personalGlide: null,
    personalTurn: null,
    personalFade: null,
    ...overrides,
  }
}

describe('categorizeStability', () => {
  it('classifies very understable at the low boundary', () => {
    expect(categorizeStability(-5, 1)).toBe('very_understable')
    expect(categorizeStability(-4, 0)).toBe('very_understable')
  })

  it('classifies understable', () => {
    expect(categorizeStability(-3, 0)).toBe('understable')
    expect(categorizeStability(-1, 0)).toBe('understable')
  })

  it('classifies stable', () => {
    expect(categorizeStability(0, 0)).toBe('stable')
    expect(categorizeStability(-1, 1)).toBe('stable')
    expect(categorizeStability(0, 1)).toBe('stable')
  })

  it('classifies overstable', () => {
    expect(categorizeStability(0, 2)).toBe('overstable')
    expect(categorizeStability(-1, 3)).toBe('overstable')
  })

  it('classifies very overstable above the high boundary', () => {
    expect(categorizeStability(0, 4)).toBe('very_overstable')
    expect(categorizeStability(1, 4)).toBe('very_overstable')
  })
})

describe('resolveEffectiveFlightNumbers', () => {
  const catalogEntry = { speed: 9, glide: 5, turn: -1, fade: 2 }

  it('falls back to the catalog entry when no personal numbers are set', () => {
    expect(resolveEffectiveFlightNumbers(makeDisc(), catalogEntry)).toEqual(catalogEntry)
  })

  it('uses personal overrides per-axis, falling back for unset axes', () => {
    const disc = makeDisc({ personalTurn: -3, personalFade: 3 })
    expect(resolveEffectiveFlightNumbers(disc, catalogEntry)).toEqual({
      speed: 9,
      glide: 5,
      turn: -3,
      fade: 3,
    })
  })

  it('returns nulls for axes with neither a personal number nor a catalog entry', () => {
    const disc = makeDisc({ personalSpeed: 8 })
    expect(resolveEffectiveFlightNumbers(disc, null)).toEqual({
      speed: 8,
      glide: null,
      turn: null,
      fade: null,
    })
  })
})
