-- Reference data describing individual pieces of training equipment. Seeded
-- by DiscCoach, not user-created — same read-only pattern as disc_catalog.
create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (
    category in ('free_weight', 'machine', 'bodyweight', 'accessory')
  ),
  created_at timestamptz not null default now()
);

alter table public.equipment enable row level security;

create policy "Authenticated users can read equipment"
  on public.equipment for select
  to authenticated
  using (true);

-- A user's available equipment inventory — a freeform mix-and-match set,
-- not one of a few fixed tiers (see domain/resistanceTraining/equipmentPresets.ts
-- for the "Minimal/Garage/Commercial" presets, which are a pure UI
-- convenience for bulk-selecting rows here, not stored tiers themselves).
create table public.user_equipment (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  equipment_id uuid not null references public.equipment(id),
  created_at timestamptz not null default now(),
  unique (user_id, equipment_id)
);

create index user_equipment_user_id_idx on public.user_equipment (user_id);

alter table public.user_equipment enable row level security;

create policy "Users can view their own equipment"
  on public.user_equipment for select
  using (auth.uid() = user_id);

create policy "Users can add their own equipment"
  on public.user_equipment for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own equipment"
  on public.user_equipment for delete
  using (auth.uid() = user_id);
