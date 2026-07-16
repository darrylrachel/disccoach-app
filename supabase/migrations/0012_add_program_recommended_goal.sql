-- Drives the rule-based "recommended for you" program on ProgramsScreen /
-- DashboardScreen: matched directly against profiles.primary_goal, no AI
-- involved. Nullable — a program without a mapped goal simply never surfaces
-- as a recommendation.
alter table public.training_programs
  add column primary_goal text check (
    primary_goal in (
      'increase_distance',
      'improve_putting',
      'lower_scores',
      'learn_forehand',
      'improve_consistency'
    )
  );

-- Backfill the 5 programs seeded in supabase/seed.sql. Safe to re-run.
update public.training_programs set primary_goal = 'improve_putting' where name = 'Putting Fundamentals';
update public.training_programs set primary_goal = 'increase_distance' where name = 'Distance Builder';
update public.training_programs set primary_goal = 'improve_consistency' where name = 'Accuracy & Fairway Control';
update public.training_programs set primary_goal = 'lower_scores' where name = 'Tournament Preparation';
update public.training_programs set primary_goal = 'learn_forehand' where name = 'Forehand Fundamentals';
