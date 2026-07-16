import type { BagAnalysis, ShotShape, StabilityBand } from '../../../domain/bag/bagAnalysis'
import { SLOT_LABELS } from '../slotLabels'

interface BagDashboardProps {
  analysis: BagAnalysis
}

const STABILITY_LABELS: Record<StabilityBand, string> = {
  understable: 'Understable',
  neutral: 'Neutral',
  overstable: 'Overstable',
}

const STABILITY_COLORS: Record<StabilityBand, string> = {
  understable: 'bg-sky-400',
  neutral: 'bg-brand-green',
  overstable: 'bg-brand-gold',
}

const SHOT_SHAPE_LABELS: Record<ShotShape, string> = {
  straight: 'Straight',
  hyzer: 'Hyzer',
  turnover: 'Turnover',
  distance: 'Distance',
  utility: 'Utility',
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs uppercase tracking-wide text-white/55">{label}</p>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="mb-3 text-xs uppercase tracking-wide text-white/55">{title}</p>
      {children}
    </div>
  )
}

function Bar({ fraction, colorClassName }: { fraction: number; colorClassName: string }) {
  return (
    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full ${colorClassName}`}
        style={{ width: `${Math.round(fraction * 100)}%` }}
      />
    </div>
  )
}

export function BagDashboard({ analysis }: BagDashboardProps) {
  const maxSlotCount = Math.max(1, ...analysis.slotCoverage.map((s) => s.count))
  const stabilityTotal = analysis.stabilityCoverage.reduce((sum, c) => sum + c.count, 0) || 1

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Total discs" value={analysis.discCount} />
        <StatTile
          label="Slots in use"
          value={analysis.slotCoverage.filter((s) => s.count > 0).length}
        />
        <StatTile label="Insights" value={analysis.insights.length} />
      </div>

      <SectionCard title="Discs by category">
        <div className="flex flex-col gap-2">
          {analysis.slotCoverage.map(({ slot, count }) => (
            <div key={slot} className="flex items-center gap-3 text-sm">
              <span className="w-32 shrink-0 text-white/70">{SLOT_LABELS[slot]}</span>
              <Bar fraction={count / maxSlotCount} colorClassName="bg-brand-green" />
              <span className="w-5 shrink-0 text-right text-white/50">{count}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Speed coverage">
        <div className="flex flex-col gap-2">
          {analysis.speedBandCoverage.map((band) => (
            <div key={band.band} className="flex items-center gap-3 text-sm">
              <span className="w-32 shrink-0 capitalize text-white/70">
                {band.band} ({band.rangeStart}-{band.rangeEnd})
              </span>
              <Bar
                fraction={band.count / Math.max(1, analysis.discCount)}
                colorClassName="bg-brand-gold"
              />
              <span className="w-5 shrink-0 text-right text-white/50">{band.count}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Stability distribution">
        <div className="flex flex-col gap-2">
          {analysis.stabilityCoverage.map((band) => (
            <div key={band.band} className="flex items-center gap-3 text-sm">
              <span className="w-32 shrink-0 text-white/70">{STABILITY_LABELS[band.band]}</span>
              <Bar fraction={band.count / stabilityTotal} colorClassName={STABILITY_COLORS[band.band]} />
              <span className="w-5 shrink-0 text-right text-white/50">{band.count}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Shot shape coverage">
        <div className="flex flex-wrap gap-2">
          {analysis.shotShapeCoverage.map((shape) => (
            <span
              key={shape.shape}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                shape.covered
                  ? 'bg-brand-green/15 text-brand-green'
                  : 'bg-white/5 text-white/55'
              }`}
            >
              {SHOT_SHAPE_LABELS[shape.shape]}
            </span>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Coach's notes">
        {analysis.insights.length === 0 ? (
          <p className="text-sm text-white/50">
            No standout gaps or overlaps yet — keep building your bag.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {analysis.insights.map((insight) => (
              <li
                key={insight.id}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  insight.severity === 'warning'
                    ? 'border-brand-gold/30 bg-brand-gold/10 text-brand-gold'
                    : 'border-white/10 bg-white/5 text-white/70'
                }`}
              >
                {insight.message}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  )
}
