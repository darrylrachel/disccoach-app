import type { Equipment, EquipmentCategory } from '../../../domain/resistanceTraining/models'
import { EQUIPMENT_PRESETS } from '../../../domain/resistanceTraining/equipmentPresets'

const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  free_weight: 'Free weights',
  machine: 'Machines',
  bodyweight: 'Bodyweight',
  accessory: 'Accessories',
}

const CATEGORY_ORDER: EquipmentCategory[] = ['bodyweight', 'free_weight', 'accessory', 'machine']

const PRESET_LABELS: Record<keyof typeof EQUIPMENT_PRESETS, string> = {
  minimal: 'Minimal',
  garage: 'Garage gym',
  commercial: 'Commercial gym',
}

interface EquipmentPickerProps {
  equipment: Equipment[]
  selectedIds: Set<string>
  onChange: (ids: Set<string>) => void
}

export function EquipmentPicker({ equipment, selectedIds, onChange }: EquipmentPickerProps) {
  const bySlug = new Map(equipment.map((e) => [e.slug, e.id]))
  const byCategory = new Map<EquipmentCategory, Equipment[]>()
  for (const item of equipment) {
    const list = byCategory.get(item.category) ?? []
    list.push(item)
    byCategory.set(item.category, list)
  }

  function toggle(id: string) {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    onChange(next)
  }

  function applyPreset(preset: keyof typeof EQUIPMENT_PRESETS) {
    const ids = EQUIPMENT_PRESETS[preset]
      .map((slug) => bySlug.get(slug))
      .filter((id): id is string => id !== undefined)
    onChange(new Set(ids))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(EQUIPMENT_PRESETS) as Array<keyof typeof EQUIPMENT_PRESETS>).map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => applyPreset(preset)}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 transition-colors hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
          >
            {PRESET_LABELS[preset]}
          </button>
        ))}
      </div>

      {CATEGORY_ORDER.filter((category) => byCategory.has(category)).map((category) => (
        <div key={category}>
          <p className="mb-2 text-xs uppercase tracking-wide text-white/55">{CATEGORY_LABELS[category]}</p>
          <div className="flex flex-wrap gap-2">
            {byCategory.get(category)!.map((item) => {
              const selected = selectedIds.has(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-pressed={selected}
                  className={`inline-flex min-h-11 items-center justify-center rounded-lg border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green ${
                    selected
                      ? 'border-brand-green bg-brand-green/10 text-white'
                      : 'border-white/15 text-white/70 hover:border-white/30'
                  }`}
                >
                  {item.name}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
