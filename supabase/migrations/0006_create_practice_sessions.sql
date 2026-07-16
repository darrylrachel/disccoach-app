-- A user's instance of running (or abandoning) a structured practice session.
create table public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid references public.practice_session_templates(id),
  -- Denormalized copy of the template's category so history stays queryable
  -- even if the source template is later changed or removed.
  category text not null check (
    category in ('putting', 'distance', 'field_work', 'accuracy')
  ),
  duration_minutes integer not null,
  status text not null default 'in_progress' check (
    status in ('in_progress', 'completed', 'abandoned')
  ),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index practice_sessions_user_id_idx on public.practice_sessions (user_id);

create trigger practice_sessions_set_updated_at
  before update on public.practice_sessions
  for each row execute function public.set_updated_at();

alter table public.practice_sessions enable row level security;

create policy "Users can view their own practice sessions"
  on public.practice_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own practice sessions"
  on public.practice_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own practice sessions"
  on public.practice_sessions for update
  using (auth.uid() = user_id);

-- Individual drill results logged within a session. Never deleted by the
-- app (history preservation) — no delete policy is defined.
create table public.practice_log_entries (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.practice_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  drill_label text not null,
  metric_type text not null check (
    metric_type in ('makes_attempts', 'distance_feet', 'completed_boolean')
  ),
  attempts integer,
  makes integer,
  distance_feet numeric,
  notes text,
  logged_at timestamptz not null default now()
);

create index practice_log_entries_session_id_idx on public.practice_log_entries (session_id);
create index practice_log_entries_user_id_idx on public.practice_log_entries (user_id);

alter table public.practice_log_entries enable row level security;

create policy "Users can view their own practice log entries"
  on public.practice_log_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own practice log entries"
  on public.practice_log_entries for insert
  with check (auth.uid() = user_id);
