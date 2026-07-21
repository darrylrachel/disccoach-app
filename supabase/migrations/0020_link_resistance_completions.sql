-- program_day_completions becomes polymorphic instead of gaining a second,
-- parallel completions table: a completion now comes from either a practice
-- session or a resistance session, and calculateProgramProgress
-- (domain/programs/programProgress.ts) keeps reading from this single
-- table regardless of which subsystem produced the row. Existing rows all
-- have session_id set and resistance_session_id null, so they satisfy the
-- new "exactly one" check automatically.
alter table public.program_day_completions
  alter column session_id drop not null,
  add column resistance_session_id uuid references public.resistance_sessions(id),
  add constraint program_day_completions_exactly_one_session check (
    (session_id is not null)::int + (resistance_session_id is not null)::int = 1
  );
