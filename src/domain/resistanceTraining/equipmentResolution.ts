import type { ExerciseWithRequirements, ResolvedExercise, SubstitutionOption } from './models'

export function isRequirementSatisfied(requiredEquipmentIds: string[], availableEquipmentIds: Set<string>): boolean {
  return requiredEquipmentIds.every((id) => availableEquipmentIds.has(id))
}

// Picks the best exercise variant a user's equipment can actually support.
// Walk order: the anchor exercise first, then the substitution chain in
// rank order (pre-sorted ascending by the caller); the first candidate whose
// requirements are fully covered wins. Content convention: every
// substitution chain should terminate in a bodyweight-only variant, so a
// match is always found in practice — but if seed data is incomplete, this
// falls back to the last chain entry (or the anchor, if the chain is empty)
// with `equipmentSatisfied: false` rather than throwing, so the user is
// never left with nothing to do.
export function resolveExerciseForEquipment(
  anchor: ExerciseWithRequirements,
  substitutionChain: SubstitutionOption[],
  availableEquipmentIds: Set<string>,
): ResolvedExercise {
  if (isRequirementSatisfied(anchor.requiredEquipmentIds, availableEquipmentIds)) {
    return { exercise: anchor.exercise, isSubstitution: false, rankUsed: null, equipmentSatisfied: true }
  }

  for (const option of substitutionChain) {
    if (isRequirementSatisfied(option.exercise.requiredEquipmentIds, availableEquipmentIds)) {
      return {
        exercise: option.exercise.exercise,
        isSubstitution: true,
        rankUsed: option.rank,
        equipmentSatisfied: true,
      }
    }
  }

  const fallback = substitutionChain[substitutionChain.length - 1]
  if (fallback) {
    return {
      exercise: fallback.exercise.exercise,
      isSubstitution: true,
      rankUsed: fallback.rank,
      equipmentSatisfied: false,
    }
  }

  return { exercise: anchor.exercise, isSubstitution: false, rankUsed: null, equipmentSatisfied: false }
}
