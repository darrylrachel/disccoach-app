import type { SkillLevel } from '../profile/models'
import type { PracticeCategory, PracticeTemplate, TemplateDifficulty } from './models'

// Template difficulty is a 3-value scale; profile skill level is 4-value
// (adds "competitive"). Competitive players get advanced-difficulty
// sessions — there's no dedicated tier for them, and advanced is the
// closer match than intermediate.
export function difficultyForSkillLevel(skillLevel: SkillLevel | null): TemplateDifficulty {
  if (skillLevel === 'advanced' || skillLevel === 'competitive') return 'advanced'
  if (skillLevel === 'intermediate') return 'intermediate'
  return 'beginner'
}

export interface SessionGeneratorInput {
  durationMinutes: number
  category: PracticeCategory
  skillLevel: SkillLevel | null
}

function closestByDuration(templates: PracticeTemplate[], target: number): PracticeTemplate {
  return templates.reduce((best, t) =>
    Math.abs(t.durationMinutes - target) < Math.abs(best.durationMinutes - target) ? t : best,
  )
}

// Picks the best-matching template for a time budget + category + skill
// level: exact duration+difficulty match first, then closest duration at
// the same difficulty, then closest duration at any difficulty. The
// fallback tiers mainly cover gaps in the template library rather than the
// common case, since the seeded catalog has an exact match for every
// category x difficulty x standard duration combination.
export function selectTemplate(
  templates: PracticeTemplate[],
  input: SessionGeneratorInput,
): PracticeTemplate | null {
  const candidates = templates.filter((t) => t.category === input.category)
  if (candidates.length === 0) return null

  const targetDifficulty = difficultyForSkillLevel(input.skillLevel)

  const exact = candidates.find(
    (t) => t.durationMinutes === input.durationMinutes && t.difficulty === targetDifficulty,
  )
  if (exact) return exact

  const sameDifficulty = candidates.filter((t) => t.difficulty === targetDifficulty)
  if (sameDifficulty.length > 0) return closestByDuration(sameDifficulty, input.durationMinutes)

  return closestByDuration(candidates, input.durationMinutes)
}
