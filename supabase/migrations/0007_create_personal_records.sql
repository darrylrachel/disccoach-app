-- Denormalized best-value tracking per user per record type (e.g. max
-- distance, putting percentage at a given distance) so the dashboard
-- doesn't need to scan all history on every load. One row per
-- (user_id, record_type), upserted and only replaced when beaten --
-- see domain/progress/progressCalculations.ts for detection logic.
create table public.personal_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  record_type text not null,
  value numeric not null,
  achieved_at timestamptz not null,
  source_session_id uuid references public.practice_sessions(id),
  created_at timestamptz not null default now(),
  unique (user_id, record_type)
);

create index personal_records_user_id_idx on public.personal_records (user_id);

alter table public.personal_records enable row level security;

create policy "Users can view their own personal records"
  on public.personal_records for select
  using (auth.uid() = user_id);

create policy "Users can insert their own personal records"
  on public.personal_records for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own personal records"
  on public.personal_records for update
  using (auth.uid() = user_id);
