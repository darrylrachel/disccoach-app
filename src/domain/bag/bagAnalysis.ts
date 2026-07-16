import { categorizeStability } from '../disc/flightNumbers'
import { SLOT_ORDER, type BagSlot } from './models'

// The shape bagAnalysis operates on: one row per disc-in-bag, already
// resolved to effective flight numbers (personal override or catalog
// fallback) by the caller. Numbers are nullable because a manually-added
// disc with no catalog match and no personal numbers has none yet — those
// discs are excluded from the analyses that need them rather than crashing.
export interface AnalyzedDisc {
  id: string
  name: string
  slot: BagSlot
  speed: number | null
  glide: number | null
  turn: number | null
  fade: number | null
}

export type InsightSeverity = 'info' | 'warning'

export interface BagInsight {
  id: string
  category: 'speed' | 'stability' | 'overlap' | 'shot_shape'
  severity: InsightSeverity
  message: string
}

export type SpeedBand = 'low' | 'mid' | 'high'

export interface SpeedBandCoverage {
  band: SpeedBand
  rangeStart: number
  rangeEnd: number
  count: number
}

const SPEED_BANDS: Array<{ band: SpeedBand; start: number; end: number }> = [
  { band: 'low', start: 1, end: 3 },
  { band: 'mid', start: 4, end: 6 },
  { band: 'high', start: 7, end: 14 },
]

export function analyzeSpeedBandCoverage(discs: AnalyzedDisc[]): SpeedBandCoverage[] {
  const speeds = discs.map((d) => d.speed).filter((s): s is number => s !== null)

  return SPEED_BANDS.map(({ band, start, end }) => ({
    band,
    rangeStart: start,
    rangeEnd: end,
    count: speeds.filter((s) => s >= start && s <= end).length,
  }))
}

export interface SpeedGap {
  rangeStart: number
  rangeEnd: number
  count: number
  message: string
}

// Fine-grained (width-3) bins across the full speed range. A bin with zero
// or one disc is reported as a gap — this is what produces messages like
// "You have limited options between speed 6-9."
const SPEED_GAP_BINS = [
  { start: 1, end: 3 },
  { start: 4, end: 6 },
  { start: 7, end: 9 },
  { start: 10, end: 12 },
  { start: 13, end: 14 },
]

export function detectSpeedGaps(discs: AnalyzedDisc[]): SpeedGap[] {
  const speeds = discs.map((d) => d.speed).filter((s): s is number => s !== null)
  if (speeds.length === 0) return []

  const gaps: SpeedGap[] = []
  for (const { start, end } of SPEED_GAP_BINS) {
    const count = speeds.filter((s) => s >= start && s <= end).length
    if (count === 0) {
      gaps.push({
        rangeStart: start,
        rangeEnd: end,
        count,
        message: `You have no discs between speed ${start}-${end}.`,
      })
    } else if (count === 1) {
      gaps.push({
        rangeStart: start,
        rangeEnd: end,
        count,
        message: `You have limited options between speed ${start}-${end}.`,
      })
    }
  }
  return gaps
}

export type StabilityBand = 'understable' | 'neutral' | 'overstable'

export interface StabilityBandCoverage {
  band: StabilityBand
  count: number
}

function stabilityBand(turn: number, fade: number): StabilityBand {
  const category = categorizeStability(turn, fade)
  if (category === 'very_understable' || category === 'understable') return 'understable'
  if (category === 'stable') return 'neutral'
  return 'overstable'
}

export function analyzeStabilityCoverage(discs: AnalyzedDisc[]): StabilityBandCoverage[] {
  const bands: Record<StabilityBand, number> = { understable: 0, neutral: 0, overstable: 0 }

  for (const disc of discs) {
    if (disc.turn === null || disc.fade === null) continue
    bands[stabilityBand(disc.turn, disc.fade)] += 1
  }

  return [
    { band: 'understable', count: bands.understable },
    { band: 'neutral', count: bands.neutral },
    { band: 'overstable', count: bands.overstable },
  ]
}

const OVERSTABLE_HEAVY_THRESHOLD = 3
const LOW_COUNT_THRESHOLD = 1
const MIN_DISCS_FOR_MISSING_BAND_INSIGHT = 3

export function detectStabilityInsights(discs: AnalyzedDisc[]): BagInsight[] {
  const coverage = analyzeStabilityCoverage(discs)
  const total = coverage.reduce((sum, c) => sum + c.count, 0)
  const understable = coverage.find((c) => c.band === 'understable')!.count
  const neutral = coverage.find((c) => c.band === 'neutral')!.count
  const overstable = coverage.find((c) => c.band === 'overstable')!.count

  const insights: BagInsight[] = []

  if (overstable >= OVERSTABLE_HEAVY_THRESHOLD && neutral <= LOW_COUNT_THRESHOLD) {
    insights.push({
      id: 'stability-overstable-heavy',
      category: 'stability',
      severity: 'info',
      message: 'Your bag has several overstable discs but limited neutral options.',
    })
  }

  if (total >= MIN_DISCS_FOR_MISSING_BAND_INSIGHT) {
    if (understable === 0) {
      insights.push({
        id: 'stability-no-understable',
        category: 'stability',
        severity: 'warning',
        message: "You don't have any understable discs — turnover and flex shots will be hard to shape.",
      })
    }
    if (overstable === 0) {
      insights.push({
        id: 'stability-no-overstable',
        category: 'stability',
        severity: 'warning',
        message: "You don't have any overstable discs — reliable hyzer finishes and headwind control will be limited.",
      })
    }
    if (neutral === 0) {
      insights.push({
        id: 'stability-no-neutral',
        category: 'stability',
        severity: 'info',
        message: "You don't have any neutral/stable discs for straight, predictable flights.",
      })
    }
  }

  return insights
}

export interface OverlapGroup {
  discIds: string[]
  discNames: string[]
  message: string
}

const OVERLAP_THRESHOLDS = { speed: 1.5, glide: 1, turn: 1, fade: 1 }

function isOverlapping(a: AnalyzedDisc, b: AnalyzedDisc): boolean {
  if (
    a.speed === null ||
    a.glide === null ||
    a.turn === null ||
    a.fade === null ||
    b.speed === null ||
    b.glide === null ||
    b.turn === null ||
    b.fade === null
  ) {
    return false
  }

  return (
    Math.abs(a.speed - b.speed) <= OVERLAP_THRESHOLDS.speed &&
    Math.abs(a.glide - b.glide) <= OVERLAP_THRESHOLDS.glide &&
    Math.abs(a.turn - b.turn) <= OVERLAP_THRESHOLDS.turn &&
    Math.abs(a.fade - b.fade) <= OVERLAP_THRESHOLDS.fade
  )
}

// Union-find so overlap is transitive: if A~B and B~C, they're reported as
// one group of three rather than two overlapping pairs.
export function detectOverlaps(discs: AnalyzedDisc[]): OverlapGroup[] {
  const parent = new Map<string, string>()
  discs.forEach((d) => parent.set(d.id, d.id))

  function find(id: string): string {
    let root = id
    while (parent.get(root) !== root) root = parent.get(root)!
    while (parent.get(id) !== root) {
      const next = parent.get(id)!
      parent.set(id, root)
      id = next
    }
    return root
  }

  function union(a: string, b: string) {
    const rootA = find(a)
    const rootB = find(b)
    if (rootA !== rootB) parent.set(rootA, rootB)
  }

  for (let i = 0; i < discs.length; i++) {
    for (let j = i + 1; j < discs.length; j++) {
      if (isOverlapping(discs[i], discs[j])) {
        union(discs[i].id, discs[j].id)
      }
    }
  }

  const groups = new Map<string, AnalyzedDisc[]>()
  for (const disc of discs) {
    const root = find(disc.id)
    if (!groups.has(root)) groups.set(root, [])
    groups.get(root)!.push(disc)
  }

  const overlaps: OverlapGroup[] = []
  for (const group of groups.values()) {
    if (group.length < 2) continue
    const discNames = group.map((d) => d.name)
    const message =
      discNames.length === 2
        ? `${discNames[0]} and ${discNames[1]} occupy a similar flight slot.`
        : `${discNames.slice(0, -1).join(', ')}, and ${discNames[discNames.length - 1]} occupy a similar flight slot.`
    overlaps.push({ discIds: group.map((d) => d.id), discNames, message })
  }

  return overlaps
}

export type ShotShape = 'straight' | 'hyzer' | 'turnover' | 'distance' | 'utility'

export interface ShotShapeCoverage {
  shape: ShotShape
  discIds: string[]
  covered: boolean
}

const SHOT_SHAPE_LABELS: Record<ShotShape, string> = {
  straight: 'straight shots',
  hyzer: 'hyzer shots',
  turnover: 'turnover shots',
  distance: 'distance shots',
  utility: 'utility shots (rollers, forehand flex)',
}

function contributesToShape(disc: AnalyzedDisc, shape: ShotShape): boolean {
  if (disc.turn === null || disc.fade === null) return false
  const category = categorizeStability(disc.turn, disc.fade)

  switch (shape) {
    case 'straight':
      return category === 'stable'
    case 'hyzer':
      return category === 'overstable' || category === 'very_overstable'
    case 'turnover':
      return category === 'understable' || category === 'very_understable'
    case 'distance':
      return (
        (disc.slot === 'distance_driver' || disc.slot === 'control_driver') &&
        disc.speed !== null &&
        disc.speed >= 9
      )
    case 'utility':
      return (
        (disc.slot === 'putting_putter' || disc.slot === 'throwing_putter' || disc.slot === 'midrange') &&
        (category === 'understable' || category === 'very_understable')
      )
  }
}

const SHOT_SHAPES: ShotShape[] = ['straight', 'hyzer', 'turnover', 'distance', 'utility']

export function analyzeShotShapeCoverage(discs: AnalyzedDisc[]): ShotShapeCoverage[] {
  return SHOT_SHAPES.map((shape) => {
    const discIds = discs.filter((d) => contributesToShape(d, shape)).map((d) => d.id)
    return { shape, discIds, covered: discIds.length > 0 }
  })
}

export function detectShotShapeInsights(discs: AnalyzedDisc[]): BagInsight[] {
  return analyzeShotShapeCoverage(discs)
    .filter((c) => !c.covered)
    .map((c) => ({
      id: `shot-shape-missing-${c.shape}`,
      category: 'shot_shape' as const,
      severity: 'warning' as const,
      message: `No discs currently support ${SHOT_SHAPE_LABELS[c.shape]}.`,
    }))
}

export interface SlotCoverage {
  slot: BagSlot
  count: number
}

export function countBySlot(discs: AnalyzedDisc[]): SlotCoverage[] {
  return SLOT_ORDER.map((slot) => ({
    slot,
    count: discs.filter((d) => d.slot === slot).length,
  }))
}

export interface BagAnalysis {
  discCount: number
  slotCoverage: SlotCoverage[]
  speedBandCoverage: SpeedBandCoverage[]
  speedGaps: SpeedGap[]
  stabilityCoverage: StabilityBandCoverage[]
  overlaps: OverlapGroup[]
  shotShapeCoverage: ShotShapeCoverage[]
  insights: BagInsight[]
}

export function analyzeBag(discs: AnalyzedDisc[]): BagAnalysis {
  const speedGaps = detectSpeedGaps(discs)
  const stabilityInsights = detectStabilityInsights(discs)
  const overlaps = detectOverlaps(discs)
  const shotShapeInsights = detectShotShapeInsights(discs)

  const speedGapInsights: BagInsight[] = speedGaps.map((gap, i) => ({
    id: `speed-gap-${i}`,
    category: 'speed',
    severity: gap.count === 0 ? 'warning' : 'info',
    message: gap.message,
  }))

  const overlapInsights: BagInsight[] = overlaps.map((group, i) => ({
    id: `overlap-${i}`,
    category: 'overlap',
    severity: 'info',
    message: group.message,
  }))

  return {
    discCount: discs.length,
    slotCoverage: countBySlot(discs),
    speedBandCoverage: analyzeSpeedBandCoverage(discs),
    speedGaps,
    stabilityCoverage: analyzeStabilityCoverage(discs),
    overlaps,
    shotShapeCoverage: analyzeShotShapeCoverage(discs),
    insights: [...speedGapInsights, ...stabilityInsights, ...overlapInsights, ...shotShapeInsights],
  }
}
