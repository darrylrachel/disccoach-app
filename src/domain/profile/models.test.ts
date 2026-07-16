import { describe, expect, it } from 'vitest'
import { isOnboardingComplete, type PlayerProfile } from './models'

function makeProfile(overrides: Partial<PlayerProfile> = {}): PlayerProfile {
  return {
    id: 'user-1',
    displayName: null,
    skillLevel: 'beginner',
    primaryGoal: 'lower_scores',
    throwingHand: 'right',
    primaryThrowStyle: 'backhand',
    maxDistance: null,
    forehandDistance: null,
    puttingStyle: null,
    ...overrides,
  }
}

describe('isOnboardingComplete', () => {
  it('returns false when profile is null', () => {
    expect(isOnboardingComplete(null)).toBe(false)
  })

  it('returns true when all required fields are set', () => {
    expect(isOnboardingComplete(makeProfile())).toBe(true)
  })

  it('returns false when skillLevel is missing', () => {
    expect(isOnboardingComplete(makeProfile({ skillLevel: null }))).toBe(false)
  })

  it('returns false when primaryGoal is missing', () => {
    expect(isOnboardingComplete(makeProfile({ primaryGoal: null }))).toBe(false)
  })

  it('is unaffected by optional fields being null', () => {
    expect(
      isOnboardingComplete(
        makeProfile({ maxDistance: null, forehandDistance: null, puttingStyle: null }),
      ),
    ).toBe(true)
  })
})
