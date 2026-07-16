-- Reference data describing structured practice session blueprints.
-- Seeded by DiscCoach in Phase 3, not user-created in MVP.
create table public.practice_session_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (
    category in ('putting', 'distance', 'field_work', 'accuracy')
  ),
  difficulty text not null check (
    difficulty in ('beginner', 'intermediate', 'advanced')
  ),
  duration_minutes integer not null,
  -- Ordered list of drills, e.g. [{"label": "15ft putts", "reps": 25}]
  structure jsonb not null,
  created_at timestamptz not null default now()
);

create index practice_session_templates_category_idx
  on public.practice_session_templates (category);

create index practice_session_templates_duration_idx
  on public.practice_session_templates (duration_minutes);

alter table public.practice_session_templates enable row level security;

create policy "Authenticated users can read practice templates"
  on public.practice_session_templates for select
  to authenticated
  using (true);
