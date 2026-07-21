-- Reference data describing individual resistance-training exercises,
-- seeded by DiscCoach (not user-created), same read-only pattern as
-- practice_session_templates / training_programs.
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  movement_pattern text not null check (
    movement_pattern in (
      'squat', 'hinge', 'lunge', 'horizontal_push', 'vertical_push',
      'horizontal_pull', 'vertical_pull', 'carry', 'core', 'mobility'
    )
  ),
  instructions text not null,
  created_at timestamptz not null default now()
);

alter table public.exercises enable row level security;

create policy "Authenticated users can read exercises"
  on public.exercises for select
  to authenticated
  using (true);

-- AND-semantics: every listed equipment row is required for this exact
-- exercise. "Dumbbell OR kettlebell both work" is modeled as two separate
-- exercise rows linked via exercise_substitutions below, not OR logic here —
-- that keeps the equipment resolver a plain subset check
-- (see domain/resistanceTraining/equipmentResolution.ts).
create table public.exercise_equipment_requirements (
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  equipment_id uuid not null references public.equipment(id),
  primary key (exercise_id, equipment_id)
);

alter table public.exercise_equipment_requirements enable row level security;

create policy "Authenticated users can read exercise equipment requirements"
  on public.exercise_equipment_requirements for select
  to authenticated
  using (true);

-- Ordered fallback chain per anchor exercise. rank 1 = first substitution to
-- try if the anchor's equipment isn't available, rank 2 = next, etc. This is
-- an explicit, curated chain rather than a generic "same movement pattern"
-- pool, so the "next best" alternative is always a deliberate editorial
-- choice. Content convention (enforced by seed-data review, not the DB):
-- every chain should terminate in a variant requiring only bodyweight-
-- tagged equipment, so the resolver's fallback path is never exercised in
-- practice.
create table public.exercise_substitutions (
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  substitute_exercise_id uuid not null references public.exercises(id),
  rank integer not null check (rank > 0),
  primary key (exercise_id, rank),
  check (exercise_id <> substitute_exercise_id)
);

alter table public.exercise_substitutions enable row level security;

create policy "Authenticated users can read exercise substitutions"
  on public.exercise_substitutions for select
  to authenticated
  using (true);
