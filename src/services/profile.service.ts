import { supabase } from './supabaseClient'
import type { Database } from '../types/database.types'
import type {
  PlayerProfile,
  PrimaryGoal,
  SkillLevel,
  ThrowingHand,
  ThrowStyle,
} from '../domain/profile/models'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

// skill_level/primary_goal/throwing_hand/primary_throw_style are `text` columns
// with CHECK constraints in Postgres, so generated types widen them to `string`.
// The casts below encode that constraint at the DB boundary.
function toDomain(row: ProfileRow): PlayerProfile {
  return {
    id: row.id,
    displayName: row.display_name,
    skillLevel: row.skill_level as SkillLevel | null,
    primaryGoal: row.primary_goal as PrimaryGoal | null,
    throwingHand: row.throwing_hand as ThrowingHand | null,
    primaryThrowStyle: row.primary_throw_style as ThrowStyle | null,
    maxDistance: row.max_distance,
    forehandDistance: row.forehand_distance,
    puttingStyle: row.putting_style,
    avatarUrl: row.avatar_url,
    homeCourse: row.home_course,
    yearsPlaying: row.years_playing,
    favoriteManufacturer: row.favorite_manufacturer,
    favoriteMold: row.favorite_mold,
    bio: row.bio,
  }
}

export async function getProfile(userId: string): Promise<PlayerProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data ? toDomain(data) : null
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<PlayerProfile, 'id'>>,
): Promise<PlayerProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      display_name: updates.displayName,
      skill_level: updates.skillLevel,
      primary_goal: updates.primaryGoal,
      throwing_hand: updates.throwingHand,
      primary_throw_style: updates.primaryThrowStyle,
      max_distance: updates.maxDistance,
      forehand_distance: updates.forehandDistance,
      putting_style: updates.puttingStyle,
      avatar_url: updates.avatarUrl,
      home_course: updates.homeCourse,
      years_playing: updates.yearsPlaying,
      favorite_manufacturer: updates.favoriteManufacturer,
      favorite_mold: updates.favoriteMold,
      bio: updates.bio,
    })
    .eq('id', userId)
    .select('*')
    .single()

  if (error) throw error
  return toDomain(data)
}
