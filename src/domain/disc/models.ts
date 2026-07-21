export type DiscCategory = 'putter' | 'midrange' | 'fairway_driver' | 'distance_driver'
export type Stability =
  | 'very_understable'
  | 'understable'
  | 'stable'
  | 'overstable'
  | 'very_overstable'

export type DiscCondition = 'new' | 'good' | 'worn' | 'beat_in' | 'retired_worthy'
export type DiscStatus = 'active' | 'retired' | 'lost' | 'traded'

export interface FlightNumbers {
  speed: number
  glide: number
  turn: number
  fade: number
}

export interface DiscCatalogEntry {
  id: string
  manufacturer: string
  moldName: string
  plasticTypes: string[]
  speed: number
  glide: number
  turn: number
  fade: number
  category: DiscCategory
  stability: Stability
}

export interface Disc {
  id: string
  userId: string
  catalogId: string | null
  customManufacturer: string | null
  customMoldName: string | null
  nickname: string | null
  plastic: string | null
  weight: number | null
  color: string | null
  condition: DiscCondition
  beatInLevel: number
  personalSpeed: number | null
  personalGlide: number | null
  personalTurn: number | null
  personalFade: number | null
  confidenceRating: number | null
  notes: string | null
  favoriteUses: string[] | null
  status: DiscStatus
  statusChangedAt: string | null
}

export interface DiscWithCatalog {
  disc: Disc
  catalogEntry: DiscCatalogEntry | null
}

interface NewDiscBase {
  nickname?: string | null
  plastic?: string | null
  weight?: number | null
  color?: string | null
  condition?: DiscCondition
  personalSpeed?: number | null
  personalGlide?: number | null
  personalTurn?: number | null
  personalFade?: number | null
  confidenceRating?: number | null
  notes?: string | null
  favoriteUses?: string[] | null
}

// The two add-disc paths are first-class, not one a fallback of the other:
// either link to a catalog entry, or capture the manufacturer/mold manually.
export type NewDiscInput =
  | (NewDiscBase & { catalogId: string })
  | (NewDiscBase & { customManufacturer: string; customMoldName: string })

// Re-identifying an existing disc (e.g. correcting a manual entry to a
// catalog match, or vice versa) — mirrors NewDiscInput's two first-class
// paths, but as a standalone update rather than bundled with every field.
export type DiscIdentityUpdate =
  | { catalogId: string }
  | { customManufacturer: string; customMoldName: string }
