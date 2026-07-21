import type { PracticeCategory, TemplateDifficulty } from '../practice/models'
import type { PrimaryGoal } from '../profile/models'

export type ProgramCategory = PracticeCategory | 'mixed'
export type ProgramDifficulty = TemplateDifficulty
export type EnrollmentStatus = 'active' | 'completed' | 'abandoned'
export type ProgramModality = 'practice' | 'resistance'
export type ResistanceProgramType =
  | 'distance_development'
  | 'athletic_performance'
  | 'strength'
  | 'muscle_building'
  | 'mobility'
  | 'injury_prevention'
export type SeasonFocus = 'in_season' | 'off_season'
export type ProgramDayType = 'practice' | 'resistance'

export interface TrainingProgram {
  id: string
  name: string
  description: string
  category: ProgramCategory
  difficulty: ProgramDifficulty
  durationWeeks: number
  sessionsPerWeek: number
  estimatedMinutes: number
  // The profile goal this program is recommended for (see
  // domain/programs/recommendation.ts) — null if it isn't tied to one.
  recommendedGoal: PrimaryGoal | null
  // A resistance program requires an equipment-selection step before
  // enrollment (see features/resistanceTraining); practice programs don't.
  modality: ProgramModality
  resistanceProgramType: ResistanceProgramType | null
  seasonFocus: SeasonFocus | null
}

export interface ProgramDay {
  id: string
  programId: string
  weekNumber: number
  dayNumber: number
  title: string
  description: string
  dayType: ProgramDayType
  // Only set for 'practice' days — a 'resistance' day's exercises live in
  // program_day_exercises instead (see domain/resistanceTraining).
  templateId: string | null
}

export interface ProgramEnrollment {
  id: string
  userId: string
  programId: string
  status: EnrollmentStatus
  startedAt: string
  completedAt: string | null
}

export interface ProgramDayCompletion {
  id: string
  userId: string
  enrollmentId: string
  programDayId: string
  // Exactly one of these is set, depending on whether the day was completed
  // via a practice session or a resistance session (see migration 0020).
  sessionId: string | null
  resistanceSessionId: string | null
  completedAt: string
}

export function programDayLabel(day: Pick<ProgramDay, 'weekNumber' | 'dayNumber'>): string {
  return `Week ${day.weekNumber} Day ${day.dayNumber}`
}
