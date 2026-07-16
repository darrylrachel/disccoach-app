import type { PracticeCategory } from '../../domain/practice/models'

export const CATEGORY_ORDER: PracticeCategory[] = ['putting', 'distance', 'field_work', 'accuracy']

export const CATEGORY_LABELS: Record<PracticeCategory, string> = {
  putting: 'Putting',
  distance: 'Distance',
  field_work: 'Field Work',
  accuracy: 'Accuracy',
}

export const DURATION_OPTIONS = [20, 45, 60] as const
