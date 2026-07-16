import { MAX_DISTANCE_RECORD_TYPE, puttingDistanceFromRecordType, type RecordType } from '../../domain/progress/models'

export function recordLabel(recordType: RecordType): string {
  if (recordType === MAX_DISTANCE_RECORD_TYPE) return 'Max distance'
  const distance = puttingDistanceFromRecordType(recordType)
  if (distance !== null) return `${distance}ft putting`
  return recordType
}

export function recordValueLabel(recordType: RecordType, value: number): string {
  if (recordType === MAX_DISTANCE_RECORD_TYPE) return `${value} ft`
  if (puttingDistanceFromRecordType(recordType) !== null) return `${value}%`
  return String(value)
}

// "+18 ft" / "+7%" for a beaten record, or a first-time-set label when there
// was no previous value to compare against.
export function recordImprovementLabel(recordType: RecordType, previousValue: number | null, newValue: number): string {
  if (previousValue === null) return 'First record set'
  const unit = recordType === MAX_DISTANCE_RECORD_TYPE ? ' ft' : '%'
  return `+${newValue - previousValue}${unit}`
}
