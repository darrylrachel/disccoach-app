import { useMemo } from 'react'
import { analyzeBag } from '../../../domain/bag/bagAnalysis'
import { resolveEffectiveFlightNumbers } from '../../../domain/disc/flightNumbers'
import type { AnalyzedDisc } from '../../../domain/bag/bagAnalysis'
import type { BagDiscWithDisc } from '../../../services/bags.service'
import { useBagDiscs } from './useBag'

function discLabel(discWithCatalog: BagDiscWithDisc['discWithCatalog']): string {
  const { disc, catalogEntry } = discWithCatalog
  return disc.nickname || catalogEntry?.moldName || disc.customMoldName || 'Unnamed disc'
}

export function toAnalyzedDiscs(bagDiscs: BagDiscWithDisc[]): AnalyzedDisc[] {
  return bagDiscs.map(({ bagDisc, discWithCatalog }) => {
    const numbers = resolveEffectiveFlightNumbers(discWithCatalog.disc, discWithCatalog.catalogEntry)
    return {
      id: bagDisc.id,
      name: discLabel(discWithCatalog),
      slot: bagDisc.slot,
      speed: numbers.speed,
      glide: numbers.glide,
      turn: numbers.turn,
      fade: numbers.fade,
    }
  })
}

export function useBagAnalysis(bagId: string | undefined) {
  const bagDiscsQuery = useBagDiscs(bagId)

  const analysis = useMemo(() => {
    if (!bagDiscsQuery.data) return undefined
    return analyzeBag(toAnalyzedDiscs(bagDiscsQuery.data))
  }, [bagDiscsQuery.data])

  return { ...bagDiscsQuery, analysis }
}
