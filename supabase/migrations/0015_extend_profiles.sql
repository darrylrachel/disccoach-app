-- Additional player-profile fields for the Account screen. All nullable and
-- additive — none are required for onboarding completeness
-- (see isOnboardingComplete in src/domain/profile/models.ts).
alter table public.profiles
  add column avatar_url text,
  add column home_course text,
  add column years_playing integer check (years_playing >= 0),
  add column favorite_manufacturer text,
  add column favorite_mold text,
  add column bio text check (char_length(bio) <= 500);
