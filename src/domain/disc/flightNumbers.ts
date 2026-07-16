import type { Disc, FlightNumbers, Stability } from './models'

export interface ResolvedFlightNumbers {
  speed: number | null
  glide: number | null
  turn: number | null
  fade: number | null
}

// Net stability = turn + fade. Boundaries are our own approximation (real
// classification also factors glide/speed and manufacturer judgment), so
// this won't always match a catalog entry's hand-assigned `stability` value.
export function categorizeStability(turn: number, fade: number): Stability {
  const net = turn + fade

  if (net <= -4) return 'very_understable'
  if (net <= -1) return 'understable'
  if (net <= 1) return 'stable'
  if (net <= 3) return 'overstable'
  return 'very_overstable'
}

// personal_* overrides the catalog value per flight number; falls back to
// the catalog entry, and to null when neither is set (e.g. a custom disc
// with no catalog match and no personal numbers entered yet).
export function resolveEffectiveFlightNumbers(
  disc: Pick<Disc, 'personalSpeed' | 'personalGlide' | 'personalTurn' | 'personalFade'>,
  catalogEntry: FlightNumbers | null,
): ResolvedFlightNumbers {
  return {
    speed: disc.personalSpeed ?? catalogEntry?.speed ?? null,
    glide: disc.personalGlide ?? catalogEntry?.glide ?? null,
    turn: disc.personalTurn ?? catalogEntry?.turn ?? null,
    fade: disc.personalFade ?? catalogEntry?.fade ?? null,
  }
}
