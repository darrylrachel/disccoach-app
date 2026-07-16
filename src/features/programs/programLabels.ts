import type { ProgramCategory, ProgramDifficulty } from '../../domain/programs/models'

export const PROGRAM_CATEGORY_LABELS: Record<ProgramCategory, string> = {
  putting: 'Putting',
  distance: 'Distance',
  field_work: 'Field Work',
  accuracy: 'Accuracy',
  mixed: 'Mixed',
}

export const PROGRAM_DIFFICULTY_LABELS: Record<ProgramDifficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}
