-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
create table if not exists public.site_content (
  id int primary key default 1 check (id = 1),               -- a single row
  data jsonb not null default '{}'::jsonb check (pg_column_size(data) < 4000000),
  updated_at timestamptz not null default now()
);
insert into public.site_content (id, data) values (1, '{}'::jsonb) on conflict (id) do nothing;

alter table public.site_content enable row level security;

-- Everyone can read the site content
create policy "public read" on public.site_content
  for select to anon, authenticated using (true);

-- ONLY your admin account can update it (no insert / delete policy = denied)
create policy "admin update" on public.site_content
  for update to authenticated
  using ((auth.jwt() ->> 'email') = 'papamor.ndiaye.pro@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'papamor.ndiaye.pro@gmail.com');
