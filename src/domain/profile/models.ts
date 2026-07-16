export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'competitive'

export type PrimaryGoal =
  | 'increase_distance'
  | 'improve_putting'
  | 'lower_scores'
  | 'learn_forehand'
  | 'improve_consistency'

export type ThrowingHand = 'left' | 'right'
export type ThrowStyle = 'backhand' | 'forehand'

export interface PlayerProfile {
  id: string
  displayName: string | null
  skillLevel: SkillLevel | null
  primaryGoal: PrimaryGoal | null
  throwingHand: ThrowingHand | null
  primaryThrowStyle: ThrowStyle | null
  maxDistance: number | null
  forehandDistance: number | null
  puttingStyle: string | null
}

const REQUIRED_ONBOARDING_FIELDS: (keyof PlayerProfile)[] = [
  'skillLevel',
  'primaryGoal',
  'throwingHand',
  'primaryThrowStyle',
]

export function isOnboardingComplete(profile: PlayerProfile | null): boolean {
  if (!profile) return false
  return REQUIRED_ONBOARDING_FIELDS.every((field) => profile[field] !== null)
}
