-- T-Talents Records: music tracks CMS
-- Run in Supabase SQL Editor after 001_posts.sql.

create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null default '',
  description text not null default '',
  cover_url text,
  audio_url text not null,
  file_name text not null default '',
  mime_type text not null default '',
  date date not null default (current_date),
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tracks_status_date_idx
  on public.tracks (status, date desc);

create or replace function public.set_tracks_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tracks_set_updated_at on public.tracks;
create trigger tracks_set_updated_at
  before update on public.tracks
  for each row
  execute function public.set_tracks_updated_at();

alter table public.tracks enable row level security;

drop policy if exists "Public can read published tracks" on public.tracks;
create policy "Public can read published tracks"
  on public.tracks
  for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Authenticated can read all tracks" on public.tracks;
create policy "Authenticated can read all tracks"
  on public.tracks
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can insert tracks" on public.tracks;
create policy "Authenticated can insert tracks"
  on public.tracks
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update tracks" on public.tracks;
create policy "Authenticated can update tracks"
  on public.tracks
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete tracks" on public.tracks;
create policy "Authenticated can delete tracks"
  on public.tracks
  for delete
  to authenticated
  using (true);

-- Public storage for audio + optional cover art
insert into storage.buckets (id, name, public)
values ('track-audio', 'track-audio', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can view track audio" on storage.objects;
create policy "Public can view track audio"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'track-audio');

drop policy if exists "Authenticated can upload track audio" on storage.objects;
create policy "Authenticated can upload track audio"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'track-audio');

drop policy if exists "Authenticated can update track audio" on storage.objects;
create policy "Authenticated can update track audio"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'track-audio')
  with check (bucket_id = 'track-audio');

drop policy if exists "Authenticated can delete track audio" on storage.objects;
create policy "Authenticated can delete track audio"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'track-audio');
