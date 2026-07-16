-- Reference data describing multi-week training programs. Seeded by
-- DiscCoach, not user-created in MVP — same read-only pattern as
-- practice_session_templates.
create table public.training_programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  category text not null check (
    category in ('putting', 'distance', 'field_work', 'accuracy', 'mixed')
  ),
  difficulty text not null check (
    difficulty in ('beginner', 'intermediate', 'advanced')
  ),
  duration_weeks integer not null,
  sessions_per_week integer not null,
  estimated_minutes integer not null,
  created_at timestamptz not null default now()
);

alter table public.training_programs enable row level security;

create policy "Authenticated users can read training programs"
  on public.training_programs for select
  to authenticated
  using (true);

-- One scheduled day within a program, pointing at the practice session
-- template it launches. Reuses practice_session_templates rather than
-- duplicating drill structure — a program is just a curated sequence of
-- existing templates.
create table public.program_days (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.training_programs(id) on delete cascade,
  week_number integer not null,
  day_number integer not null,
  title text not null,
  description text not null,
  template_id uuid not null references public.practice_session_templates(id),
  created_at timestamptz not null default now(),
  unique (program_id, week_number, day_number)
);

create index program_days_program_id_idx on public.program_days (program_id);

alter table public.program_days enable row level security;

create policy "Authenticated users can read program days"
  on public.program_days for select
  to authenticated
  using (true);
