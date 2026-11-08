-- ランプ諸島 — Supabase 進捗テーブル（SQL Editor で実行）
-- 前提: Authentication で Google プロバイダを有効化済みであること

create table if not exists public.lamp_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  save jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.lamp_progress enable row level security;

drop policy if exists "own read" on public.lamp_progress;
drop policy if exists "own upsert" on public.lamp_progress;
drop policy if exists "own update" on public.lamp_progress;

create policy "own read"
  on public.lamp_progress for select
  using (auth.uid() = user_id);

create policy "own upsert"
  on public.lamp_progress for insert
  with check (auth.uid() = user_id);

create policy "own update"
  on public.lamp_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

comment on table public.lamp_progress is 'Lamp-archipelago browser progress (LampSave JSON), one row per auth user';
