import type { PrimaryGoal } from '../profile/models'
import type { TrainingProgram } from './models'

// Rule-based only, per the product roadmap's MVP boundaries — no AI. A
// profile's primary_goal is required during onboarding, so this is almost
// always a hit; null falls through to the "choose your goal" prompt in the
// UI instead of guessing.
export function recommendProgramForGoal(
  goal: PrimaryGoal | null,
  programs: TrainingProgram[],
): TrainingProgram | null {
  if (!goal) return null
  return programs.find((program) => program.recommendedGoal === goal) ?? null
}
