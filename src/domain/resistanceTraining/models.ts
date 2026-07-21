export type EquipmentCategory = 'free_weight' | 'machine' | 'bodyweight' | 'accessory'

export interface Equipment {
  id: string
  slug: string
  name: string
  category: EquipmentCategory
}

export type MovementPattern =
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'horizontal_push'
  | 'vertical_push'
  | 'horizontal_pull'
  | 'vertical_pull'
  | 'carry'
  | 'core'
  | 'mobility'

export interface Exercise {
  id: string
  slug: string
  name: string
  movementPattern: MovementPattern
  instructions: string
}

// AND-semantics: every listed piece of equipment is required for this exact
// exercise variant. "Dumbbell OR kettlebell both work" is modeled as two
// separate exercise variants linked via a substitution chain, not as OR
// logic here — that keeps the resolver a plain subset check.
export interface ExerciseWithRequirements {
  exercise: Exercise
  requiredEquipmentIds: string[]
}

// One ranked fallback in an anchor exercise's substitution chain. Chains are
// explicit and content-authored (not derived from movementPattern) so the
// "next best" alternative is always a deliberate editorial choice, not a
// guess — see equipmentResolution.ts.
export interface SubstitutionOption {
  rank: number
  exercise: ExerciseWithRequirements
}

export interface ResolvedExercise {
  exercise: Exercise
  isSubstitution: boolean
  rankUsed: number | null
  equipmentSatisfied: boolean
}

export type ProgramDayType = 'practice' | 'resistance'
export type ResistanceProgramType =
  | 'distance_development'
  | 'athletic_performance'
  | 'strength'
  | 'muscle_building'
  | 'mobility'
  | 'injury_prevention'
export type SeasonFocus = 'in_season' | 'off_season'
export type ResistanceSessionStatus = 'in_progress' | 'completed' | 'abandoned'

export interface ProgramDayExercise {
  id: string
  programDayId: string
  exerciseId: string
  orderIndex: number
  sets: number
  reps: string
  restSeconds: number | null
  notes: string | null
}

export interface ResistanceSession {
  id: string
  userId: string
  programDayId: string | null
  enrollmentId: string | null
  status: ResistanceSessionStatus
  startedAt: string
  completedAt: string | null
}
