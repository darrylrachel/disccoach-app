export type PracticeCategory = 'putting' | 'distance' | 'field_work' | 'accuracy'
export type TemplateDifficulty = 'beginner' | 'intermediate' | 'advanced'
export type SessionStatus = 'in_progress' | 'completed' | 'abandoned'
export type MetricType = 'makes_attempts' | 'distance_feet' | 'completed_boolean'

export interface DrillStep {
  label: string
  reps: number
}

export interface PracticeTemplate {
  id: string
  name: string
  category: PracticeCategory
  difficulty: TemplateDifficulty
  durationMinutes: number
  structure: DrillStep[]
}

export interface PracticeSession {
  id: string
  userId: string
  templateId: string | null
  category: PracticeCategory
  durationMinutes: number
  status: SessionStatus
  startedAt: string
  completedAt: string | null
  // Set when this session was launched from a training program day (see
  // domain/programs/) rather than directly from Practice Mode.
  programDayId: string | null
  enrollmentId: string | null
}

export interface NewPracticeSessionInput {
  templateId: string | null
  category: PracticeCategory
  durationMinutes: number
  programDayId?: string | null
  enrollmentId?: string | null
}

export interface PracticeLogEntry {
  id: string
  sessionId: string
  userId: string
  drillLabel: string
  metricType: MetricType
  attempts: number | null
  makes: number | null
  distanceFeet: number | null
  notes: string | null
  loggedAt: string
}

export interface NewPracticeLogEntryInput {
  drillLabel: string
  metricType: MetricType
  attempts?: number | null
  makes?: number | null
  distanceFeet?: number | null
  notes?: string | null
}

// Which result shape a drill is logged with, keyed by session category.
// Putting and accuracy work are both "how many did you hit" drills;
// distance work records a single best/measured throw; field work drills
// (shot shaping across varied lies) are pass/fail per rep-set, not a count.
const METRIC_TYPE_BY_CATEGORY: Record<PracticeCategory, MetricType> = {
  putting: 'makes_attempts',
  accuracy: 'makes_attempts',
  distance: 'distance_feet',
  field_work: 'completed_boolean',
}

export function metricTypeForCategory(category: PracticeCategory): MetricType {
  return METRIC_TYPE_BY_CATEGORY[category]
}
