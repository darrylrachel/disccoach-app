import type { TrendPoint } from '../../domain/progress/models'

interface TrendSparklineProps {
  points: TrendPoint[]
  height?: number
}

const WIDTH = 300

export function TrendSparkline({ points, height = 80 }: TrendSparklineProps) {
  if (points.length === 0) return null

  const values = points.map((p) => p.value)
  const max = Math.max(...values, 100)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const stepX = points.length > 1 ? WIDTH / (points.length - 1) : 0

  const coords = points.map((point, i) => ({
    x: points.length > 1 ? i * stepX : WIDTH / 2,
    y: height - ((point.value - min) / range) * height,
  }))

  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${WIDTH} ${height}`} className="h-20 w-full overflow-visible" preserveAspectRatio="none">
      <path
        d={path}
        fill="none"
        className="stroke-brand-green"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {coords.map((c, i) => (
        <circle key={points[i].date} cx={c.x} cy={c.y} r={3} className="fill-brand-green" />
      ))}
    </svg>
  )
}
