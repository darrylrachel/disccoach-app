import { supabase } from './supabaseClient'
import type { Database } from '../types/database.types'
import type {
  EnrollmentStatus,
  ProgramCategory,
  ProgramDay,
  ProgramDayCompletion,
  ProgramDayType,
  ProgramDifficulty,
  ProgramEnrollment,
  ProgramModality,
  ResistanceProgramType,
  SeasonFocus,
  TrainingProgram,
} from '../domain/programs/models'
import type { PrimaryGoal } from '../domain/profile/models'
import { calculateProgramProgress } from '../domain/programs/programProgress'
import type { PracticeSession } from '../domain/practice/models'

type ProgramRow = Database['public']['Tables']['training_programs']['Row']
type ProgramDayRow = Database['public']['Tables']['program_days']['Row']
type EnrollmentRow = Database['public']['Tables']['user_program_enrollments']['Row']
type EnrollmentInsert = Database['public']['Tables']['user_program_enrollments']['Insert']
type CompletionRow = Database['public']['Tables']['program_day_completions']['Row']
type CompletionInsert = Database['public']['Tables']['program_day_completions']['Insert']

function toDomainProgram(row: ProgramRow): TrainingProgram {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category as ProgramCategory,
    difficulty: row.difficulty as ProgramDifficulty,
    durationWeeks: row.duration_weeks,
    sessionsPerWeek: row.sessions_per_week,
    estimatedMinutes: row.estimated_minutes,
    recommendedGoal: row.primary_goal as PrimaryGoal | null,
    modality: row.modality as ProgramModality,
    resistanceProgramType: row.resistance_program_type as ResistanceProgramType | null,
    seasonFocus: row.season_focus as SeasonFocus | null,
  }
}

function toDomainProgramDay(row: ProgramDayRow): ProgramDay {
  return {
    id: row.id,
    programId: row.program_id,
    weekNumber: row.week_number,
    dayNumber: row.day_number,
    title: row.title,
    description: row.description,
    dayType: row.day_type as ProgramDayType,
    templateId: row.template_id,
  }
}

function toDomainEnrollment(row: EnrollmentRow): ProgramEnrollment {
  return {
    id: row.id,
    userId: row.user_id,
    programId: row.program_id,
    status: row.status as EnrollmentStatus,
    startedAt: row.started_at,
    completedAt: row.completed_at,
  }
}

function toDomainCompletion(row: CompletionRow): ProgramDayCompletion {
  return {
    id: row.id,
    userId: row.user_id,
    enrollmentId: row.enrollment_id,
    programDayId: row.program_day_id,
    sessionId: row.session_id,
    resistanceSessionId: row.resistance_session_id,
    completedAt: row.completed_at,
  }
}

export async function listTrainingPrograms(): Promise<TrainingProgram[]> {
  const { data, error } = await supabase.from('training_programs').select('*').order('name')
  if (error) throw error
  return data.map(toDomainProgram)
}

export async function getTrainingProgram(id: string): Promise<TrainingProgram | null> {
  const { data, error } = await supabase.from('training_programs').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? toDomainProgram(data) : null
}

export async function listProgramDays(programId: string): Promise<ProgramDay[]> {
  const { data, error } = await supabase
    .from('program_days')
    .select('*')
    .eq('program_id', programId)
    .order('week_number')
    .order('day_number')

  if (error) throw error
  return data.map(toDomainProgramDay)
}

// A user can have at most one enrollment 'active' at a time in this UI —
// same single-in-flight convention as getActivePracticeSession.
export async function getActiveEnrollment(userId: string): Promise<ProgramEnrollment | null> {
  const { data, error } = await supabase
    .from('user_program_enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data ? toDomainEnrollment(data) : null
}

export async function getEnrollment(id: string): Promise<ProgramEnrollment | null> {
  const { data, error } = await supabase.from('user_program_enrollments').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? toDomainEnrollment(data) : null
}

// Past enrollments (completed or abandoned), most recent first — the
// "finished programs" history surfaced on ProgramsScreen.
export async function listEnrollmentHistory(userId: string): Promise<ProgramEnrollment[]> {
  const { data, error } = await supabase
    .from('user_program_enrollments')
    .select('*')
    .eq('user_id', userId)
    .neq('status', 'active')
    .order('started_at', { ascending: false })

  if (error) throw error
  return data.map(toDomainEnrollment)
}

// The DB trigger `enforce_single_active_enrollment` supersedes (marks
// abandoned) any other active enrollment for this user, so a duplicate
// enroll attempt can never leave two rows active — see migration 0013.
export async function enrollInProgram(userId: string, programId: string): Promise<ProgramEnrollment> {
  const payload: EnrollmentInsert = { user_id: userId, program_id: programId }

  const { data, error } = await supabase.from('user_program_enrollments').insert(payload).select('*').single()

  if (error) throw error
  return toDomainEnrollment(data)
}

export async function abandonEnrollment(id: string): Promise<ProgramEnrollment> {
  const { data, error } = await supabase
    .from('user_program_enrollments')
    .update({ status: 'abandoned', completed_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return toDomainEnrollment(data)
}

export async function listCompletionsForEnrollment(enrollmentId: string): Promise<ProgramDayCompletion[]> {
  const { data, error } = await supabase
    .from('program_day_completions')
    .select('*')
    .eq('enrollment_id', enrollmentId)

  if (error) throw error
  return data.map(toDomainCompletion)
}

// Invoked after a practice session completes when that session was started
// from a program day (session.programDayId/enrollmentId set). Records the
// completion, then recomputes progress and closes out the enrollment if
// that was the program's last day. A no-op if the enrollment is no longer
// active (already completed/abandoned) or the session isn't program-linked.
export async function recordProgramDayCompletion(session: PracticeSession): Promise<void> {
  if (!session.programDayId || !session.enrollmentId) return

  const enrollment = await getEnrollment(session.enrollmentId)
  if (!enrollment || enrollment.status !== 'active') return

  const completionPayload: CompletionInsert = {
    user_id: session.userId,
    enrollment_id: session.enrollmentId,
    program_day_id: session.programDayId,
    session_id: session.id,
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
