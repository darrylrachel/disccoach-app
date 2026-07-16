-- Enforces "at most one active training-program enrollment per user" the
-- same way bags.enforce_single_active_bag enforces a single active/default
-- bag: when an enrollment goes active, every other active enrollment owned
-- by the same user is superseded (marked abandoned) first. The app-level UI
-- already keeps users from reaching this path in normal use (the "Start
-- program" action is disabled while another program is active) — this
-- trigger is the database-level guarantee for edge cases like a stale tab
-- or a race between two requests, so the invariant can never be violated.
create or replace function public.enforce_single_active_enrollment()
returns trigger as $$
begin
  if new.status = 'active' then
    update public.user_program_enrollments
    set status = 'abandoned', completed_at = now()
    where user_id = new.user_id and id <> new.id and status = 'active';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger user_program_enrollments_enforce_single_active
  before insert or update of status on public.user_program_enrollments
  for each row execute function public.enforce_single_active_enrollment();
