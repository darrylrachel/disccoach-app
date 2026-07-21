import type { ResolvedProgramDayExercise } from '../../../services/resistanceTraining.service'

interface ExerciseCardProps {
  item: ResolvedProgramDayExercise
}

export function ExerciseCard({ item }: ExerciseCardProps) {
  const { planned, resolved } = item

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="font-semibold text-white">{resolved.exercise.name}</p>
        {resolved.isSubstitution && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
              resolved.equipmentSatisfied
                ? 'bg-brand-gold/15 text-brand-gold'
                : 'bg-red-500/15 text-red-400'
            }`}
          >
            {resolved.equipmentSatisfied ? 'Substituted' : 'No equipment match'}
          </span>
        )}
      </div>
      <p className="mb-2 text-sm text-white/60">
        {planned.sets} sets &times; {planned.reps}
        {planned.restSeconds ? ` · rest ${planned.restSeconds}s` : ''}
      </p>
      <p className="text-sm text-white/50">{resolved.exercise.instructions}</p>
      {planned.notes && <p className="mt-2 text-xs text-white/40">{planned.notes}</p>}
    </div>
  )
}
