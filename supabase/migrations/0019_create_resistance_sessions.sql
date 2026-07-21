-- Mirrors practice_sessions' start/complete lifecycle (0006) so the two
-- subsystems feel consistent. Kept as a thin start/complete record for this
-- sprint (no per-set weight/rep logging table yet) — a "mark today's
-- workout done" action is enough to prove the equipment-aware engine works
-- end-to-end; richer per-set logging can be added as an additive table
-- later without touching this one.
create table public.resistance_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_day_id uuid references public.program_days(id),
  enrollment_id uuid references public.user_program_enrollments(id),
  status text not null default 'in_progress' check (
    status in ('in_progress', 'completed', 'abandoned')
  ),
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index resistance_sessions_user_id_idx on public.resistance_sessions (user_id);

alter table public.resistance_sessions enable row level security;

create policy "Users can view their own resistance sessions"
  on public.resistance_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own resistance sessions"
  on public.resistance_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own resistance sessions"
  on public.resistance_sessions for update
  using (auth.uid() = user_id);
