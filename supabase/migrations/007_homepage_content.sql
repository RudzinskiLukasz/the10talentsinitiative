-- Homepage CMS: editable hero copy, section text, and slideshow images.
-- Run in the Supabase SQL editor after 005_profiles_and_member_auth.sql.

create table if not exists public.homepage_content (
  id text primary key default 'home'
    check (id = 'home'),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.set_homepage_content_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists homepage_content_set_updated_at on public.homepage_content;
create trigger homepage_content_set_updated_at
  before update on public.homepage_content
  for each row
  execute function public.set_homepage_content_updated_at();

alter table public.homepage_content enable row level security;

drop policy if exists "Public can read homepage content" on public.homepage_content;
create policy "Public can read homepage content"
  on public.homepage_content
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert homepage content" on public.homepage_content;
create policy "Admins can insert homepage content"
  on public.homepage_content
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update homepage content" on public.homepage_content;
create policy "Admins can update homepage content"
  on public.homepage_content
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Seed a single row so upserts from admin always have a target.
insert into public.homepage_content (id, content)
values ('home', '{}'::jsonb)
on conflict (id) do nothing;

-- Storage bucket for homepage images (public read)
insert into storage.buckets (id, name, public)
values ('homepage-images', 'homepage-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can view homepage images" on storage.objects;
create policy "Public can view homepage images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'homepage-images');

drop policy if exists "Admins can upload homepage images" on storage.objects;
create policy "Admins can upload homepage images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'homepage-images' and public.is_admin());

drop policy if exists "Admins can update homepage images" on storage.objects;
create policy "Admins can update homepage images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'homepage-images' and public.is_admin())
  with check (bucket_id = 'homepage-images' and public.is_admin());

drop policy if exists "Admins can delete homepage images" on storage.objects;
create policy "Admins can delete homepage images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'homepage-images' and public.is_admin());
