interface FlightNumberBadgesProps {
  numbers: {
    speed: number | null
    glide: number | null
    turn: number | null
    fade: number | null
  }
}

const FIELDS = [
  { key: 'speed', label: 'S' },
  { key: 'glide', label: 'G' },
  { key: 'turn', label: 'T' },
  { key: 'fade', label: 'F' },
] as const

export function FlightNumberBadges({ numbers }: FlightNumberBadgesProps) {
  return (
    <div className="flex gap-1.5 text-xs">
      {FIELDS.map(({ key, label }) => (
        <div
          key={key}
          className="flex w-9 flex-col items-center rounded-md bg-white/5 px-1 py-1"
        >
          <span className="text-[10px] text-white/40">{label}</span>
          <span className="font-semibold text-white">{numbers[key] ?? '–'}</span>
        </div>
      ))}
    </div>
  )
}
