import type { PracticeCategory, TemplateDifficulty } from '../practice/models'
import type { PrimaryGoal } from '../profile/models'

export type ProgramCategory = PracticeCategory | 'mixed'
export type ProgramDifficulty = TemplateDifficulty
export type EnrollmentStatus = 'active' | 'completed' | 'abandoned'

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
}

export interface ProgramDay {
  id: string
  programId: string
  weekNumber: number
  dayNumber: number
  title: string
  description: string
  templateId: string
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
  sessionId: string
  completedAt: string
}

export function programDayLabel(day: Pick<ProgramDay, 'weekNumber' | 'dayNumber'>): string {
  return `Week ${day.weekNumber} Day ${day.dayNumber}`
}
