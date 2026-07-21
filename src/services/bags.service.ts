import { supabase } from './supabaseClient'
import type { Database } from '../types/database.types'
import { toDomainCatalogEntry } from './discCatalog.service'
import { toDomainDisc } from './discs.service'
import type { Bag, BagDisc, BagSlot, NewBagInput, BagUpdateInput } from '../domain/bag/models'
import type { DiscWithCatalog } from '../domain/disc/models'

type BagRow = Database['public']['Tables']['bags']['Row']
type BagInsert = Database['public']['Tables']['bags']['Insert']
type BagUpdate = Database['public']['Tables']['bags']['Update']
type BagDiscRow = Database['public']['Tables']['bag_discs']['Row']
type DiscRow = Database['public']['Tables']['discs']['Row']
type CatalogRow = Database['public']['Tables']['disc_catalog']['Row']
type BagDiscRowWithDisc = BagDiscRow & { discs: (DiscRow & { disc_catalog: CatalogRow | null }) | null }

function toDomainBag(row: BagRow): Bag {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    isActive: row.is_active,
  }
}

function toDomainBagDisc(row: BagDiscRow): BagDisc {
  return {
    id: row.id,
    bagId: row.bag_id,
    discId: row.disc_id,
    slot: row.slot as BagSlot,
    addedAt: row.added_at,
  }
}

export interface BagDiscWithDisc {
  bagDisc: BagDisc
  discWithCatalog: DiscWithCatalog
}

function toDomainBagDiscWithDisc(row: BagDiscRowWithDisc): BagDiscWithDisc | null {
  if (!row.discs) return null
  return {
    bagDisc: toDomainBagDisc(row),
    discWithCatalog: {
      disc: toDomainDisc(row.discs),
      catalogEntry: row.discs.disc_catalog ? toDomainCatalogEntry(row.discs.disc_catalog) : null,
    },
  }
}

export async function listBags(userId: string): Promise<Bag[]> {
  const { data, error } = await supabase
    .from('bags')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data.map(toDomainBag)
}

export async function getBag(id: string): Promise<Bag | null> {
  const { data, error } = await supabase.from('bags').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? toDomainBag(data) : null
}

export async function createBag(userId: string, input: NewBagInput): Promise<Bag> {
  const payload: BagInsert = {
    user_id: userId,
    name: input.name,
    description: input.description ?? null,
  }

  const { data, error } = await supabase.from('bags').insert(payload).select('*').single()
  if (error) throw error
  return toDomainBag(data)
}

export async function updateBag(id: string, updates: BagUpdateInput): Promise<Bag> {
  const payload: BagUpdate = {
    name: updates.name,
    description: updates.description,
  }

  const { data, error } = await supabase
    .from('bags')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return toDomainBag(data)
}

// The DB trigger `bags_enforce_single_active` unsets is_active on the
// user's other bags, so this only needs to set the one flag.
export async function setActiveBag(id: string): Promise<Bag> {
  const { data, error } = await supabase
    .from('bags')
    .update({ is_active: true })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return toDomainBag(data)
}

export async function deleteBag(id: string): Promise<void> {
  const { error } = await supabase.from('bags').delete().eq('id', id)
  if (error) throw error
}

const BAG_DISC_WITH_DISC_SELECT = '*, discs(*, disc_catalog(*))'

export async function listBagDiscs(bagId: string): Promise<BagDiscWithDisc[]> {
  const { data, error } = await supabase
    .from('bag_discs')
    .select(BAG_DISC_WITH_DISC_SELECT)
    .eq('bag_id', bagId)
    .order('added_at', { ascending: true })

  if (error) throw error
  return (data as BagDiscRowWithDisc[])
    .map(toDomainBagDiscWithDisc)
    .filter((d): d is BagDiscWithDisc => d !== null)
}

export async function addDiscToBag(bagId: string, discId: string, slot: BagSlot): Promise<BagDisc> {
  const { data, error } = await supabase
    .from('bag_discs')
    .insert({ bag_id: bagId, disc_id: discId, slot })
    .select('*')
    .single()

  if (error) throw error
  return toDomainBagDisc(data)
}

export async function updateBagDiscSlot(bagDiscId: string, slot: BagSlot): Promise<BagDisc> {
  const { data, error } = await supabase
    .from('bag_discs')
    .update({ slot })
    .eq('id', bagDiscId)
    .select('*')
    .single()

  if (error) throw error
  return toDomainBagDisc(data)
}

export async function removeDiscFromBag(bagDiscId: string): Promise<void> {
  const { error } = await supabase.from('bag_discs').delete().eq('id', bagDiscId)
  if (error) throw error
}

// Every disc id currently linked into any of the user's bags — used to
// derive owned/in-bag/in-storage counts per mold (see domain/disc/collection.ts)
// without storing a quantity anywhere.
export async function listBagDiscIdsForUser(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('bag_discs')
    .select('disc_id, bags!inner(user_id)')
    .eq('bags.user_id', userId)

  if (error) throw error
  return new Set((data as { disc_id: string }[]).map((row) => row.disc_id))
}

// A disc can only be in one bag at a time (bag_discs.disc_id is unique), so
// this is safe to assume at most one row.
export async function getBagAssignmentForDisc(discId: string): Promise<BagDiscWithDisc | null> {
  const { data, error } = await supabase
    .from('bag_discs')
    .select(BAG_DISC_WITH_DISC_SELECT)
    .eq('disc_id', discId)
    .maybeSingle()

  if (error) throw error
  return data ? toDomainBagDiscWithDisc(data as BagDiscRowWithDisc) : null
}

export async function moveDiscToBag(discId: string, newBagId: string, slot: BagSlot): Promise<BagDisc> {
  const { error: deleteError } = await supabase.from('bag_discs').delete().eq('disc_id', discId)
  if (deleteError) throw deleteError

  return addDiscToBag(newBagId, discId, slot)
}
