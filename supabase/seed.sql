-- Curated disc_catalog seed: ~80 widely-known molds across the 10 required
-- manufacturers, with published manufacturer flight numbers. Not exhaustive
-- (roadmap targets ~100-200 total) — extend by appending more rows in the
-- same shape. Run once against an empty disc_catalog table.

insert into public.disc_catalog
  (manufacturer, mold_name, plastic_types, speed, glide, turn, fade, category, stability)
values
  -- Innova
  ('Innova', 'Destroyer', ARRAY['Champion','Star','DX'], 12, 5, -1, 3, 'distance_driver', 'overstable'),
  ('Innova', 'Wraith', ARRAY['Champion','Star','DX'], 11, 5, -1, 3, 'distance_driver', 'overstable'),
  ('Innova', 'Boss', ARRAY['Champion','Star'], 12, 5, -2, 3, 'distance_driver', 'overstable'),
  ('Innova', 'Valkyrie', ARRAY['Champion','Star'], 9, 5, -2, 1, 'distance_driver', 'understable'),
  ('Innova', 'Firebird', ARRAY['Champion','Star','DX'], 9, 3, 0, 4, 'fairway_driver', 'very_overstable'),
  ('Innova', 'Teebird', ARRAY['Champion','Star','DX'], 7, 5, 0, 2, 'fairway_driver', 'stable'),
  ('Innova', 'Leopard', ARRAY['Champion','Star','DX'], 6, 5, -2, 1, 'fairway_driver', 'understable'),
  ('Innova', 'Corvette', ARRAY['Star','DX'], 6, 6, -1, 0, 'fairway_driver', 'understable'),
  ('Innova', 'Colt', ARRAY['Star','DX'], 6, 5, 0, 1, 'fairway_driver', 'stable'),
  ('Innova', 'Roc', ARRAY['Champion','Star','DX'], 4, 3, 0, 3, 'midrange', 'overstable'),
  ('Innova', 'Mako3', ARRAY['Champion','Star','DX'], 5, 4, -1, 1, 'midrange', 'stable'),
  ('Innova', 'Aviar', ARRAY['Champion','Star','DX','Pro'], 2, 3, 0, 1, 'putter', 'stable'),
  ('Innova', 'Rhyno', ARRAY['Star','DX'], 3, 2, 0, 1, 'putter', 'stable'),

  -- Discraft
  ('Discraft', 'Nuke', ARRAY['Z','ESP','Titanium'], 13, 6, -3, 1, 'distance_driver', 'understable'),
  ('Discraft', 'Undertaker', ARRAY['Z','ESP'], 12, 5, -1, 3, 'distance_driver', 'overstable'),
  ('Discraft', 'Heat', ARRAY['Z','ESP'], 11, 5, -1, 3, 'distance_driver', 'overstable'),
  ('Discraft', 'Force', ARRAY['Z','ESP'], 9, 4, -1, 3, 'fairway_driver', 'overstable'),
  ('Discraft', 'Avenger SS', ARRAY['Z','ESP'], 9, 5, -4, 1, 'fairway_driver', 'understable'),
  ('Discraft', 'Comet', ARRAY['Z','ESP'], 6, 5, -3, 0, 'fairway_driver', 'understable'),
  ('Discraft', 'Buzzz', ARRAY['Z','ESP','Titanium','Big Z'], 5, 4, -1, 1, 'midrange', 'stable'),
  ('Discraft', 'Buzzz SS', ARRAY['Z','ESP'], 5, 4, -3, 0, 'midrange', 'understable'),
  ('Discraft', 'Zone', ARRAY['Z','ESP'], 4, 3, 0, 3, 'midrange', 'overstable'),
  ('Discraft', 'Meteor', ARRAY['Z','ESP'], 4, 4, 0, 2, 'midrange', 'stable'),
  ('Discraft', 'Luna', ARRAY['Z','ESP'], 3, 4, 0, 1, 'putter', 'stable'),
  ('Discraft', 'Challenger', ARRAY['Z','ESP'], 2, 4, 0, 0, 'putter', 'stable'),

  -- Dynamic Discs
  ('Dynamic Discs', 'Felon', ARRAY['Lucid','Fuzion'], 12, 5, -0.5, 3, 'distance_driver', 'overstable'),
  ('Dynamic Discs', 'Enforcer', ARRAY['Lucid','Fuzion'], 11, 4, 0, 3, 'distance_driver', 'overstable'),
  ('Dynamic Discs', 'Escape', ARRAY['Lucid','Fuzion'], 9, 6, -1, 2, 'fairway_driver', 'stable'),
  ('Dynamic Discs', 'Verdict', ARRAY['Lucid','Fuzion'], 9, 5, -1, 1, 'fairway_driver', 'stable'),
  ('Dynamic Discs', 'Sheriff', ARRAY['Lucid','Fuzion'], 4, 3, 0, 4, 'midrange', 'overstable'),
  ('Dynamic Discs', 'Truth', ARRAY['Lucid','Fuzion','Classic'], 5, 5, -2, 1, 'midrange', 'understable'),
  ('Dynamic Discs', 'Judge', ARRAY['Lucid','Fuzion','Classic'], 2, 4, 0, 1, 'putter', 'stable'),
  ('Dynamic Discs', 'Warden', ARRAY['Lucid','Classic'], 3, 3, 0, 1, 'putter', 'stable'),
  ('Dynamic Discs', 'Deputy', ARRAY['Lucid','Classic'], 2, 4, 0, 1, 'putter', 'stable'),
  ('Dynamic Discs', 'Justice', ARRAY['Lucid','Fuzion'], 2, 4, 0, 0, 'putter', 'stable'),

  -- Latitude 64
  ('Latitude 64', 'Ballista Pro', ARRAY['Opto','Gold','Retro'], 12, 5, -1, 2, 'distance_driver', 'stable'),
  ('Latitude 64', 'Diamond', ARRAY['Opto','Gold'], 3, 3, 0, 1, 'putter', 'stable'),
  ('Latitude 64', 'River', ARRAY['Opto','Gold'], 7, 6, -3, 1, 'fairway_driver', 'understable'),
  ('Latitude 64', 'Explorer', ARRAY['Opto','Gold'], 9, 6, -2, 1, 'fairway_driver', 'understable'),
  ('Latitude 64', 'Saint', ARRAY['Opto','Gold'], 9, 6, -2, 2, 'fairway_driver', 'stable'),
  ('Latitude 64', 'Pure', ARRAY['Opto','Gold'], 2, 3, 0, 0, 'putter', 'understable'),
  ('Latitude 64', 'Compass', ARRAY['Opto','Gold'], 4, 4, -1, 1, 'midrange', 'understable'),
  ('Latitude 64', 'Fuse', ARRAY['Opto','Gold'], 5, 5, -1, 2, 'midrange', 'stable'),

  -- MVP
  ('MVP', 'Ion', ARRAY['Neutron','Proton','Electron'], 2, 3, 0, 1, 'putter', 'stable'),
  ('MVP', 'Reactor', ARRAY['Neutron','Proton'], 2, 3, -1, 0, 'putter', 'understable'),
  ('MVP', 'Volt', ARRAY['Neutron','Proton'], 6, 5, -1, 1, 'midrange', 'stable'),
  ('MVP', 'Deflector', ARRAY['Neutron','Proton'], 5, 5, -3, 0, 'midrange', 'understable'),
  ('MVP', 'Photon', ARRAY['Neutron','Proton'], 7, 5, -2, 1, 'fairway_driver', 'understable'),
  ('MVP', 'Motion', ARRAY['Neutron','Proton'], 9, 6, -5, 1, 'distance_driver', 'very_understable'),
  ('MVP', 'Ape', ARRAY['Neutron','Proton'], 14, 5, 0, 3, 'distance_driver', 'overstable'),

  -- Axiom
  ('Axiom', 'Envy', ARRAY['Neutron','Proton','Electron'], 4, 5, -1, 0, 'midrange', 'understable'),
  ('Axiom', 'Hex', ARRAY['Neutron','Proton'], 4, 4, 0, 3, 'midrange', 'overstable'),
  ('Axiom', 'Wrath', ARRAY['Neutron','Proton'], 12, 5, -0.5, 3, 'distance_driver', 'overstable'),
  ('Axiom', 'Insanity', ARRAY['Neutron','Proton'], 15, 6, -3, 1, 'distance_driver', 'understable'),
  ('Axiom', 'Proxy', ARRAY['Neutron','Electron'], 2, 3, 0, 1, 'putter', 'stable'),
  ('Axiom', 'Tenacity', ARRAY['Neutron','Proton'], 6, 5, -1, 1, 'fairway_driver', 'stable'),
  ('Axiom', 'Virus', ARRAY['Neutron','Electron'], 3, 3, 0, 2, 'putter', 'overstable'),

  -- Discmania
  ('Discmania', 'PD', ARRAY['C-Line','D-Line'], 9, 5, -1, 2, 'fairway_driver', 'stable'),
  ('Discmania', 'PD2', ARRAY['C-Line','D-Line'], 7, 5, -1, 2, 'fairway_driver', 'stable'),
  ('Discmania', 'FD', ARRAY['C-Line','D-Line'], 7, 5, -1, 1, 'fairway_driver', 'stable'),
  ('Discmania', 'FD2', ARRAY['C-Line','D-Line'], 6, 5, -1, 1, 'fairway_driver', 'stable'),
  ('Discmania', 'DD3', ARRAY['C-Line','D-Line'], 12, 5, -0.5, 2.5, 'distance_driver', 'overstable'),
  ('Discmania', 'Link', ARRAY['C-Line','D-Line'], 4, 5, -1, 1, 'midrange', 'stable'),
  ('Discmania', 'Tactic', ARRAY['C-Line','D-Line'], 5, 5, 0, 3, 'midrange', 'overstable'),
  ('Discmania', 'P2', ARRAY['C-Line','S-Line'], 3, 3, 0, 0, 'putter', 'stable'),

  -- Kastaplast
  ('Kastaplast', 'Berg', ARRAY['K1','K1 Soft'], 2, 4, 0, 1, 'putter', 'stable'),
  ('Kastaplast', 'Svea', ARRAY['K1','K1 Soft'], 2, 4, 0, 2, 'putter', 'overstable'),
  ('Kastaplast', 'Reko', ARRAY['K1','K3'], 4, 4, 0, 1, 'midrange', 'stable'),
  ('Kastaplast', 'Grym', ARRAY['K1','K3'], 6, 5, 0, 2, 'fairway_driver', 'stable'),
  ('Kastaplast', 'Kaxe', ARRAY['K1','K3'], 7, 6, -1, 1, 'fairway_driver', 'stable'),
  ('Kastaplast', 'Cato', ARRAY['K1','K3'], 11, 6, -3, 1, 'distance_driver', 'understable'),

  -- Westside
  ('Westside', 'Harp', ARRAY['VIP','Tournament','Origio'], 3, 3, 0, 0, 'putter', 'stable'),
  ('Westside', 'Sword', ARRAY['VIP','Tournament'], 3, 3, 0, 2, 'putter', 'overstable'),
  ('Westside', 'Stag', ARRAY['VIP','Tournament'], 5, 5, -2, 1, 'midrange', 'understable'),
  ('Westside', 'Underworld', ARRAY['VIP','Tournament'], 7, 6, -3, 0, 'fairway_driver', 'understable'),
  ('Westside', 'Warship', ARRAY['VIP','Tournament'], 12, 6, -1, 2, 'distance_driver', 'stable'),
  ('Westside', 'Tursas', ARRAY['VIP','Tournament'], 12, 5, -0.5, 3, 'distance_driver', 'overstable'),
  ('Westside', 'Hatchet', ARRAY['VIP','Tournament'], 9, 5, -2, 2, 'fairway_driver', 'stable'),

  -- Clash Discs
  ('Clash', 'Muse', ARRAY['Steady','Sharp'], 3, 3, 0, 1, 'putter', 'stable'),
  ('Clash', 'Peace', ARRAY['Steady','Sharp'], 2, 3, 0, 0, 'putter', 'understable'),
  ('Clash', 'Cannon', ARRAY['Steady','Sharp'], 12, 5, -1, 3, 'distance_driver', 'overstable'),
  ('Clash', 'Rally', ARRAY['Steady','Sharp'], 6, 5, -1, 1, 'fairway_driver', 'stable');

-- Practice session template library: one row per category (putting,
-- distance, field_work, accuracy) x difficulty (beginner/intermediate/
-- advanced) x duration (20/45/60 min) — 36 templates total, so the session
-- generator always has an exact match to select from.
insert into public.practice_session_templates
  (name, category, difficulty, duration_minutes, structure)
values
  -- Putting
  ('20-Minute Beginner Putting Tune-Up', 'putting', 'beginner', 20, '[
    {"label": "Warm-up circle putts (10ft)", "reps": 20},
    {"label": "10ft putts", "reps": 20},
    {"label": "15ft putts", "reps": 15}
  ]'::jsonb),
  ('45-Minute Beginner Putting Session', 'putting', 'beginner', 45, '[
    {"label": "Warm-up circle putts (10ft)", "reps": 20},
    {"label": "10ft putts", "reps": 30},
    {"label": "15ft putts", "reps": 25},
    {"label": "20ft putts", "reps": 15}
  ]'::jsonb),
  ('60-Minute Beginner Putting Session', 'putting', 'beginner', 60, '[
    {"label": "Warm-up circle putts (10ft)", "reps": 20},
    {"label": "10ft putts", "reps": 40},
    {"label": "15ft putts", "reps": 30},
    {"label": "20ft putts", "reps": 20},
    {"label": "Footwork/stance reps", "reps": 10}
  ]'::jsonb),
  ('20-Minute Intermediate Putting Tune-Up', 'putting', 'intermediate', 20, '[
    {"label": "15ft putts", "reps": 20},
    {"label": "20ft putts", "reps": 20},
    {"label": "25ft putts", "reps": 10}
  ]'::jsonb),
  ('45-Minute Intermediate Putting Session', 'putting', 'intermediate', 45, '[
    {"label": "15ft putts", "reps": 25},
    {"label": "20ft putts", "reps": 25},
    {"label": "25ft putts", "reps": 20},
    {"label": "30ft putts", "reps": 10}
  ]'::jsonb),
  ('60-Minute Intermediate Putting Session', 'putting', 'intermediate', 60, '[
    {"label": "15ft putts", "reps": 30},
    {"label": "20ft putts", "reps": 30},
    {"label": "25ft putts", "reps": 25},
    {"label": "30ft putts", "reps": 15},
    {"label": "Scramble putts (uneven lies)", "reps": 10}
  ]'::jsonb),
  ('20-Minute Advanced Putting Tune-Up', 'putting', 'advanced', 20, '[
    {"label": "20ft putts", "reps": 20},
    {"label": "25ft putts", "reps": 15},
    {"label": "30ft putts", "reps": 15}
  ]'::jsonb),
  ('45-Minute Advanced Putting Session', 'putting', 'advanced', 45, '[
    {"label": "20ft putts", "reps": 25},
    {"label": "25ft putts", "reps": 20},
    {"label": "30ft putts", "reps": 20},
    {"label": "35ft upshots", "reps": 15}
  ]'::jsonb),
  ('60-Minute Advanced Putting Session', 'putting', 'advanced', 60, '[
    {"label": "20ft putts", "reps": 30},
    {"label": "25ft putts", "reps": 25},
    {"label": "30ft putts", "reps": 25},
    {"label": "35ft upshots", "reps": 20},
    {"label": "Pressure putts (must-make streaks)", "reps": 15}
  ]'::jsonb),

  -- Distance
  ('20-Minute Beginner Distance Session', 'distance', 'beginner', 20, '[
    {"label": "Form reps (no disc / short pull)", "reps": 15},
    {"label": "Backhand distance throws", "reps": 15},
    {"label": "Forehand distance throws", "reps": 10}
  ]'::jsonb),
  ('45-Minute Beginner Distance Session', 'distance', 'beginner', 45, '[
    {"label": "Form reps (no disc / short pull)", "reps": 15},
    {"label": "Backhand distance throws", "reps": 25},
    {"label": "Forehand distance throws", "reps": 20},
    {"label": "Rest & stretch", "reps": 5}
  ]'::jsonb),
  ('60-Minute Beginner Distance Session', 'distance', 'beginner', 60, '[
    {"label": "Form reps (no disc / short pull)", "reps": 20},
    {"label": "Backhand distance throws", "reps": 30},
    {"label": "Forehand distance throws", "reps": 25},
    {"label": "Max effort throws (record best)", "reps": 10}
  ]'::jsonb),
  ('20-Minute Intermediate Distance Session', 'distance', 'intermediate', 20, '[
    {"label": "Backhand distance throws", "reps": 20},
    {"label": "Forehand distance throws", "reps": 15}
  ]'::jsonb),
  ('45-Minute Intermediate Distance Session', 'distance', 'intermediate', 45, '[
    {"label": "Backhand distance throws", "reps": 30},
    {"label": "Forehand distance throws", "reps": 25},
    {"label": "Max effort throws (record best)", "reps": 10}
  ]'::jsonb),
  ('60-Minute Intermediate Distance Session', 'distance', 'intermediate', 60, '[
    {"label": "Backhand distance throws", "reps": 35},
    {"label": "Forehand distance throws", "reps": 30},
    {"label": "Max effort throws (record best)", "reps": 15},
    {"label": "Off-hand throws", "reps": 10}
  ]'::jsonb),
  ('20-Minute Advanced Distance Session', 'distance', 'advanced', 20, '[
    {"label": "Max effort backhand throws (record best)", "reps": 15},
    {"label": "Max effort forehand throws (record best)", "reps": 15}
  ]'::jsonb),
  ('45-Minute Advanced Distance Session', 'distance', 'advanced', 45, '[
    {"label": "Max effort backhand throws (record best)", "reps": 20},
    {"label": "Max effort forehand throws (record best)", "reps": 20},
    {"label": "Standstill vs. run-up comparison throws", "reps": 15}
  ]'::jsonb),
  ('60-Minute Advanced Distance Session', 'distance', 'advanced', 60, '[
    {"label": "Max effort backhand throws (record best)", "reps": 25},
    {"label": "Max effort forehand throws (record best)", "reps": 25},
    {"label": "Standstill vs. run-up comparison throws", "reps": 20},
    {"label": "Off-hand max effort throws", "reps": 15}
  ]'::jsonb),

  -- Field work
  ('20-Minute Beginner Field Work Session', 'field_work', 'beginner', 20, '[
    {"label": "Hyzer shots from the fairway", "reps": 10},
    {"label": "Flat/straight shots", "reps": 10}
  ]'::jsonb),
  ('45-Minute Beginner Field Work Session', 'field_work', 'beginner', 45, '[
    {"label": "Hyzer shots from the fairway", "reps": 15},
    {"label": "Anhyzer shots", "reps": 10},
    {"label": "Flat/straight shots", "reps": 10},
    {"label": "Tunnel shot practice", "reps": 10}
  ]'::jsonb),
  ('60-Minute Beginner Field Work Session', 'field_work', 'beginner', 60, '[
    {"label": "Hyzer shots from the fairway", "reps": 15},
    {"label": "Anhyzer shots", "reps": 15},
    {"label": "Flat/straight shots", "reps": 15},
    {"label": "Tunnel shot practice", "reps": 10},
    {"label": "Uphill/downhill lie shots", "reps": 10}
  ]'::jsonb),
  ('20-Minute Intermediate Field Work Session', 'field_work', 'intermediate', 20, '[
    {"label": "Hyzer flip shots", "reps": 10},
    {"label": "Forehand flex shots", "reps": 10}
  ]'::jsonb),
  ('45-Minute Intermediate Field Work Session', 'field_work', 'intermediate', 45, '[
    {"label": "Hyzer flip shots", "reps": 15},
    {"label": "Forehand flex shots", "reps": 15},
    {"label": "Roller shots", "reps": 10},
    {"label": "Sidearm/backhand switch reps", "reps": 10}
  ]'::jsonb),
  ('60-Minute Intermediate Field Work Session', 'field_work', 'intermediate', 60, '[
    {"label": "Hyzer flip shots", "reps": 15},
    {"label": "Forehand flex shots", "reps": 15},
    {"label": "Roller shots", "reps": 15},
    {"label": "Sidearm/backhand switch reps", "reps": 15},
    {"label": "Recovery shots from the rough", "reps": 10}
  ]'::jsonb),
  ('20-Minute Advanced Field Work Session', 'field_work', 'advanced', 20, '[
    {"label": "Skip shots", "reps": 10},
    {"label": "Low ceiling shots (under branches)", "reps": 10}
  ]'::jsonb),
  ('45-Minute Advanced Field Work Session', 'field_work', 'advanced', 45, '[
    {"label": "Skip shots", "reps": 15},
    {"label": "Low ceiling shots (under branches)", "reps": 15},
    {"label": "Water carry / gap shots", "reps": 10},
    {"label": "Tomahawk/thumber utility shots", "reps": 10}
  ]'::jsonb),
  ('60-Minute Advanced Field Work Session', 'field_work', 'advanced', 60, '[
    {"label": "Skip shots", "reps": 15},
    {"label": "Low ceiling shots (under branches)", "reps": 15},
    {"label": "Water carry / gap shots", "reps": 15},
    {"label": "Tomahawk/thumber utility shots", "reps": 15},
    {"label": "Blind/tunnel recovery shots", "reps": 10}
  ]'::jsonb),

  -- Accuracy
  ('20-Minute Beginner Accuracy Session', 'accuracy', 'beginner', 20, '[
    {"label": "30ft gate throws", "reps": 15},
    {"label": "Basket accuracy from 50ft", "reps": 10}
  ]'::jsonb),
  ('45-Minute Beginner Accuracy Session', 'accuracy', 'beginner', 45, '[
    {"label": "30ft gate throws", "reps": 20},
    {"label": "Basket accuracy from 50ft", "reps": 15},
    {"label": "Basket accuracy from 75ft", "reps": 10}
  ]'::jsonb),
  ('60-Minute Beginner Accuracy Session', 'accuracy', 'beginner', 60, '[
    {"label": "30ft gate throws", "reps": 25},
    {"label": "Basket accuracy from 50ft", "reps": 20},
    {"label": "Basket accuracy from 75ft", "reps": 15},
    {"label": "Gate throws, both hands", "reps": 10}
  ]'::jsonb),
  ('20-Minute Intermediate Accuracy Session', 'accuracy', 'intermediate', 20, '[
    {"label": "Basket accuracy from 75ft", "reps": 15},
    {"label": "Basket accuracy from 100ft", "reps": 10}
  ]'::jsonb),
  ('45-Minute Intermediate Accuracy Session', 'accuracy', 'intermediate', 45, '[
    {"label": "Basket accuracy from 75ft", "reps": 20},
    {"label": "Basket accuracy from 100ft", "reps": 15},
    {"label": "Narrow gate throws (10ft wide)", "reps": 15}
  ]'::jsonb),
  ('60-Minute Intermediate Accuracy Session', 'accuracy', 'intermediate', 60, '[
    {"label": "Basket accuracy from 75ft", "reps": 25},
    {"label": "Basket accuracy from 100ft", "reps": 20},
    {"label": "Narrow gate throws (10ft wide)", "reps": 20},
    {"label": "Circle 2 approach shots", "reps": 15}
  ]'::jsonb),
  ('20-Minute Advanced Accuracy Session', 'accuracy', 'advanced', 20, '[
    {"label": "Basket accuracy from 100ft", "reps": 15},
    {"label": "Narrow gate throws (8ft wide)", "reps": 10}
  ]'::jsonb),
  ('45-Minute Advanced Accuracy Session', 'accuracy', 'advanced', 45, '[
    {"label": "Basket accuracy from 100ft", "reps": 20},
    {"label": "Narrow gate throws (8ft wide)", "reps": 15},
    {"label": "Basket accuracy from 150ft", "reps": 15}
  ]'::jsonb),
  ('60-Minute Advanced Accuracy Session', 'accuracy', 'advanced', 60, '[
    {"label": "Basket accuracy from 100ft", "reps": 25},
    {"label": "Narrow gate throws (8ft wide)", "reps": 20},
    {"label": "Basket accuracy from 150ft", "reps": 20},
    {"label": "Circle 2 approach shots under pressure", "reps": 15}
  ]'::jsonb);

-- Training program library: 5 curated multi-week programs built entirely
-- from the template library above (program_days.template_id references
-- practice_session_templates.id) — no drill logic is duplicated here.
insert into public.training_programs
  (name, description, category, difficulty, duration_weeks, sessions_per_week, estimated_minutes, primary_goal)
values
  (
    'Putting Fundamentals',
    'Build a repeatable, confident putting stroke from inside the circle out. Four weeks of focused reps to groove your mechanics.',
    'putting', 'beginner', 4, 2, 20, 'improve_putting'
  ),
  (
    'Distance Builder',
    'A six-week progression from clean mechanics to max-effort throws, building real backhand and forehand distance.',
    'distance', 'intermediate', 6, 2, 45, 'increase_distance'
  ),
  (
    'Accuracy & Fairway Control',
    'Sharpen your line control and basket accuracy with four weeks of gate work and approach precision.',
    'accuracy', 'intermediate', 4, 2, 45, 'improve_consistency'
  ),
  (
    'Tournament Preparation',
    'A focused two-week tune-up combining pressure putting, scoring-zone accuracy, and course-simulation field work.',
    'mixed', 'advanced', 2, 3, 30, 'lower_scores'
  ),
  (
    'Forehand Fundamentals',
    'Develop a reliable forehand from grip through flex shots, blending distance and field work over four weeks.',
    'mixed', 'beginner', 4, 2, 25, 'learn_forehand'
  );

-- Program days: (program_name, week, day, title, description, template_name)
-- joined against training_programs and practice_session_templates by name.
insert into public.program_days (program_id, week_number, day_number, title, description, template_id)
select p.id, v.week_number, v.day_number, v.title, v.description, t.id
from (values
  -- Putting Fundamentals
  ('Putting Fundamentals', 1, 1, 'Putting Mechanics: Foundations', 'Build a repeatable putting stroke with short-range makes.', '20-Minute Beginner Putting Tune-Up'),
  ('Putting Fundamentals', 1, 2, 'Stroke Consistency', 'Repeat the same reps to start grooving your form.', '20-Minute Beginner Putting Tune-Up'),
  ('Putting Fundamentals', 2, 1, 'Building Range', 'Add distance while keeping the same clean release.', '20-Minute Beginner Putting Tune-Up'),
  ('Putting Fundamentals', 2, 2, 'Confidence Circle', 'Volume reps from inside the circle to build trust in your stroke.', '20-Minute Beginner Putting Tune-Up'),
  ('Putting Fundamentals', 3, 1, 'Stepping Up: Intermediate Range', 'Move out to intermediate putting distances.', '20-Minute Intermediate Putting Tune-Up'),
  ('Putting Fundamentals', 3, 2, 'Extended Range Reps', 'More volume at the new range to lock it in.', '20-Minute Intermediate Putting Tune-Up'),
  ('Putting Fundamentals', 4, 1, 'Pressure Prep', 'Simulate on-course pressure with focused makes.', '20-Minute Intermediate Putting Tune-Up'),
  ('Putting Fundamentals', 4, 2, 'Putting Fundamentals Checkpoint', 'Final session of the program — see how far your stroke has come.', '20-Minute Intermediate Putting Tune-Up'),

  -- Distance Builder
  ('Distance Builder', 1, 1, 'Form Fundamentals', 'No-disc and short-pull reps to clean up your mechanics first.', '20-Minute Beginner Distance Session'),
  ('Distance Builder', 1, 2, 'Power Transfer Basics', 'Longer session focused on transferring rotation into the disc.', '45-Minute Beginner Distance Session'),
  ('Distance Builder', 2, 1, 'Backhand Focus', 'Volume backhand reps to build the base pattern.', '45-Minute Beginner Distance Session'),
  ('Distance Builder', 2, 2, 'Forehand Focus', 'Extended session building your forehand alongside backhand.', '60-Minute Beginner Distance Session'),
  ('Distance Builder', 3, 1, 'Intermediate Field Reps', 'Step up to intermediate volume and effort.', '45-Minute Intermediate Distance Session'),
  ('Distance Builder', 3, 2, 'Max Effort Introduction', 'First max-effort throws — record your best.', '45-Minute Intermediate Distance Session'),
  ('Distance Builder', 4, 1, 'Distance Volume Day', 'High rep count at intermediate intensity.', '60-Minute Intermediate Distance Session'),
  ('Distance Builder', 4, 2, 'Off-Hand Development', 'Round out your game with off-hand throws.', '60-Minute Intermediate Distance Session'),
  ('Distance Builder', 5, 1, 'Advanced Max Effort', 'Push for new personal bests on both wings.', '45-Minute Advanced Distance Session'),
  ('Distance Builder', 5, 2, 'Standstill vs. Run-Up', 'Compare standstill and run-up throws for extra yardage.', '45-Minute Advanced Distance Session'),
  ('Distance Builder', 6, 1, 'Peak Distance Day', 'Full-volume advanced session — go for max distance.', '60-Minute Advanced Distance Session'),
  ('Distance Builder', 6, 2, 'Distance Builder Checkpoint', 'Final session of the program — record your results.', '60-Minute Advanced Distance Session'),

  -- Accuracy & Fairway Control
  ('Accuracy & Fairway Control', 1, 1, 'Gate Control Basics', 'Start with short gate throws to build line awareness.', '20-Minute Beginner Accuracy Session'),
  ('Accuracy & Fairway Control', 1, 2, 'Basket Accuracy Warm-Up', 'Basket-focused accuracy from short and mid range.', '45-Minute Beginner Accuracy Session'),
  ('Accuracy & Fairway Control', 2, 1, 'Extending Your Range', 'Longer session adding a third distance tier.', '60-Minute Beginner Accuracy Session'),
  ('Accuracy & Fairway Control', 2, 2, 'Intermediate Gate Work', 'Step up to intermediate accuracy targets.', '20-Minute Intermediate Accuracy Session'),
  ('Accuracy & Fairway Control', 3, 1, 'Line Control', 'Basket accuracy from extended range.', '45-Minute Intermediate Accuracy Session'),
  ('Accuracy & Fairway Control', 3, 2, 'Narrow Gate Precision', 'Tighten your gates for sharper control.', '60-Minute Intermediate Accuracy Session'),
  ('Accuracy & Fairway Control', 4, 1, 'Advanced Basket Accuracy', 'Long-range basket accuracy at advanced intensity.', '45-Minute Advanced Accuracy Session'),
  ('Accuracy & Fairway Control', 4, 2, 'Fairway Control Checkpoint', 'Final session of the program, including approach shots under pressure.', '60-Minute Advanced Accuracy Session'),

  -- Tournament Preparation
  ('Tournament Preparation', 1, 1, 'Pressure Putting', 'Short, focused putting reps under simulated pressure.', '20-Minute Advanced Putting Tune-Up'),
  ('Tournament Preparation', 1, 2, 'Scoring Zone Accuracy', 'Approach accuracy from scoring range.', '45-Minute Advanced Accuracy Session'),
  ('Tournament Preparation', 1, 3, 'Course-Simulation Field Work', 'Varied lies and shot shapes like you will see on the course.', '45-Minute Advanced Field Work Session'),
  ('Tournament Preparation', 2, 1, 'Pressure Putts Under Fatigue', 'A longer putting session to build late-round consistency.', '45-Minute Advanced Putting Session'),
  ('Tournament Preparation', 2, 2, 'Circle 2 Approach Precision', 'High-volume Circle 2 approach work under pressure.', '60-Minute Advanced Accuracy Session'),
  ('Tournament Preparation', 2, 3, 'Tournament Readiness Checkpoint', 'Final field-work session before you tee off.', '60-Minute Advanced Field Work Session'),

  -- Forehand Fundamentals
  ('Forehand Fundamentals', 1, 1, 'Grip & Release Basics', 'Establish a clean forehand grip and release alongside backhand reps.', '20-Minute Beginner Distance Session'),
  ('Forehand Fundamentals', 1, 2, 'Forehand Power Reps', 'Build power in your forehand motion.', '45-Minute Beginner Distance Session'),
  ('Forehand Fundamentals', 2, 1, 'Forehand Distance Volume', 'Extended volume session to reinforce the motion.', '60-Minute Beginner Distance Session'),
  ('Forehand Fundamentals', 2, 2, 'Intro to Flex Shots', 'First look at forehand flex shots in the field.', '20-Minute Intermediate Field Work Session'),
  ('Forehand Fundamentals', 3, 1, 'Forehand Flex Development', 'Build out flex shots alongside other shot shapes.', '45-Minute Intermediate Field Work Session'),
  ('Forehand Fundamentals', 3, 2, 'Forehand Under Variety', 'Practice your forehand across varied lies.', '60-Minute Intermediate Field Work Session'),
  ('Forehand Fundamentals', 4, 1, 'Utility Forehand Shots', 'Advanced utility shots that lean on forehand technique.', '45-Minute Advanced Field Work Session'),
  ('Forehand Fundamentals', 4, 2, 'Forehand Fundamentals Checkpoint', 'Final session of the program — put it all together.', '20-Minute Intermediate Distance Session')
) as v(program_name, week_number, day_number, title, description, template_name)
join public.training_programs p on p.name = v.program_name
join public.practice_session_templates t on t.name = v.template_name;

-- Equipment reference data. Slugs match domain/resistanceTraining/equipmentPresets.ts
-- (EQUIPMENT_PRESETS), which bulk-select subsets of these rows by slug.
insert into public.equipment (slug, name, category)
values
  ('bodyweight', 'Bodyweight', 'bodyweight'),
  ('resistance_bands', 'Resistance Bands', 'accessory'),
  ('adjustable_dumbbells', 'Adjustable Dumbbells', 'free_weight'),
  ('barbell', 'Barbell', 'free_weight'),
  ('plates', 'Weight Plates', 'free_weight'),
  ('squat_rack', 'Squat Rack', 'machine'),
  ('adjustable_bench', 'Adjustable Bench', 'accessory'),
  ('pull_up_bar', 'Pull-Up Bar', 'accessory'),
  ('landmine', 'Landmine Attachment', 'accessory'),
  ('kettlebells', 'Kettlebells', 'free_weight'),
  ('medicine_ball', 'Medicine Ball', 'accessory'),
  ('cable_machine', 'Cable Machine', 'machine'),
  ('selectorized_machines', 'Selectorized Machines', 'machine'),
  ('smith_machine', 'Smith Machine', 'machine');

-- A small starter exercise library demonstrating the equipment-aware
-- substitution engine (domain/resistanceTraining/equipmentResolution.ts)
-- across a few movement patterns. Each chain terminates in a
-- bodyweight-only variant per the authoring convention in migration 0017.
insert into public.exercises (slug, name, movement_pattern, instructions)
values
  ('barbell-back-squat', 'Barbell Back Squat', 'squat', 'Bar on the back rack, squat to depth, drive up through the heels.'),
  ('goblet-squat-dumbbell', 'Goblet Squat (Dumbbell)', 'squat', 'Hold a dumbbell at chest height, squat to depth.'),
  ('goblet-squat-kettlebell', 'Goblet Squat (Kettlebell)', 'squat', 'Hold a kettlebell at chest height, squat to depth.'),
  ('bodyweight-squat', 'Bodyweight Squat', 'squat', 'Feet shoulder-width, squat to depth with arms extended for balance.'),

  ('barbell-deadlift', 'Barbell Deadlift', 'hinge', 'Hinge at the hips, grip the bar, drive through the floor to stand tall.'),
  ('dumbbell-romanian-deadlift', 'Dumbbell Romanian Deadlift', 'hinge', 'Hinge at the hips with dumbbells, lower to mid-shin, drive hips forward to stand.'),
  ('kettlebell-deadlift', 'Kettlebell Deadlift', 'hinge', 'Hinge at the hips with a kettlebell between the feet, stand tall.'),
  ('bodyweight-good-morning', 'Bodyweight Good Morning', 'hinge', 'Hands behind head, hinge at the hips keeping a flat back, return to standing.'),

  ('barbell-bench-press', 'Barbell Bench Press', 'horizontal_push', 'Lower the bar to the chest, press to full extension.'),
  ('dumbbell-bench-press', 'Dumbbell Bench Press', 'horizontal_push', 'Lower dumbbells to chest level, press to full extension.'),
  ('cable-chest-press', 'Cable Chest Press', 'horizontal_push', 'Press cable handles forward from chest height to full extension.'),
  ('push-up', 'Push-Up', 'horizontal_push', 'Hands under shoulders, lower chest to the floor, press back up.'),

  ('pull-up', 'Pull-Up', 'vertical_pull', 'Grip the bar, pull chin over the bar, lower with control.'),
  ('lat-pulldown-cable', 'Lat Pulldown (Cable)', 'vertical_pull', 'Pull the cable bar down to chest height, control the return.'),
  ('dumbbell-bent-over-row', 'Dumbbell Bent-Over Row', 'vertical_pull', 'Hinge forward, row dumbbells to the ribs, control the descent.'),
  ('bodyweight-superman', 'Bodyweight Superman', 'vertical_pull', 'Lie face down, lift arms and legs off the floor, hold briefly.'),

  ('plank', 'Plank', 'core', 'Hold a straight-body position on forearms and toes, brace the core.');

-- AND-semantics equipment requirements per exercise (see migration 0017).
insert into public.exercise_equipment_requirements (exercise_id, equipment_id)
select e.id, eq.id from (values
  ('barbell-back-squat', 'barbell'), ('barbell-back-squat', 'squat_rack'), ('barbell-back-squat', 'plates'),
  ('goblet-squat-dumbbell', 'adjustable_dumbbells'),
  ('goblet-squat-kettlebell', 'kettlebells'),
  ('bodyweight-squat', 'bodyweight'),

  ('barbell-deadlift', 'barbell'), ('barbell-deadlift', 'plates'),
  ('dumbbell-romanian-deadlift', 'adjustable_dumbbells'),
  ('kettlebell-deadlift', 'kettlebells'),
  ('bodyweight-good-morning', 'bodyweight'),

  ('barbell-bench-press', 'barbell'), ('barbell-bench-press', 'adjustable_bench'), ('barbell-bench-press', 'plates'),
  ('dumbbell-bench-press', 'adjustable_dumbbells'), ('dumbbell-bench-press', 'adjustable_bench'),
  ('cable-chest-press', 'cable_machine'),
  ('push-up', 'bodyweight'),

  ('pull-up', 'pull_up_bar'),
  ('lat-pulldown-cable', 'cable_machine'),
  ('dumbbell-bent-over-row', 'adjustable_dumbbells'),
  ('bodyweight-superman', 'bodyweight'),

  ('plank', 'bodyweight')
) as v(exercise_slug, equipment_slug)
join public.exercises e on e.slug = v.exercise_slug
join public.equipment eq on eq.slug = v.equipment_slug;

-- Ordered substitution chains (rank 1 = first fallback), each terminating
-- bodyweight-only.
insert into public.exercise_substitutions (exercise_id, substitute_exercise_id, rank)
select e.id, sub.id, v.rank from (values
  ('barbell-back-squat', 'goblet-squat-dumbbell', 1),
  ('barbell-back-squat', 'goblet-squat-kettlebell', 2),
  ('barbell-back-squat', 'bodyweight-squat', 3),

  ('barbell-deadlift', 'dumbbell-romanian-deadlift', 1),
  ('barbell-deadlift', 'kettlebell-deadlift', 2),
  ('barbell-deadlift', 'bodyweight-good-morning', 3),

  ('barbell-bench-press', 'dumbbell-bench-press', 1),
  ('barbell-bench-press', 'cable-chest-press', 2),
  ('barbell-bench-press', 'push-up', 3),

  ('pull-up', 'lat-pulldown-cable', 1),
  ('pull-up', 'dumbbell-bent-over-row', 2),
  ('pull-up', 'bodyweight-superman', 3)
) as v(exercise_slug, substitute_slug, rank)
join public.exercises e on e.slug = v.exercise_slug
join public.exercises sub on sub.slug = v.substitute_slug;

-- One example resistance-training program to prove the engine end-to-end.
-- Additional program types (Distance Development, Mobility, etc.) are
-- meant to be added the same way — as data, not code.
insert into public.training_programs
  (name, description, category, difficulty, duration_weeks, sessions_per_week, estimated_minutes, modality, resistance_program_type, season_focus)
values
  (
    'Off-Season Strength Foundations',
    'A three-week introduction to full-body strength training, built to work with whatever equipment you have on hand.',
    'mixed', 'beginner', 3, 2, 40, 'resistance', 'strength', 'off_season'
  );

insert into public.program_days (program_id, week_number, day_number, title, description, day_type, template_id)
select p.id, v.week_number, v.day_number, v.title, v.description, 'resistance', null
from (values
  (1, 1, 'Full Body A', 'Squat, push, and core work to open the program.'),
  (1, 2, 'Full Body B', 'Hinge and pull work to balance out Day A.'),
  (2, 1, 'Full Body A', 'Repeat Day A with an eye on adding a rep or two.'),
  (2, 2, 'Full Body B', 'Repeat Day B, building on last week.'),
  (3, 1, 'Full Body A', 'Final squat/push/core session of the program.'),
  (3, 2, 'Full Body B', 'Final hinge/pull session — check your progress.')
) as v(week_number, day_number, title, description)
cross join public.training_programs p
where p.name = 'Off-Season Strength Foundations';

insert into public.program_day_exercises (program_day_id, exercise_id, order_index, sets, reps, rest_seconds)
select d.id, e.id, v.order_index, v.sets, v.reps, v.rest_seconds
from (values
  (1, 1, 'barbell-back-squat', 1, 3, '8-10', 90),
  (1, 1, 'barbell-bench-press', 2, 3, '8-10', 90),
  (1, 1, 'plank', 3, 3, '30-45s', 45),
  (1, 2, 'barbell-deadlift', 1, 3, '6-8', 120),
  (1, 2, 'pull-up', 2, 3, '6-10', 90),
  (1, 2, 'plank', 3, 3, '30-45s', 45),
  (2, 1, 'barbell-back-squat', 1, 3, '8-10', 90),
  (2, 1, 'barbell-bench-press', 2, 3, '8-10', 90),
  (2, 1, 'plank', 3, 3, '30-45s', 45),
  (2, 2, 'barbell-deadlift', 1, 3, '6-8', 120),
  (2, 2, 'pull-up', 2, 3, '6-10', 90),
  (2, 2, 'plank', 3, 3, '30-45s', 45),
  (3, 1, 'barbell-back-squat', 1, 4, '6-8', 120),
  (3, 1, 'barbell-bench-press', 2, 4, '6-8', 120),
  (3, 1, 'plank', 3, 3, '45-60s', 45),
  (3, 2, 'barbell-deadlift', 1, 4, '5-6', 150),
  (3, 2, 'pull-up', 2, 4, '6-10', 90),
  (3, 2, 'plank', 3, 3, '45-60s', 45)
) as v(week_number, day_number, exercise_slug, order_index, sets, reps, rest_seconds)
join public.training_programs p on p.name = 'Off-Season Strength Foundations'
join public.program_days d on d.program_id = p.id and d.week_number = v.week_number and d.day_number = v.day_number
join public.exercises e on e.slug = v.exercise_slug;
