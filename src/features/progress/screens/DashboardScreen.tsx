import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBags } from '../../bags/hooks/useBags'
import { useBagAnalysis } from '../../bags/hooks/useBagAnalysis'
import { CATEGORY_LABELS } from '../../practice/categoryLabels'
import { Card } from '../../../components/ui/Card'
import { SectionLabel } from '../../../components/ui/SectionLabel'
import { summarizeTrend } from '../../../domain/progress/progressCalculations'
import type { TrendSummary } from '../../../domain/progress/models'
import { usePersonalRecords } from '../hooks/usePersonalRecords'
import { useRecentPracticeSessions } from '../hooks/usePracticeHistory'
import { usePuttingTrend } from '../hooks/usePuttingTrend'
import { useStreaks } from '../hooks/useStreaks'
import { recordLabel, recordValueLabel } from '../recordLabels'
import { TrendSparkline } from '../../../components/charts/TrendSparkline'
import { programDayLabel } from '../../../domain/programs/models'
import { recommendProgramForGoal } from '../../../domain/programs/recommendation'
import { usePrograms, useProgram } from '../../programs/hooks/usePrograms'
import { useActiveEnrollment, useProgramProgress } from '../../programs/hooks/useProgramEnrollment'
import { useProfile } from '../../profile/hooks/useProfile'

const QUICK_ACTIONS = [
  { to: '/practice', icon: '🥏', label: 'Start Practice' },
  { to: '/history', icon: '📜', label: 'View History' },
  { to: '/bags', icon: '🎒', label: 'Bag Builder' },
]

const EMPTY_STATE_CLASS =
  'flex items-center justify-between gap-3 rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-4 text-sm text-white/60 transition-colors hover:border-white/30 hover:text-white/80'

const CARD_LINK_CLASS =
  'flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-white/20'

function formatSessionDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function trendLabel(summary: TrendSummary): string {
  const magnitude = Math.abs(summary.change)
  if (summary.direction === 'stable') return '→ Stable'
  if (summary.direction === 'improving') return `↑ Improving (+${magnitude}%)`
  return `↓ Down ${magnitude}%`
}

function trendColorClass(summary: TrendSummary): string {
  if (summary.direction === 'improving') return 'text-brand-green'
  if (summary.direction === 'declining') return 'text-red-400'
  return 'text-white/50'
}

export function DashboardScreen() {
  const { data: bags } = useBags()
  const activeBag = bags?.find((bag) => bag.isActive) ?? null
  const { analysis: activeBagAnalysis } = useBagAnalysis(activeBag?.id)

  const { streaks, practicedToday } = useStreaks()
  const { data: activeEnrollment } = useActiveEnrollment()
  const { data: activeProgram } = useProgram(activeEnrollment?.programId)
  const { progress: activeProgramProgress } = useProgramProgress(activeEnrollment?.programId, activeEnrollment?.id)
  const { data: profile } = useProfile()
  const { data: allPrograms } = usePrograms()
  const recommendedProgram = recommendProgramForGoal(profile?.primaryGoal ?? null, allPrograms ?? [])
  const { data: records } = usePersonalRecords()
  const { data: recentSessions, isLoading: sessionsLoading } = useRecentPracticeSessions(5)
  const { distances, trendFor } = usePuttingTrend()

  const [selectedDistance, setSelectedDistance] = useState<number | null>(null)
  const effectiveDistance = selectedDistance ?? distances[0] ?? null
  const trend = effectiveDistance !== null ? trendFor(effectiveDistance) : []
  const trendSummary = trend.length >= 2 ? summarizeTrend(trend) : null

  const streakMessage = !streaks
    ? null
    : practicedToday
      ? 'Great job! Your streak is safe for today.'
      : streaks.currentStreak > 0
        ? 'Complete one practice session today to keep your streak alive.'
        : 'Start a streak — complete a practice session today.'

  return (
    <div className="px-6 py-8 pb-24">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">DiscCoach</h1>
        <Link
          to="/account"
          aria-label="Account"
          className="flex min-h-11 min-w-11 items-center justify-center text-white/50 hover:text-white"
        >
          ⚙️
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/5 py-3 text-center transition-colors hover:border-brand-green/40"
          >
            <span className="text-lg">{action.icon}</span>
            <span className="text-xs font-medium text-white/80">{action.label}</span>
          </Link>
        ))}
      </div>

      <Card className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-white">
              🔥 {streaks?.currentStreak ?? 0}
            </p>
            <SectionLabel>Current streak</SectionLabel>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{streaks?.longestStreak ?? 0}</p>
            <SectionLabel>Longest streak</SectionLabel>
          </div>
        </div>
        {streakMessage && <p className="text-sm text-white/60">{streakMessage}</p>}
      </Card>

      <SectionLabel className="mb-3">Training program</SectionLabel>
      {activeEnrollment ? (
        <Link to="/programs/active" className={`mb-8 ${CARD_LINK_CLASS}`}>
          <div>
            <p className="font-semibold text-white">{activeProgram?.name ?? 'Training program'}</p>
            <p className="text-xs text-white/50">
              {activeProgramProgress?.currentDay
                ? programDayLabel(activeProgramProgress.currentDay)
                : 'Program complete'}
              {' · '}
              {activeProgramProgress?.percentComplete ?? 0}%
            </p>
          </div>
          <span className="shrink-0 font-medium text-brand-green">Continue training →</span>
        </Link>
      ) : recommendedProgram ? (
        <Link to={`/programs/${recommendedProgram.id}`} className={`mb-8 ${EMPTY_STATE_CLASS}`}>
          <span>
            Recommended for you: <span className="text-white">{recommendedProgram.name}</span>
          </span>
          <span className="shrink-0 font-medium text-brand-green">View program →</span>
        </Link>
      ) : (
        <Link to="/programs" className={`mb-8 ${EMPTY_STATE_CLASS}`}>
          <span>No active training program — follow a structured plan built around your goals.</span>
          <span className="shrink-0 font-medium text-brand-green">Start a training program →</span>
        </Link>
      )}

      <SectionLabel className="mb-3">Active bag</SectionLabel>
      {activeBag ? (
        <Link to={`/bags/${activeBag.id}`} className={`mb-8 ${CARD_LINK_CLASS}`}>
          <div>
            <p className="font-semibold text-white">{activeBag.name}</p>
            <p className="text-xs text-white/50">{activeBagAnalysis?.discCount ?? 0} discs</p>
          </div>
          {activeBagAnalysis && activeBagAnalysis.insights.length > 0 && (
            <span className="shrink-0 rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold text-brand-gold">
              {activeBagAnalysis.insights.length} insight{activeBagAnalysis.insights.length === 1 ? '' : 's'}
            </span>
          )}
        </Link>
      ) : bags && bags.length > 0 ? (
        <Link to="/bags" className={`mb-8 ${EMPTY_STATE_CLASS}`}>
          <span>No default bag set — choose one to see it here.</span>
          <span className="shrink-0 font-medium text-brand-green">Choose bag →</span>
        </Link>
      ) : (
        <Link to="/bags" className={`mb-8 ${EMPTY_STATE_CLASS}`}>
          <span>You haven&apos;t built a bag yet — add the discs you actually throw.</span>
          <span className="shrink-0 font-medium text-brand-green">Build your bag →</span>
        </Link>
      )}

      <SectionLabel className="mb-3">Personal records</SectionLabel>
      {records && records.length > 0 ? (
        <div className="mb-8 grid grid-cols-2 gap-3">
          {records.map((record) => (
            <Card key={record.recordType}>
              <p className="text-lg font-bold text-white">{recordValueLabel(record.recordType, record.value)}</p>
              <SectionLabel>{recordLabel(record.recordType)}</SectionLabel>
            </Card>
          ))}
        </div>
      ) : (
        <Link to="/practice" className={`mb-8 ${EMPTY_STATE_CLASS}`}>
          <span>No personal records yet — complete a session to set your first one.</span>
          <span className="shrink-0 font-medium text-brand-green">Start practice →</span>
        </Link>
      )}

      <SectionLabel className="mb-3">Putting trend</SectionLabel>
      {distances.length === 0 ? (
        <Link to="/practice" className={`mb-8 ${EMPTY_STATE_CLASS}`}>
          <span>No putting trends yet — log a putting session to start tracking accuracy.</span>
          <span className="shrink-0 font-medium text-brand-green">Start practice →</span>
        </Link>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex gap-2">
              {distances.map((distance) => (
                <button
                  key={distance}
                  type="button"
                  onClick={() => setSelectedDistance(distance)}
                  className={`inline-flex min-h-11 items-center justify-center rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green ${
                    distance === effectiveDistance
                      ? 'bg-brand-green text-black'
                      : 'border border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  {distance}ft
                </button>
              ))}
            </div>
            {trendSummary && (
              <span className={`shrink-0 text-xs font-semibold ${trendColorClass(trendSummary)}`}>
                {trendLabel(trendSummary)}
              </span>
            )}
          </div>
          <Card className="mb-8">
            {trend.length > 1 ? (
              <TrendSparkline points={trend} />
            ) : (
              <p className="text-sm text-white/50">
                Log a few more {effectiveDistance}ft sessions to see a trend here.
              </p>
            )}
          </Card>
        </>
      )}

      <div className="mb-3 flex items-center justify-between">
        <SectionLabel>Recent sessions</SectionLabel>
        <Link to="/history" className="text-xs text-brand-green">
          View all
        </Link>
      </div>

      {sessionsLoading && <p className="text-white/50">Loading sessions…</p>}
      {!sessionsLoading && recentSessions?.length === 0 && (
        <Link to="/practice" className={EMPTY_STATE_CLASS}>
          <span>No sessions yet — your first practice session will show up here.</span>
          <span className="shrink-0 font-medium text-brand-green">Start practice →</span>
        </Link>
      )}

      <div className="flex flex-col gap-2">
        {recentSessions?.map((session) => (
          <Link key={session.id} to={`/practice/${session.id}/summary`} className={CARD_LINK_CLASS}>
            <div>
              <p className="font-medium text-white">{CATEGORY_LABELS[session.category]}</p>
              <p className="text-xs text-white/50">
                {formatSessionDate(session.startedAt)} · {session.durationMinutes} min
              </p>
            </div>
            {session.status === 'abandoned' && (
              <span className="shrink-0 rounded-full border border-white/20 px-3 py-1 text-xs text-white/50">
                Abandoned
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-white/40">
        <Link to="/about" className="hover:text-white/70">
          About
        </Link>
        <Link to="/support" className="hover:text-white/70">
          Support
        </Link>
        <Link to="/privacy" className="hover:text-white/70">
          Privacy
        </Link>
        <Link to="/terms" className="hover:text-white/70">
          Terms
        </Link>
      </div>
    </div>
  )
}
