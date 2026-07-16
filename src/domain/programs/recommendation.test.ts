import { describe, expect, it } from 'vitest'
import { recommendProgramForGoal } from './recommendation'
import type { TrainingProgram } from './models'

function makeProgram(overrides: Partial<TrainingProgram> & { id: string }): TrainingProgram {
  return {
    name: overrides.id,
    description: '',
    category: 'mixed',
    difficulty: 'beginner',
    durationWeeks: 4,
    sessionsPerWeek: 2,
    estimatedMinutes: 20,
    recommendedGoal: null,
    ...overrides,
  }
}

const programs: TrainingProgram[] = [
  makeProgram({ id: 'putting', recommendedGoal: 'improve_putting' }),
  makeProgram({ id: 'distance', recommendedGoal: 'increase_distance' }),
  makeProgram({ id: 'unmapped', recommendedGoal: null }),
]

describe('recommendProgramForGoal', () => {
  it('returns the program matching the goal', () => {
    expect(recommendProgramForGoal('increase_distance', programs)?.id).toBe('distance')
  })

  it('returns null when the goal has no matching program', () => {
    expect(recommendProgramForGoal('learn_forehand', programs)).toBeNull()
  })

  it('returns null when the goal is null', () => {
    expect(recommendProgramForGoal(null, programs)).toBeNull()
  })
})
