-- Scheduling + post video storage for The Ten Talents Initiative
-- Run in Supabase SQL Editor after 001_posts.sql (and 002_tracks.sql if used).

-- publish_at for scheduled posts
alter table public.posts
  add column if not exists publish_at timestamptz;

-- Allow scheduled status (drop + recreate check; Postgres has no ALTER CHECK easily)
alter table public.posts drop constraint if exists posts_status_check;
alter table public.posts
  add constraint posts_status_check
  check (status in ('draft', 'published', 'scheduled'));

create index if not exists posts_status_publish_at_idx
  on public.posts (status, publish_at);

-- Public read: published always, or scheduled whose publish_at has passed
drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts
  for select
  to anon, authenticated
  using (
    status = 'published'
    or (
      status = 'scheduled'
      and publish_at is not null
      and publish_at <= now()
    )
  );

-- Storage bucket for uploaded post videos (public read)
insert into storage.buckets (id, name, public)
values ('post-videos', 'post-videos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can view post videos" on storage.objects;
create policy "Public can view post videos"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'post-videos');

drop policy if exists "Authenticated can upload post videos" on storage.objects;
create policy "Authenticated can upload post videos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'post-videos');

drop policy if exists "Authenticated can update post videos" on storage.objects;
create policy "Authenticated can update post videos"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'post-videos')
  with check (bucket_id = 'post-videos');

drop policy if exists "Authenticated can delete post videos" on storage.objects;
create policy "Authenticated can delete post videos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'post-videos');
