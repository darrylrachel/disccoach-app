-- Shared reference data: manufacturer disc specs. Public read, admin-only
-- write (no client-facing insert/update/delete policy in MVP — managed via
-- seed scripts/migrations). Seeded with ~100-200 discs in Phase 1.
create table public.disc_catalog (
  id uuid primary key default gen_random_uuid(),
  manufacturer text not null,
  mold_name text not null,
  plastic_types text[] not null default '{}',
  speed numeric not null,
  glide numeric not null,
  turn numeric not null,
  fade numeric not null,
  category text not null check (
    category in ('putter', 'midrange', 'fairway_driver', 'distance_driver')
  ),
  stability text not null check (
    stability in (
      'very_understable',
      'understable',
      'stable',
      'overstable',
      'very_overstable'
    )
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index disc_catalog_manufacturer_mold_idx
  on public.disc_catalog (manufacturer, mold_name);

create index disc_catalog_category_idx on public.disc_catalog (category);

create trigger disc_catalog_set_updated_at
  before update on public.disc_catalog
  for each row execute function public.set_updated_at();

alter table public.disc_catalog enable row level security;

create policy "Authenticated users can read the disc catalog"
  on public.disc_catalog for select
  to authenticated
  using (true);
