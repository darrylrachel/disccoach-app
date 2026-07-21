-- A physical disc is one object — it can only be in one bag at a time. The
-- existing unique(bag_id, disc_id) only prevented duplicate rows within the
-- SAME bag; it never stopped a disc being linked into two different bags
-- simultaneously. Clean up any pre-existing duplicates (keep earliest
-- added_at) before adding the constraint so this migration can't fail on
-- unexpected existing data.
delete from public.bag_discs a
using public.bag_discs b
where a.disc_id = b.disc_id
  and (a.added_at, a.id) > (b.added_at, b.id);

alter table public.bag_discs
  add constraint bag_discs_disc_id_unique unique (disc_id);
