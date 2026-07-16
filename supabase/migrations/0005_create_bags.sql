-- A named collection of discs (Tournament Bag, Practice Bag, etc.).
create table public.bags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bags_user_id_idx on public.bags (user_id);

create trigger bags_set_updated_at
  before update on public.bags
  for each row execute function public.set_updated_at();

-- Enforces "at most one active/default bag per user" without a partial
-- unique index (is_active is a boolean, not part of a natural key) — when a
-- bag is set active, every other bag owned by the same user is unset first.
create or replace function public.enforce_single_active_bag()
returns trigger as $$
begin
  if new.is_active then
    update public.bags
    set is_active = false
    where user_id = new.user_id and id <> new.id and is_active;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger bags_enforce_single_active
  before insert or update of is_active on public.bags
  for each row execute function public.enforce_single_active_bag();

alter table public.bags enable row level security;

create policy "Users can view their own bags"
  on public.bags for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bags"
  on public.bags for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bags"
  on public.bags for update
  using (auth.uid() = user_id);

create policy "Users can delete their own bags"
  on public.bags for delete
  using (auth.uid() = user_id);

-- Join table: which discs are in which bag, and their flight-slot
-- classification for bag intelligence analysis (computed at read time in
-- domain/bag/bagAnalysis.ts, never stored).
create table public.bag_discs (
  id uuid primary key default gen_random_uuid(),
  bag_id uuid not null references public.bags(id) on delete cascade,
  disc_id uuid not null references public.discs(id) on delete cascade,
  slot text not null check (
    slot in (
      'putting_putter',
      'throwing_putter',
      'midrange',
      'fairway_driver',
      'control_driver',
      'distance_driver'
    )
  ),
  added_at timestamptz not null default now(),
  unique (bag_id, disc_id)
);

create index bag_discs_bag_id_idx on public.bag_discs (bag_id);
create index bag_discs_disc_id_idx on public.bag_discs (disc_id);

alter table public.bag_discs enable row level security;

-- bag_discs has no user_id column of its own; RLS is enforced via an exists
-- subquery against the owning bag.
create policy "Users can view discs in their own bags"
  on public.bag_discs for select
  using (exists (
    select 1 from public.bags
    where bags.id = bag_discs.bag_id and bags.user_id = auth.uid()
  ));

create policy "Users can add discs to their own bags"
  on public.bag_discs for insert
  with check (exists (
    select 1 from public.bags
    where bags.id = bag_discs.bag_id and bags.user_id = auth.uid()
  ));

create policy "Users can update discs in their own bags"
  on public.bag_discs for update
  using (exists (
    select 1 from public.bags
    where bags.id = bag_discs.bag_id and bags.user_id = auth.uid()
  ));

create policy "Users can remove discs from their own bags"
  on public.bag_discs for delete
  using (exists (
    select 1 from public.bags
    where bags.id = bag_discs.bag_id and bags.user_id = auth.uid()
  ));
