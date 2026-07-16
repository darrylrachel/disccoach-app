import type { BagSlot } from '../../domain/bag/models'

export { SLOT_ORDER } from '../../domain/bag/models'

export const SLOT_LABELS: Record<BagSlot, string> = {
  putting_putter: 'Putting Putter',
  throwing_putter: 'Throwing Putter',
  midrange: 'Midrange',
  fairway_driver: 'Fairway Driver',
  control_driver: 'Control Driver',
  distance_driver: 'Distance Driver',
}
