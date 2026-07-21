-- Extends the existing training_programs/program_days machinery to also
-- describe resistance-training programs, instead of building a parallel
-- system. New program "types" (Distance Development, Strength, Mobility,
-- etc.) are meant to be added later as data (new rows + program_day_exercises
-- content), not new code paths.
alter table public.training_programs
  add column modality text not null default 'practice' check (modality in ('practice', 'resistance')),
  add column resistance_program_type text check (
    resistance_program_type in (
      'distance_development', 'athletic_performance', 'strength',
      'muscle_building', 'mobility', 'injury_prevention'
    )
  ),
  add column season_focus text check (season_focus in ('in_season', 'off_season'));

-- A program can mix practice days and resistance days in one multi-week
-- plan. template_id only applies to practice days now, so it becomes
-- nullable; the check constraint keeps the two kinds of day internally
-- consistent.
alter table public.program_days
  add column day_type text not null default 'practice' check (day_type in ('practice', 'resistance')),
  alter column template_id drop not null,
  add constraint program_days_type_consistency check (
    (day_type = 'practice' and template_id is not null) or
    (day_type = 'resistance' and template_id is null)
  );

-- A resistance day's exercise plan. Each row targets an "anchor" exercise —
-- the equipment resolver (domain/resistanceTraining/equipmentResolution.ts)
-- picks the best variant the user's equipment supports at read time;
-- nothing about substitution is stored here.
create table public.program_day_exercises (
  id uuid primary key default gen_random_uuid(),
  program_day_id uuid not null references public.program_days(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  order_index integer not null,
  sets integer not null,
  reps text not null, -- free text to allow ranges ("8-12"), "AMRAP", "30s", etc.
  rest_seconds integer,
  notes text,
  unique (program_day_id, order_index)
);

create index program_day_exercises_program_day_id_idx on public.program_day_exercises (program_day_id);

alter table public.program_day_exercises enable row level security;

create policy "Authenticated users can read program day exercises"
  on public.program_day_exercises for select
  to authenticated
  using (true);
