import type { DiscWithCatalog } from './models'

// Groups a user's individual physical discs (each `discs` row already
// represents one physical disc) by mold identity, so "how many do I own of
// this mold" can be read off the existing per-disc data instead of a
// separate stored counter. In-bag/in-storage counts are derived the same
// way `bagAnalysis.ts` derives bag insights — computed at read time, never
// persisted, so they can never drift from the underlying rows.
export interface MoldGroup {
  key: string
  manufacturer: string
  moldName: string
  discs: DiscWithCatalog[]
  ownedCount: number
  inBagCount: number
  inStorageCount: number
}

function moldKey(discWithCatalog: DiscWithCatalog): string {
  const { disc, catalogEntry } = discWithCatalog
  if (catalogEntry) return disc.catalogId!
  return `custom:${disc.customManufacturer}::${disc.customMoldName}`
}

export function groupDiscsByMold(discs: DiscWithCatalog[], discIdsInBags: Set<string>): MoldGroup[] {
  const groups = new Map<string, MoldGroup>()

  for (const item of discs) {
    const key = moldKey(item)
    const { disc, catalogEntry } = item
    const manufacturer = catalogEntry?.manufacturer ?? disc.customManufacturer ?? ''
    const moldName = catalogEntry?.moldName ?? disc.customMoldName ?? ''

    let group = groups.get(key)
    if (!group) {
      group = { key, manufacturer, moldName, discs: [], ownedCount: 0, inBagCount: 0, inStorageCount: 0 }
      groups.set(key, group)
    }

    group.discs.push(item)
    group.ownedCount += 1
    if (discIdsInBags.has(disc.id)) {
      group.inBagCount += 1
    } else {
      group.inStorageCount += 1
    }
  }

  return Array.from(groups.values()).sort((a, b) =>
    `${a.manufacturer} ${a.moldName}`.localeCompare(`${b.manufacturer} ${b.moldName}`),
  )
}
