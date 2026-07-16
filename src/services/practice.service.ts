import { supabase } from './supabaseClient'
import type { Database } from '../types/database.types'
import type {
  DrillStep,
  MetricType,
  NewPracticeLogEntryInput,
  NewPracticeSessionInput,
  PracticeCategory,
  PracticeLogEntry,
  PracticeSession,
  PracticeTemplate,
  SessionStatus,
  TemplateDifficulty,
} from '../domain/practice/models'

type TemplateRow = Database['public']['Tables']['practice_session_templates']['Row']
type SessionRow = Database['public']['Tables']['practice_sessions']['Row']
type SessionInsert = Database['public']['Tables']['practice_sessions']['Insert']
type LogEntryRow = Database['public']['Tables']['practice_log_entries']['Row']
type LogEntryInsert = Database['public']['Tables']['practice_log_entries']['Insert']

function toDomainTemplate(row: TemplateRow): PracticeTemplate {
  return {
    id: row.id,
    name: row.name,
    category: row.category as PracticeCategory,
    difficulty: row.difficulty as TemplateDifficulty,
    durationMinutes: row.duration_minutes,
    structure: row.structure as unknown as DrillStep[],
  }
}

function toDomainSession(row: SessionRow): PracticeSession {
  return {
    id: row.id,
    userId: row.user_id,
    templateId: row.template_id,
    category: row.category as PracticeCategory,
    durationMinutes: row.duration_minutes,
    status: row.status as SessionStatus,
    startedAt: row.started_at,
    completedAt: row.completed_at,
  }
}

function toDomainLogEntry(row: LogEntryRow): PracticeLogEntry {
  return {
    id: row.id,
    sessionId: row.session_id,
    userId: row.user_id,
    drillLabel: row.drill_label,
    metricType: row.metric_type as MetricType,
    attempts: row.attempts,
    makes: row.makes,
    distanceFeet: row.distance_feet,
    notes: row.notes,
    loggedAt: row.logged_at,
  }
}

export async function listPracticeTemplates(category?: PracticeCategory): Promise<PracticeTemplate[]> {
  let request = supabase.from('practice_session_templates').select('*')
  if (category) request = request.eq('category', category)

  const { data, error } = await request.order('duration_minutes')
  if (error) throw error
  return data.map(toDomainTemplate)
}

export async function getPracticeTemplate(id: string): Promise<PracticeTemplate | null> {
  const { data, error } = await supabase
    .from('practice_session_templates')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data ? toDomainTemplate(data) : null
}

export async function createPracticeSession(
  userId: string,
  input: NewPracticeSessionInput,
): Promise<PracticeSession> {
  const payload: SessionInsert = {
    user_id: userId,
    template_id: input.templateId,
    category: input.category,
    duration_minutes: input.durationMinutes,
  }

  const { data, error } = await supabase
    .from('practice_sessions')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw error
  return toDomainSession(data)
}

export async function getPracticeSession(id: string): Promise<PracticeSession | null> {
  const { data, error } = await supabase
    .from('practice_sessions')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data ? toDomainSession(data) : null
}

// A user can have at most one session in flight at a time in this UI (the
// active-session screen is the only place sessions are created), so the
// most recently started in-progress row is the one to resume.
export async function getActivePracticeSession(userId: string): Promise<PracticeSession | null> {
  const { data, error } = await supabase
    .from('practice_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data ? toDomainSession(data) : null
}

// Flexible enough to serve the streak calculation (completed only), the
// dashboard's recent-sessions widget (completed + abandoned, limited), and
// the full history screen (completed + abandoned, unlimited).
export async function listPracticeSessionsForUser(
  userId: string,
  options: { statuses?: SessionStatus[]; limit?: number } = {},
): Promise<PracticeSession[]> {
  let request = supabase.from('practice_sessions').select('*').eq('user_id', userId)
  if (options.statuses) request = request.in('status', options.statuses)
  request = request.order('started_at', { ascending: false })
  if (options.limit) request = request.limit(options.limit)

  const { data, error } = await request
  if (error) throw error
  return data.map(toDomainSession)
}

export async function completePracticeSession(id: string): Promise<PracticeSession> {
  const { data, error } = await supabase
    .from('practice_sessions')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return toDomainSession(data)
}

export async function abandonPracticeSession(id: string): Promise<PracticeSession> {
  const { data, error } = await supabase
    .from('practice_sessions')
    .update({ status: 'abandoned', completed_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return toDomainSession(data)
}

export async function listSessionLogEntries(sessionId: string): Promise<PracticeLogEntry[]> {
  const { data, error } = await supabase
    .from('practice_log_entries')
    .select('*')
    .eq('session_id', sessionId)
    .order('logged_at')

  if (error) throw error
  return data.map(toDomainLogEntry)
}

// Every putting/accuracy result a user has ever logged, for progress trend
// charts. `logged_at` lets the caller bucket by day without a session join.
export async function listPuttingLogEntriesForUser(userId: string): Promise<PracticeLogEntry[]> {
  const { data, error } = await supabase
    .from('practice_log_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('metric_type', 'makes_attempts')
    .order('logged_at')

  if (error) throw error
  return data.map(toDomainLogEntry)
}

export async function addLogEntry(
  userId: string,
  sessionId: string,
  input: NewPracticeLogEntryInput,
): Promise<PracticeLogEntry> {
  const payload: LogEntryInsert = {
    session_id: sessionId,
    user_id: userId,
    drill_label: input.drillLabel,
    metric_type: input.metricType,
    attempts: input.attempts ?? null,
    makes: input.makes ?? null,
    distance_feet: input.distanceFeet ?? null,
    notes: input.notes ?? null,
  }

  const { data, error } = await supabase
    .from('practice_log_entries')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw error
  return toDomainLogEntry(data)
}
