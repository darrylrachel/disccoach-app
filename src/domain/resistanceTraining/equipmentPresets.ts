// Pure UI convenience for bulk-selecting common equipment sets — not stored
// anywhere. A user's actual inventory is always the freeform set they pick
// in EquipmentPicker; these presets just pre-check boxes for them, since
// real users mix-and-match rather than fitting one fixed tier.
export const EQUIPMENT_PRESETS: Record<'minimal' | 'garage' | 'commercial', string[]> = {
  minimal: ['bodyweight', 'resistance_bands', 'adjustable_dumbbells'],
  garage: [
    'bodyweight',
    'barbell',
    'plates',
    'squat_rack',
    'adjustable_bench',
    'pull_up_bar',
    'landmine',
    'kettlebells',
    'medicine_ball',
  ],
  commercial: [
    'bodyweight',
    'barbell',
    'plates',
    'adjustable_bench',
    'pull_up_bar',
    'cable_machine',
    'selectorized_machines',
    'smith_machine',
    'adjustable_dumbbells',
    'kettlebells',
  ],
}
