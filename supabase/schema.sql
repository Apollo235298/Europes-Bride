-- Europe's Bride Growth Portal — database schema.
-- Run this in the Supabase SQL Editor (or `supabase db push`) on a fresh project.

-- User profiles: one row per auth user, carries the portal role.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  role text not null default 'client' check (role in ('admin', 'client'))
);

-- The whole dashboard document (EB_DATA shape) lives in one jsonb row.
-- Monthly update = edit this one document (or run `npm run seed` after editing lib/demo-data.js).
create table if not exists public.dashboard_state (
  id int primary key default 1 check (id = 1),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Comments: general thread (task_id null) and per-task threads (task_id = strategy task id).
-- author references profiles (not auth.users) so the app's `profiles(...)` join works in PostgREST.
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  author uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  task_id text,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.dashboard_state enable row level security;
alter table public.comments enable row level security;

-- Any signed-in user can read profiles (needed to render comment author names).
create policy "profiles readable by authenticated"
  on public.profiles for select to authenticated using (true);

-- Dashboard data: readable by any signed-in user; writable by admins only.
create policy "dashboard readable by authenticated"
  on public.dashboard_state for select to authenticated using (true);
create policy "dashboard writable by admins"
  on public.dashboard_state for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Comments: readable by any signed-in user; users insert as themselves; delete own or admin.
create policy "comments readable by authenticated"
  on public.comments for select to authenticated using (true);
create policy "comments insert as self"
  on public.comments for insert to authenticated with check (author = auth.uid());
create policy "comments delete own or admin"
  on public.comments for delete to authenticated
  using (author = auth.uid()
         or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
