-- Shared trigger function used by every table with an updated_at column.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  skill_level text check (skill_level in ('beginner', 'intermediate', 'advanced', 'competitive')),
  primary_goal text check (
    primary_goal in (
      'increase_distance',
      'improve_putting',
      'lower_scores',
      'learn_forehand',
      'improve_consistency'
    )
  ),
  throwing_hand text check (throwing_hand in ('left', 'right')),
  primary_throw_style text check (primary_throw_style in ('backhand', 'forehand')),
  max_distance integer,
  forehand_distance integer,
  putting_style text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create an (empty) profile row on signup so onboarding can be
-- detected by "required fields are null" rather than "row is missing".
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
