import type { PrimaryGoal } from '../../domain/profile/models'

export const PRIMARY_GOAL_ORDER: PrimaryGoal[] = [
  'increase_distance',
  'improve_putting',
  'lower_scores',
  'learn_forehand',
  'improve_consistency',
]

export const PRIMARY_GOAL_LABELS: Record<PrimaryGoal, string> = {
  increase_distance: 'Increase distance',
  improve_putting: 'Improve putting',
  lower_scores: 'Lower scores',
  learn_forehand: 'Learn forehand',
  improve_consistency: 'Improve consistency',
}
