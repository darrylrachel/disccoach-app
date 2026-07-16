import { describe, expect, it } from 'vitest'
import {
  analyzeBag,
  analyzeShotShapeCoverage,
  analyzeSpeedBandCoverage,
  analyzeStabilityCoverage,
  countBySlot,
  detectOverlaps,
  detectShotShapeInsights,
  detectSpeedGaps,
  detectStabilityInsights,
  type AnalyzedDisc,
} from './bagAnalysis'

function makeDisc(overrides: Partial<AnalyzedDisc> & { id: string }): AnalyzedDisc {
  return {
    name: overrides.id,
    slot: 'midrange',
    speed: 5,
    glide: 5,
    turn: 0,
    fade: 1,
    ...overrides,
  }
}

describe('analyzeSpeedBandCoverage', () => {
  it('buckets discs into low/mid/high speed bands', () => {
    const discs = [
      makeDisc({ id: 'a', speed: 2 }),
      makeDisc({ id: 'b', speed: 5 }),
      makeDisc({ id: 'c', speed: 5 }),
      makeDisc({ id: 'd', speed: 12 }),
    ]
    const coverage = analyzeSpeedBandCoverage(discs)
    expect(coverage).toEqual([
      { band: 'low', rangeStart: 1, rangeEnd: 3, count: 1 },
      { band: 'mid', rangeStart: 4, rangeEnd: 6, count: 2 },
      { band: 'high', rangeStart: 7, rangeEnd: 14, count: 1 },
    ])
  })

  it('ignores discs with unresolved speed', () => {
    const discs = [makeDisc({ id: 'a', speed: null })]
    const coverage = analyzeSpeedBandCoverage(discs)
    expect(coverage.every((c) => c.count === 0)).toBe(true)
  })
})

describe('detectSpeedGaps', () => {
  it('flags a bin with exactly one disc as limited', () => {
    const discs = [
      makeDisc({ id: 'a', speed: 2 }),
      makeDisc({ id: 'b', speed: 2 }),
      makeDisc({ id: 'c', speed: 7 }),
    ]
    const gaps = detectSpeedGaps(discs)
    expect(gaps).toContainEqual({
      rangeStart: 7,
      rangeEnd: 9,
      count: 1,
      message: 'You have limited options between speed 7-9.',
    })
  })

  it('flags an empty bin as no discs', () => {
    const discs = [makeDisc({ id: 'a', speed: 2 })]
    const gaps = detectSpeedGaps(discs)
    expect(gaps).toContainEqual({
      rangeStart: 10,
      rangeEnd: 12,
      count: 0,
      message: 'You have no discs between speed 10-12.',
    })
  })

  it('does not flag a bin with two or more discs', () => {
    const discs = [
      makeDisc({ id: 'a', speed: 7 }),
      makeDisc({ id: 'b', speed: 8 }),
    ]
    const gaps = detectSpeedGaps(discs)
    expect(gaps.find((g) => g.rangeStart === 7)).toBeUndefined()
  })

  it('returns no gaps for an empty bag', () => {
    expect(detectSpeedGaps([])).toEqual([])
  })
})

describe('analyzeStabilityCoverage', () => {
  it('classifies discs into understable/neutral/overstable bands', () => {
    const discs = [
      makeDisc({ id: 'a', turn: -3, fade: 0 }), // understable
      makeDisc({ id: 'b', turn: 0, fade: 0 }), // neutral
      makeDisc({ id: 'c', turn: 0, fade: 3 }), // overstable
      makeDisc({ id: 'd', turn: -1, fade: 4 }), // overstable (very_overstable)
    ]
    const coverage = analyzeStabilityCoverage(discs)
    expect(coverage).toEqual([
      { band: 'understable', count: 1 },
      { band: 'neutral', count: 1 },
      { band: 'overstable', count: 2 },
    ])
  })

  it('ignores discs with unresolved turn/fade', () => {
    const coverage = analyzeStabilityCoverage([makeDisc({ id: 'a', turn: null, fade: null })])
    expect(coverage.every((c) => c.count === 0)).toBe(true)
  })
})

describe('detectStabilityInsights', () => {
  it('flags overstable-heavy bags with limited neutral options', () => {
    const discs = [
      makeDisc({ id: 'a', turn: 0, fade: 3 }),
      makeDisc({ id: 'b', turn: 0, fade: 3 }),
      makeDisc({ id: 'c', turn: 0, fade: 4 }),
    ]
    const insights = detectStabilityInsights(discs)
    expect(insights.map((i) => i.message)).toContain(
      'Your bag has several overstable discs but limited neutral options.',
    )
  })

  it('flags a bag with no understable discs', () => {
    const discs = [
      makeDisc({ id: 'a', turn: 0, fade: 1 }),
      makeDisc({ id: 'b', turn: 0, fade: 2 }),
      makeDisc({ id: 'c', turn: 0, fade: 3 }),
    ]
    const insights = detectStabilityInsights(discs)
    expect(insights.some((i) => i.id === 'stability-no-understable')).toBe(true)
  })

  it('produces no insights for a small, well-balanced bag', () => {
    const discs = [
      makeDisc({ id: 'a', turn: -2, fade: 0 }),
      makeDisc({ id: 'b', turn: 0, fade: 0 }),
    ]
    expect(detectStabilityInsights(discs)).toEqual([])
  })
})

describe('detectOverlaps', () => {
  it('groups two discs with near-identical flight numbers', () => {
    const discs = [
      makeDisc({ id: 'a', name: 'Firebird', speed: 9, glide: 3, turn: 0, fade: 3 }),
      makeDisc({ id: 'b', name: 'Wraith', speed: 9.5, glide: 3, turn: -1, fade: 3 }),
    ]
    const overlaps = detectOverlaps(discs)
    expect(overlaps).toHaveLength(1)
    expect(overlaps[0].discIds.sort()).toEqual(['a', 'b'])
    expect(overlaps[0].message).toBe('Firebird and Wraith occupy a similar flight slot.')
  })

  it('does not group discs with clearly different flight numbers', () => {
    const discs = [
      makeDisc({ id: 'a', speed: 2, glide: 3, turn: 0, fade: 1 }),
      makeDisc({ id: 'b', speed: 12, glide: 5, turn: -3, fade: 3 }),
    ]
    expect(detectOverlaps(discs)).toEqual([])
  })

  it('transitively groups three overlapping discs into one group', () => {
    const discs = [
      makeDisc({ id: 'a', name: 'A', speed: 7, glide: 5, turn: 0, fade: 2 }),
      makeDisc({ id: 'b', name: 'B', speed: 7.5, glide: 5, turn: 0, fade: 2 }),
      makeDisc({ id: 'c', name: 'C', speed: 8, glide: 5, turn: 0, fade: 2 }),
    ]
    const overlaps = detectOverlaps(discs)
    expect(overlaps).toHaveLength(1)
    expect(overlaps[0].discIds.sort()).toEqual(['a', 'b', 'c'])
  })

  it('ignores discs with unresolved flight numbers', () => {
    const discs = [
      makeDisc({ id: 'a', speed: null }),
      makeDisc({ id: 'b', speed: 5 }),
    ]
    expect(detectOverlaps(discs)).toEqual([])
  })
})

describe('analyzeShotShapeCoverage / detectShotShapeInsights', () => {
  it('marks a shape uncovered when no discs qualify', () => {
    const discs = [makeDisc({ id: 'a', slot: 'putting_putter', turn: 0, fade: 1 })]
    const coverage = analyzeShotShapeCoverage(discs)
    const distance = coverage.find((c) => c.shape === 'distance')!
    expect(distance.covered).toBe(false)

    const insights = detectShotShapeInsights(discs)
    expect(insights.some((i) => i.id === 'shot-shape-missing-distance')).toBe(true)
  })

  it('marks a shape covered when a qualifying disc exists', () => {
    const discs = [
      makeDisc({ id: 'a', slot: 'distance_driver', speed: 12, turn: -1, fade: 2 }),
    ]
    const coverage = analyzeShotShapeCoverage(discs)
    expect(coverage.find((c) => c.shape === 'distance')!.covered).toBe(true)
  })

  it('covers turnover shots with understable discs and hyzer with overstable ones', () => {
    const discs = [
      makeDisc({ id: 'a', turn: -3, fade: 0 }),
      makeDisc({ id: 'b', turn: 0, fade: 3 }),
    ]
    const coverage = analyzeShotShapeCoverage(discs)
    expect(coverage.find((c) => c.shape === 'turnover')!.discIds).toEqual(['a'])
    expect(coverage.find((c) => c.shape === 'hyzer')!.discIds).toEqual(['b'])
  })
})

describe('countBySlot', () => {
  it('counts discs per slot, including empty slots', () => {
    const discs = [
      makeDisc({ id: 'a', slot: 'putting_putter' }),
      makeDisc({ id: 'b', slot: 'putting_putter' }),
      makeDisc({ id: 'c', slot: 'distance_driver' }),
    ]
    const coverage = countBySlot(discs)
    expect(coverage.find((c) => c.slot === 'putting_putter')!.count).toBe(2)
    expect(coverage.find((c) => c.slot === 'distance_driver')!.count).toBe(1)
    expect(coverage.find((c) => c.slot === 'midrange')!.count).toBe(0)
    expect(coverage).toHaveLength(6)
  })
})

describe('analyzeBag', () => {
  it('returns an empty analysis for an empty bag', () => {
    const analysis = analyzeBag([])
    expect(analysis.discCount).toBe(0)
    expect(analysis.overlaps).toEqual([])
    expect(analysis.speedGaps).toEqual([])
  })

  it('composes speed, stability, overlap, and shot-shape insights', () => {
    const discs = [
      makeDisc({ id: 'a', name: 'Aviar', slot: 'putting_putter', speed: 2, glide: 3, turn: 0, fade: 1 }),
      makeDisc({ id: 'b', name: 'Buzzz', slot: 'midrange', speed: 5, glide: 4, turn: -1, fade: 1 }),
      makeDisc({ id: 'c', name: 'Wraith', slot: 'distance_driver', speed: 11, glide: 5, turn: -1, fade: 3 }),
      makeDisc({ id: 'd', name: 'Firebird', slot: 'distance_driver', speed: 11, glide: 5, turn: -1, fade: 3 }),
    ]
    const analysis = analyzeBag(discs)
    expect(analysis.discCount).toBe(4)
    expect(analysis.overlaps).toHaveLength(1)
    expect(analysis.insights.length).toBeGreaterThan(0)
  })
})
