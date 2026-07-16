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
