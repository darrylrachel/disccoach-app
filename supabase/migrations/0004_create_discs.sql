-- A user's personal disc collection. May reference disc_catalog (typical
-- case) or stand alone as a manually entered disc not in the catalog.
create table public.discs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  catalog_id uuid references public.disc_catalog(id),
  custom_manufacturer text,
  custom_mold_name text,
  nickname text,
  plastic text,
  weight numeric,
  color text,
  condition text not null default 'good' check (
    condition in ('new', 'good', 'worn', 'beat_in', 'retired_worthy')
  ),
  beat_in_level integer not null default 0 check (beat_in_level between 0 and 10),
  personal_speed numeric,
  personal_glide numeric,
  personal_turn numeric,
  personal_fade numeric,
  confidence_rating integer check (confidence_rating between 1 and 5),
  notes text,
  favorite_uses text[],
  status text not null default 'active' check (
    status in ('active', 'retired', 'lost', 'traded')
  ),
  status_changed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- catalog_id is nullable by design so manual entry is a first-class path,
  -- but at least one of a catalog match or custom name must be present.
  constraint discs_catalog_or_custom check (
    catalog_id is not null or (custom_manufacturer is not null and custom_mold_name is not null)
  )
);

create index discs_user_id_idx on public.discs (user_id);
create index discs_status_idx on public.discs (status);

create trigger discs_set_updated_at
  before update on public.discs
  for each row execute function public.set_updated_at();

alter table public.discs enable row level security;

create policy "Users can view their own discs"
  on public.discs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own discs"
  on public.discs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own discs"
  on public.discs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own discs"
  on public.discs for delete
  using (auth.uid() = user_id);
