import { Link } from 'react-router-dom'
import type { DiscWithCatalog } from '../../domain/disc/models'
import { resolveEffectiveFlightNumbers } from '../../domain/disc/flightNumbers'
import { FlightNumberBadges } from './FlightNumberBadges'

interface DiscCardProps {
  discWithCatalog: DiscWithCatalog
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  retired: 'Retired',
  lost: 'Lost',
  traded: 'Traded',
}

export function DiscCard({ discWithCatalog }: DiscCardProps) {
  const { disc, catalogEntry } = discWithCatalog
  const numbers = resolveEffectiveFlightNumbers(disc, catalogEntry)

  const title = disc.nickname || catalogEntry?.moldName || disc.customMoldName || 'Unnamed disc'
  const subtitle = catalogEntry
    ? `${catalogEntry.manufacturer} ${catalogEntry.moldName}`
    : `${disc.customManufacturer} ${disc.customMoldName}`

  return (
    <Link
      to={`/discs/${disc.id}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-white/20"
    >
      <div className="min-w-0">
        <p className="truncate font-semibold text-white">{title}</p>
        <p className="truncate text-xs text-white/50">{subtitle}</p>
        {disc.status !== 'active' && (
          <span className="mt-1 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase text-white/60">
            {STATUS_LABELS[disc.status]}
          </span>
        )}
      </div>
      <FlightNumberBadges numbers={numbers} />
    </Link>
  )
}
