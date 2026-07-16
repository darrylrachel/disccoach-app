import { supabase } from './supabaseClient'
import type { Database } from '../types/database.types'
import type { NewPersonalRecordInput, PersonalRecord, RecordType } from '../domain/progress/models'
import { detectSessionRecords } from '../domain/progress/progressCalculations'
import { listSessionLogEntries } from './practice.service'

type PersonalRecordRow = Database['public']['Tables']['personal_records']['Row']
type PersonalRecordInsert = Database['public']['Tables']['personal_records']['Insert']

function toDomainPersonalRecord(row: PersonalRecordRow): PersonalRecord {
  return {
    id: row.id,
    userId: row.user_id,
    recordType: row.record_type as RecordType,
    value: row.value,
    achievedAt: row.achieved_at,
    sourceSessionId: row.source_session_id,
  }
}

export async function listPersonalRecords(userId: string): Promise<PersonalRecord[]> {
  const { data, error } = await supabase.from('personal_records').select('*').eq('user_id', userId)

  if (error) throw error
  return data.map(toDomainPersonalRecord)
}

async function upsertPersonalRecords(
  userId: string,
  records: NewPersonalRecordInput[],
): Promise<PersonalRecord[]> {
  const payload: PersonalRecordInsert[] = records.map((record) => ({
    user_id: userId,
    record_type: record.recordType,
    value: record.value,
    achieved_at: record.achievedAt,
    source_session_id: record.sourceSessionId,
  }))

  const { data, error } = await supabase
    .from('personal_records')
    .upsert(payload, { onConflict: 'user_id,record_type' })
    .select('*')

  if (error) throw error
  return data.map(toDomainPersonalRecord)
}

export interface PersonalRecordsUpdateResult {
  records: PersonalRecord[]
  // The subset that this specific session actually beat, previous value
  // included, so the caller can render a "you just broke a PR" moment
  // without a second query.
  brokenRecords: NewPersonalRecordInput[]
}

// Invoked after a session is marked completed: compares that session's
// results against the user's current bests and upserts any that were
// beaten.
export async function updatePersonalRecordsForSession(
  userId: string,
  sessionId: string,
): Promise<PersonalRecordsUpdateResult> {
  const [logEntries, existingRecords] = await Promise.all([
    listSessionLogEntries(sessionId),
    listPersonalRecords(userId),
  ])

  const candidates = detectSessionRecords(sessionId, logEntries, existingRecords)
  if (candidates.length === 0) return { records: existingRecords, brokenRecords: [] }

  const updated = await upsertPersonalRecords(userId, candidates)
  const updatedTypes = new Set(updated.map((record) => record.recordType))
  const records = [...existingRecords.filter((record) => !updatedTypes.has(record.recordType)), ...updated]
  return { records, brokenRecords: candidates }
}
