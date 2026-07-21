import { supabase } from './supabaseClient'
import type { Database } from '../types/database.types'
import { toDomainCatalogEntry } from './discCatalog.service'
import type {
  Disc,
  DiscCondition,
  DiscIdentityUpdate,
  DiscStatus,
  DiscWithCatalog,
  NewDiscInput,
} from '../domain/disc/models'

type DiscRow = Database['public']['Tables']['discs']['Row']
type DiscInsert = Database['public']['Tables']['discs']['Insert']
type DiscUpdate = Database['public']['Tables']['discs']['Update']
type CatalogRow = Database['public']['Tables']['disc_catalog']['Row']
type DiscRowWithCatalog = DiscRow & { disc_catalog: CatalogRow | null }

const DISC_WITH_CATALOG_SELECT = '*, disc_catalog(*)'

export function toDomainDisc(row: DiscRow): Disc {
  return {
    id: row.id,
    userId: row.user_id,
    catalogId: row.catalog_id,
    customManufacturer: row.custom_manufacturer,
    customMoldName: row.custom_mold_name,
    nickname: row.nickname,
    plastic: row.plastic,
    weight: row.weight,
    color: row.color,
    condition: row.condition as DiscCondition,
    beatInLevel: row.beat_in_level,
    personalSpeed: row.personal_speed,
    personalGlide: row.personal_glide,
    personalTurn: row.personal_turn,
    personalFade: row.personal_fade,
    confidenceRating: row.confidence_rating,
    notes: row.notes,
    favoriteUses: row.favorite_uses,
    status: row.status as DiscStatus,
    statusChangedAt: row.status_changed_at,
  }
}

function toDomainDiscWithCatalog(row: DiscRowWithCatalog): DiscWithCatalog {
  return {
    disc: toDomainDisc(row),
    catalogEntry: row.disc_catalog ? toDomainCatalogEntry(row.disc_catalog) : null,
  }
}

export interface ListDiscsFilters {
  status?: DiscStatus
}

export async function listDiscs(
  userId: string,
  filters: ListDiscsFilters = {},
): Promise<DiscWithCatalog[]> {
  let request = supabase.from('discs').select(DISC_WITH_CATALOG_SELECT).eq('user_id', userId)

  if (filters.status) {
    request = request.eq('status', filters.status)
  }

  const { data, error } = await request.order('created_at', { ascending: false })
  if (error) throw error
  return (data as DiscRowWithCatalog[]).map(toDomainDiscWithCatalog)
}

export async function getDisc(id: string): Promise<DiscWithCatalog | null> {
  const { data, error } = await supabase
    .from('discs')
    .select(DISC_WITH_CATALOG_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data ? toDomainDiscWithCatalog(data as DiscRowWithCatalog) : null
}

function toInsert(userId: string, input: NewDiscInput): DiscInsert {
  return {
    user_id: userId,
    catalog_id: 'catalogId' in input ? input.catalogId : null,
    custom_manufacturer: 'customManufacturer' in input ? input.customManufacturer : null,
    custom_mold_name: 'customMoldName' in input ? input.customMoldName : null,
    nickname: input.nickname ?? null,
    plastic: input.plastic ?? null,
    weight: input.weight ?? null,
    color: input.color ?? null,
    condition: input.condition ?? 'good',
    personal_speed: input.personalSpeed ?? null,
    personal_glide: input.personalGlide ?? null,
    personal_turn: input.personalTurn ?? null,
    personal_fade: input.personalFade ?? null,
    confidence_rating: input.confidenceRating ?? null,
    notes: input.notes ?? null,
    favorite_uses: input.favoriteUses ?? null,
  }
}

export async function addDisc(userId: string, input: NewDiscInput): Promise<Disc> {
  const { data, error } = await supabase
    .from('discs')
    .insert(toInsert(userId, input))
    .select('*')
    .single()

  if (error) throw error
  return toDomainDisc(data)
}

export interface DiscUpdateInput {
  identity?: DiscIdentityUpdate
  nickname?: string | null
  plastic?: string | null
  weight?: number | null
  color?: string | null
  condition?: DiscCondition
  beatInLevel?: number
  personalSpeed?: number | null
  personalGlide?: number | null
  personalTurn?: number | null
  personalFade?: number | null
  confidenceRating?: number | null
  notes?: string | null
  favoriteUses?: string[] | null
}

export async function updateDisc(id: string, updates: DiscUpdateInput): Promise<Disc> {
  const payload: DiscUpdate = {
    nickname: updates.nickname,
    plastic: updates.plastic,
    weight: updates.weight,
    color: updates.color,
    condition: updates.condition,
    beat_in_level: updates.beatInLevel,
    personal_speed: updates.personalSpeed,
    personal_glide: updates.personalGlide,
    personal_turn: updates.personalTurn,
    personal_fade: updates.personalFade,
    confidence_rating: updates.confidenceRating,
    notes: updates.notes,
    favorite_uses: updates.favoriteUses,
  }

  if (updates.identity) {
    // Only one of catalog_id / custom_manufacturer+custom_mold_name may be
    // set at a time (see the discs_catalog_or_custom check constraint), so
    // re-identifying a disc must null out whichever pair it's leaving.
    if ('catalogId' in updates.identity) {
      payload.catalog_id = updates.identity.catalogId
      payload.custom_manufacturer = null
      payload.custom_mold_name = null
    } else {
      payload.catalog_id = null
      payload.custom_manufacturer = updates.identity.customManufacturer
      payload.custom_mold_name = updates.identity.customMoldName
    }
  }

  const { data, error } = await supabase
    .from('discs')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return toDomainDisc(data)
}

export async function changeDiscStatus(id: string, status: DiscStatus): Promise<Disc> {
  const { data, error } = await supabase
    .from('discs')
    .update({ status, status_changed_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return toDomainDisc(data)
}

// Unconditional hard delete: bags/practice_sessions don't exist yet
// (Phase 2/3), so no disc can have history to guard against losing.
export async function deleteDisc(id: string): Promise<void> {
  const { error } = await supabase.from('discs').delete().eq('id', id)
  if (error) throw error
}
