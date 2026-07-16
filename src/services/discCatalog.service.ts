import { supabase } from './supabaseClient'
import type { Database } from '../types/database.types'
import type { DiscCatalogEntry, DiscCategory, Stability } from '../domain/disc/models'

type CatalogRow = Database['public']['Tables']['disc_catalog']['Row']

export function toDomainCatalogEntry(row: CatalogRow): DiscCatalogEntry {
  return {
    id: row.id,
    manufacturer: row.manufacturer,
    moldName: row.mold_name,
    plasticTypes: row.plastic_types,
    speed: row.speed,
    glide: row.glide,
    turn: row.turn,
    fade: row.fade,
    category: row.category as DiscCategory,
    stability: row.stability as Stability,
  }
}

// PostgREST .or() filter values can contain characters with special meaning
// (comma, parens); wrapping in escaped double quotes is PostgREST's own
// escaping mechanism for literal values in a filter string.
function escapeForOrFilter(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

export interface DiscCatalogSearchParams {
  query?: string
  category?: DiscCategory
  stability?: Stability
}

export async function searchDiscCatalog(
  params: DiscCatalogSearchParams = {},
): Promise<DiscCatalogEntry[]> {
  let request = supabase.from('disc_catalog').select('*')

  if (params.query) {
    const pattern = escapeForOrFilter(`%${params.query}%`)
    request = request.or(`manufacturer.ilike.${pattern},mold_name.ilike.${pattern}`)
  }
  if (params.category) {
    request = request.eq('category', params.category)
  }
  if (params.stability) {
    request = request.eq('stability', params.stability)
  }

  const { data, error } = await request.order('manufacturer').order('mold_name')
  if (error) throw error
  return data.map(toDomainCatalogEntry)
}

export async function getDiscCatalogEntry(id: string): Promise<DiscCatalogEntry | null> {
  const { data, error } = await supabase
    .from('disc_catalog')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data ? toDomainCatalogEntry(data) : null
}
