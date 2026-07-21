import { describe, expect, it } from 'vitest'
import { isRequirementSatisfied, resolveExerciseForEquipment } from './equipmentResolution'
import type { ExerciseWithRequirements, SubstitutionOption } from './models'

function makeExercise(
  id: string,
  requiredEquipmentIds: string[],
  overrides: Partial<ExerciseWithRequirements['exercise']> = {},
): ExerciseWithRequirements {
  return {
    exercise: {
      id,
      slug: id,
      name: id,
      movementPattern: 'squat',
      instructions: '',
      ...overrides,
    },
    requiredEquipmentIds,
  }
}

describe('isRequirementSatisfied', () => {
  it('is true when every required id is available', () => {
    expect(isRequirementSatisfied(['barbell', 'squat_rack'], new Set(['barbell', 'squat_rack', 'bench']))).toBe(true)
  })

  it('is false when any required id is missing', () => {
    expect(isRequirementSatisfied(['barbell', 'squat_rack'], new Set(['barbell']))).toBe(false)
  })

  it('is true for an empty requirement list regardless of availability', () => {
    expect(isRequirementSatisfied([], new Set())).toBe(true)
  })
})

describe('resolveExerciseForEquipment', () => {
  const anchor = makeExercise('barbell-back-squat', ['barbell', 'squat_rack'])
  const chain: SubstitutionOption[] = [
    { rank: 1, exercise: makeExercise('goblet-squat-db', ['adjustable_dumbbells']) },
    { rank: 2, exercise: makeExercise('goblet-squat-kb', ['kettlebells']) },
    { rank: 3, exercise: makeExercise('bodyweight-squat', ['bodyweight']) },
  ]

  it('uses the anchor as-is when its equipment is available', () => {
    const result = resolveExerciseForEquipment(anchor, chain, new Set(['barbell', 'squat_rack']))
    expect(result).toEqual({
      exercise: anchor.exercise,
      isSubstitution: false,
      rankUsed: null,
      equipmentSatisfied: true,
    })
  })

  it('falls through to the first satisfiable substitution in rank order', () => {
    const result = resolveExerciseForEquipment(anchor, chain, new Set(['kettlebells']))
    expect(result.exercise.id).toBe('goblet-squat-kb')
    expect(result.isSubstitution).toBe(true)
    expect(result.rankUsed).toBe(2)
    expect(result.equipmentSatisfied).toBe(true)
  })

  it('prefers a higher-ranked substitution over a lower-ranked one when both are available', () => {
    const result = resolveExerciseForEquipment(anchor, chain, new Set(['adjustable_dumbbells', 'kettlebells']))
    expect(result.exercise.id).toBe('goblet-squat-db')
    expect(result.rankUsed).toBe(1)
  })

  it('resolves to the bodyweight terminal when only bodyweight is available', () => {
    const result = resolveExerciseForEquipment(anchor, chain, new Set(['bodyweight']))
    expect(result.exercise.id).toBe('bodyweight-squat')
    expect(result.equipmentSatisfied).toBe(true)
  })

  it('never returns null — falls back to the last chain entry, flagged unsatisfied, when nothing matches', () => {
    const result = resolveExerciseForEquipment(anchor, chain, new Set(['resistance_bands']))
    expect(result.exercise.id).toBe('bodyweight-squat')
    expect(result.equipmentSatisfied).toBe(false)
  })

  it('falls back to the anchor itself, flagged unsatisfied, when the chain is empty', () => {
    const result = resolveExerciseForEquipment(anchor, [], new Set())
    expect(result.exercise.id).toBe('barbell-back-squat')
    expect(result.isSubstitution).toBe(false)
    expect(result.equipmentSatisfied).toBe(false)
  })
})
