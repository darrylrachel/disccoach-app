export type BagSlot =
  | 'putting_putter'
  | 'throwing_putter'
  | 'midrange'
  | 'fairway_driver'
  | 'control_driver'
  | 'distance_driver'

export const SLOT_ORDER: BagSlot[] = [
  'putting_putter',
  'throwing_putter',
  'midrange',
  'fairway_driver',
  'control_driver',
  'distance_driver',
]

export interface Bag {
  id: string
  userId: string
  name: string
  description: string | null
  isActive: boolean
}

export interface NewBagInput {
  name: string
  description?: string | null
}

export interface BagUpdateInput {
  name?: string
  description?: string | null
}

export interface BagDisc {
  id: string
  bagId: string
  discId: string
  slot: BagSlot
  addedAt: string
}

export interface BagSlotUpdateInput {
  slot: BagSlot
}

// Default slot assignment from a disc's catalog category + speed, used to
// pre-fill the slot when adding a disc to a bag. The category enum (4
// values) is coarser than BagSlot (6 values) — putters split into
// putting/throwing by speed, and fast fairway/slow distance drivers both
// read as "control driver" since that's a feel/use distinction the catalog
// doesn't capture. Always user-overridable.
export function defaultSlotForDisc(
  category: 'putter' | 'midrange' | 'fairway_driver' | 'distance_driver',
  speed: number | null,
): BagSlot {
  if (category === 'putter') {
    return speed !== null && speed > 3 ? 'throwing_putter' : 'putting_putter'
  }
  if (category === 'midrange') return 'midrange'
  if (category === 'fairway_driver') {
    return speed !== null && speed >= 8 ? 'control_driver' : 'fairway_driver'
  }
  // distance_driver
  return speed !== null && speed <= 11 ? 'control_driver' : 'distance_driver'
}
