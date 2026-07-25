-- Posts CMS for The Ten Talents Initiative
-- Run in Supabase SQL Editor (or via supabase db push).

create extension if not exists "pgcrypto";

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  date date not null default (current_date),
  category text not null default 'Homilies/Reflections',
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  blocks jsonb,
  link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_status_date_idx
  on public.posts (status, date desc);

create index if not exists posts_category_idx
  on public.posts (category);

create or replace function public.set_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute function public.set_posts_updated_at();

alter table public.posts enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts
  for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Authenticated can read all posts" on public.posts;
create policy "Authenticated can read all posts"
  on public.posts
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can insert posts" on public.posts;
create policy "Authenticated can insert posts"
  on public.posts
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update posts" on public.posts;
create policy "Authenticated can update posts"
  on public.posts
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete posts" on public.posts;
create policy "Authenticated can delete posts"
  on public.posts
  for delete
  to authenticated
  using (true);

-- Storage bucket for post images (public read)
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can view post images" on storage.objects;
create policy "Public can view post images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'post-images');

drop policy if exists "Authenticated can upload post images" on storage.objects;
create policy "Authenticated can upload post images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'post-images');

drop policy if exists "Authenticated can update post images" on storage.objects;
create policy "Authenticated can update post images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'post-images')
  with check (bucket_id = 'post-images');

drop policy if exists "Authenticated can delete post images" on storage.objects;
create policy "Authenticated can delete post images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'post-images');
