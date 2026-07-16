-- A user's enrollment in a training program. At most one row per user is
-- expected to be 'active' at a time (enforced at the service layer, same
-- convention as practice_sessions' single in-flight session) — history of
-- past enrollments (completed/abandoned) is kept, never deleted.
create table public.user_program_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid not null references public.training_programs(id),
  status text not null default 'active' check (
    status in ('active', 'completed', 'abandoned')
  ),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index user_program_enrollments_user_id_idx on public.user_program_enrollments (user_id);

create trigger user_program_enrollments_set_updated_at
  before update on public.user_program_enrollments
  for each row execute function public.set_updated_at();

alter table public.user_program_enrollments enable row level security;

create policy "Users can view their own program enrollments"
  on public.user_program_enrollments for select
  using (auth.uid() = user_id);

create policy "Users can insert their own program enrollments"
  on public.user_program_enrollments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own program enrollments"
  on public.user_program_enrollments for update
  using (auth.uid() = user_id);

-- Records that a user completed a given program day via a specific practice
-- session. Progress percentage and "current day" are computed at read time
-- from this table + program_days (same "no stale cache table" approach as
-- domain/bag/bagAnalysis.ts), not stored on the enrollment row.
create table public.program_day_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  enrollment_id uuid not null references public.user_program_enrollments(id) on delete cascade,
  program_day_id uuid not null references public.program_days(id),
  session_id uuid not null references public.practice_sessions(id),
  completed_at timestamptz not null default now(),
  unique (enrollment_id, program_day_id)
);

create index program_day_completions_enrollment_id_idx on public.program_day_completions (enrollment_id);
create index program_day_completions_user_id_idx on public.program_day_completions (user_id);

alter table public.program_day_completions enable row level security;

create policy "Users can view their own program day completions"
  on public.program_day_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own program day completions"
  on public.program_day_completions for insert
  with check (auth.uid() = user_id);
