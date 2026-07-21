import { supabase } from './supabaseClient'
import type { Database } from '../types/database.types'
import { resolveExerciseForEquipment } from '../domain/resistanceTraining/equipmentResolution'
import { calculateProgramProgress } from '../domain/programs/programProgress'
import { getEnrollment, listCompletionsForEnrollment, listProgramDays } from './programs.service'
import type {
  Equipment,
  EquipmentCategory,
  Exercise,
  ExerciseWithRequirements,
  MovementPattern,
  ProgramDayExercise,
  ResistanceSession,
  ResistanceSessionStatus,
  ResolvedExercise,
  SubstitutionOption,
} from '../domain/resistanceTraining/models'

type EquipmentRow = Database['public']['Tables']['equipment']['Row']
type ExerciseRow = Database['public']['Tables']['exercises']['Row']
type ProgramDayExerciseRow = Database['public']['Tables']['program_day_exercises']['Row']
type ResistanceSessionRow = Database['public']['Tables']['resistance_sessions']['Row']
type ResistanceSessionInsert = Database['public']['Tables']['resistance_sessions']['Insert']
type CompletionInsert = Database['public']['Tables']['program_day_completions']['Insert']

function toDomainEquipment(row: EquipmentRow): Equipment {
  return { id: row.id, slug: row.slug, name: row.name, category: row.category as EquipmentCategory }
}

function toDomainExercise(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    movementPattern: row.movement_pattern as MovementPattern,
    instructions: row.instructions,
  }
}

function toDomainProgramDayExercise(row: ProgramDayExerciseRow): ProgramDayExercise {
  return {
    id: row.id,
    programDayId: row.program_day_id,
    exerciseId: row.exercise_id,
    orderIndex: row.order_index,
    sets: row.sets,
    reps: row.reps,
    restSeconds: row.rest_seconds,
    notes: row.notes,
  }
}

function toDomainResistanceSession(row: ResistanceSessionRow): ResistanceSession {
  return {
    id: row.id,
    userId: row.user_id,
    programDayId: row.program_day_id,
    enrollmentId: row.enrollment_id,
    status: row.status as ResistanceSessionStatus,
    startedAt: row.started_at,
    completedAt: row.completed_at,
  }
}

export async function listEquipment(): Promise<Equipment[]> {
  const { data, error } = await supabase.from('equipment').select('*').order('category').order('name')
  if (error) throw error
  return data.map(toDomainEquipment)
}

export async function getUserEquipmentIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase.from('user_equipment').select('equipment_id').eq('user_id', userId)
  if (error) throw error
  return new Set(data.map((row) => row.equipment_id))
}

// Full-replace: simplest correct way to persist a freeform inventory edit
// without diffing add/remove sets by hand.
export async function setUserEquipment(userId: string, equipmentIds: string[]): Promise<void> {
  const { error: deleteError } = await supabase.from('user_equipment').delete().eq('user_id', userId)
  if (deleteError) throw deleteError

  if (equipmentIds.length === 0) return

  const { error: insertError } = await supabase
    .from('user_equipment')
    .insert(equipmentIds.map((equipmentId) => ({ user_id: userId, equipment_id: equipmentId })))

  if (insertError) throw insertError
}

// Loads exercises + their AND-semantics equipment requirements in one
// round-trip per table (not N+1), keyed by exercise id.
async function loadExercisesWithRequirements(
  exerciseIds: string[],
): Promise<Map<string, ExerciseWithRequirements>> {
  if (exerciseIds.length === 0) return new Map()

  const [exercisesResult, requirementsResult] = await Promise.all([
    supabase.from('exercises').select('*').in('id', exerciseIds),
    supabase.from('exercise_equipment_requirements').select('*').in('exercise_id', exerciseIds),
  ])

  if (exercisesResult.error) throw exercisesResult.error
  if (requirementsResult.error) throw requirementsResult.error

  const requirementsByExercise = new Map<string, string[]>()
  for (const row of requirementsResult.data) {
    const list = requirementsByExercise.get(row.exercise_id) ?? []
    list.push(row.equipment_id)
    requirementsByExercise.set(row.exercise_id, list)
  }

  const result = new Map<string, ExerciseWithRequirements>()
  for (const row of exercisesResult.data) {
    result.set(row.id, {
      exercise: toDomainExercise(row),
      requiredEquipmentIds: requirementsByExercise.get(row.id) ?? [],
    })
  }
  return result
}

export async function listProgramDayExercises(programDayId: string): Promise<ProgramDayExercise[]> {
  const { data, error } = await supabase
    .from('program_day_exercises')
    .select('*')
    .eq('program_day_id', programDayId)
    .order('order_index')

  if (error) throw error
  return data.map(toDomainProgramDayExercise)
}

export interface ResolvedProgramDayExercise {
  planned: ProgramDayExercise
  resolved: ResolvedExercise
}

// The equipment-aware read path: loads a resistance day's planned exercises
// plus every exercise's requirements and substitution chain, then runs the
// pure resolver (domain/resistanceTraining/equipmentResolution.ts) per row.
// Nothing about which variant was chosen is persisted here — it's derived
// fresh every time, so changing your equipment inventory immediately changes
// what today's workout shows.
export async function getResolvedProgramDayExercises(
  programDayId: string,
  availableEquipmentIds: Set<string>,
): Promise<ResolvedProgramDayExercise[]> {
  const planned = await listProgramDayExercises(programDayId)
  if (planned.length === 0) return []

  const anchorIds = planned.map((p) => p.exerciseId)

  const { data: substitutionRows, error: substitutionError } = await supabase
    .from('exercise_substitutions')
    .select('*')
    .in('exercise_id', anchorIds)
    .order('rank')

  if (substitutionError) throw substitutionError

  const substituteIds = substitutionRows.map((row) => row.substitute_exercise_id)
  const exercisesById = await loadExercisesWithRequirements([...new Set([...anchorIds, ...substituteIds])])

  const chainsByAnchor = new Map<string, SubstitutionOption[]>()
  for (const row of substitutionRows) {
    const substitute = exercisesById.get(row.substitute_exercise_id)
    if (!substitute) continue
    const chain = chainsByAnchor.get(row.exercise_id) ?? []
    chain.push({ rank: row.rank, exercise: substitute })
    chainsByAnchor.set(row.exercise_id, chain)
  }

  return planned
    .map((plannedExercise) => {
      const anchor = exercisesById.get(plannedExercise.exerciseId)
      if (!anchor) return null
      const chain = chainsByAnchor.get(plannedExercise.exerciseId) ?? []
      const resolved = resolveExerciseForEquipment(anchor, chain, availableEquipmentIds)
      return { planned: plannedExercise, resolved }
    })
    .filter((row): row is ResolvedProgramDayExercise => row !== null)
}

export async function startResistanceSession(
  userId: string,
  input: { programDayId?: string | null; enrollmentId?: string | null },
): Promise<ResistanceSession> {
  const payload: ResistanceSessionInsert = {
    user_id: userId,
    program_day_id: input.programDayId ?? null,
    enrollment_id: input.enrollmentId ?? null,
  }

  const { data, error } = await supabase.from('resistance_sessions').insert(payload).select('*').single()
  if (error) throw error
  return toDomainResistanceSession(data)
}

export async function getResistanceSession(id: string): Promise<ResistanceSession | null> {
  const { data, error } = await supabase.from('resistance_sessions').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? toDomainResistanceSession(data) : null
}

export async function getActiveResistanceSession(userId: string): Promise<ResistanceSession | null> {
  const { data, error } = await supabase
    .from('resistance_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data ? toDomainResistanceSession(data) : null
}

export async function completeResistanceSession(id: string): Promise<ResistanceSession> {
  const { data, error } = await supabase
    .from('resistance_sessions')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return toDomainResistanceSession(data)
}

export async function abandonResistanceSession(id: string): Promise<ResistanceSession> {
  const { data, error } = await supabase
    .from('resistance_sessions')
    .update({ status: 'abandoned', completed_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return toDomainResistanceSession(data)
}

// Mirrors recordProgramDayCompletion (services/programs.service.ts) for the
// resistance side of the polymorphic program_day_completions row — see
// migration 0020. A no-op if the session isn't program-linked.
export async function recordResistanceDayCompletion(session: ResistanceSession): Promise<void> {
  if (!session.programDayId || !session.enrollmentId) return

  const enrollment = await getEnrollment(session.enrollmentId)
  if (!enrollment || enrollment.status !== 'active') return

  const completionPayload: CompletionInsert = {
    user_id: session.userId,
    enrollment_id: session.enrollmentId,
    program_day_id: session.programDayId,
    resistance_session_id: session.id,
  }

  const { error: insertError } = await supabase
    .from('program_day_completions')
    .upsert(completionPayload, { onConflict: 'enrollment_id,program_day_id', ignoreDuplicates: true })

  if (insertError) throw insertError

  const [days, completions] = await Promise.all([
    listProgramDays(enrollment.programId),
    listCompletionsForEnrollment(enrollment.id),
  ])

  const completedDayIds = new Set(completions.map((c) => c.programDayId))
  const progress = calculateProgramProgress(days, completedDayIds)

  if (progress.isComplete) {
    const { error: updateError } = await supabase
      .from('user_program_enrollments')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', enrollment.id)

    if (updateError) throw updateError
  }
}
