import { describe, expect, it } from 'vitest'
import { groupDiscsByMold } from './collection'
import type { Disc, DiscWithCatalog } from './models'

function makeDisc(overrides: Partial<Disc> & { id: string }): DiscWithCatalog {
  const disc: Disc = {
    userId: 'user-1',
    catalogId: null,
    customManufacturer: 'Discraft',
    customMoldName: 'Roc3',
    nickname: null,
    plastic: null,
    weight: null,
    color: null,
    condition: 'good',
    beatInLevel: 0,
    personalSpeed: null,
    personalGlide: null,
    personalTurn: null,
    personalFade: null,
    confidenceRating: null,
    notes: null,
    favoriteUses: null,
    status: 'active',
    statusChangedAt: null,
    ...overrides,
  }
  return { disc, catalogEntry: null }
}

describe('groupDiscsByMold', () => {
  it('groups discs sharing a custom manufacturer/mold together', () => {
    const discs = [makeDisc({ id: 'a' }), makeDisc({ id: 'b' }), makeDisc({ id: 'c', customMoldName: 'Zone' })]

    const groups = groupDiscsByMold(discs, new Set())

    expect(groups).toHaveLength(2)
    const roc3 = groups.find((g) => g.moldName === 'Roc3')!
    expect(roc3.ownedCount).toBe(2)
  })

  it('splits owned discs into in-bag vs in-storage based on the bag-disc-id set', () => {
    const discs = [makeDisc({ id: 'a' }), makeDisc({ id: 'b' }), makeDisc({ id: 'c' }), makeDisc({ id: 'd' })]

    const groups = groupDiscsByMold(discs, new Set(['a', 'b']))

    expect(groups).toHaveLength(1)
    expect(groups[0].ownedCount).toBe(4)
    expect(groups[0].inBagCount).toBe(2)
    expect(groups[0].inStorageCount).toBe(2)
  })

  it('groups catalog-linked discs by catalogId rather than name', () => {
    const disc = makeDisc({ id: 'a', catalogId: 'catalog-1', customManufacturer: null, customMoldName: null })
    disc.catalogEntry = {
      id: 'catalog-1',
      manufacturer: 'Innova',
      moldName: 'Destroyer',
      plasticTypes: ['Star'],
      speed: 12,
      glide: 5,
      turn: -1,
      fade: 3,
      category: 'distance_driver',
      stability: 'overstable',
    }

    const groups = groupDiscsByMold([disc], new Set())

    expect(groups).toHaveLength(1)
    expect(groups[0].key).toBe('catalog-1')
    expect(groups[0].manufacturer).toBe('Innova')
  })

  it('sorts groups alphabetically by manufacturer + mold name', () => {
    const groups = groupDiscsByMold(
      [makeDisc({ id: 'a', customManufacturer: 'Anhyzer', customMoldName: 'Destroyer' }), makeDisc({ id: 'b' })],
      new Set(),
    )

    expect(groups.map((g) => g.moldName)).toEqual(['Destroyer', 'Roc3'])
  })
})
