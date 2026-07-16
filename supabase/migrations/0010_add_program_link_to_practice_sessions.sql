-- Links a practice session back to the training-program day that launched
-- it, if any, so completion can drive program progress without a second
-- workout system. Both nullable: most sessions still start directly from
-- Practice Mode with no program involved.
alter table public.practice_sessions
  add column program_day_id uuid references public.program_days(id),
  add column enrollment_id uuid references public.user_program_enrollments(id);
