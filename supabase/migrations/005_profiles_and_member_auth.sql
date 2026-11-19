-- Member accounts (shared later with CAST) + admin-only CMS write access.
-- Run in Supabase SQL Editor after 004_site_files.sql.
--
-- IMPORTANT: Existing auth users are backfilled as role = 'admin'
-- (they were created before public signup). New sign-ups become 'member'.
-- Promote/demote later with:
--   update public.profiles set role = 'admin' where id = '<user-uuid>';

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  role text not null default 'member'
    check (role in ('member', 'admin')),
  -- Apps this identity can use. CAST will add 'cast' when shared auth goes live.
  apps text[] not null default array['ten_talents']::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_apps_nonempty check (cardinality(apps) >= 1)
);

create index if not exists profiles_role_idx on public.profiles (role);

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_profiles_updated_at();

-- Members must not escalate role / apps from the client.
create or replace function public.profiles_guard_sensitive()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and coalesce(auth.role(), '') = 'authenticated' then
    new.role := old.role;
    new.apps := old.apps;
    new.id := old.id;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_sensitive on public.profiles;
create trigger profiles_guard_sensitive
  before update on public.profiles
  for each row
  execute function public.profiles_guard_sensitive();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role, apps)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      split_part(new.email, '@', 1)
    ),
    'member',
    array['ten_talents']::text[]
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Backfill: every existing user was an admin before public signup existed.
insert into public.profiles (id, display_name, role, apps)
select
  u.id,
  coalesce(
    nullif(trim(u.raw_user_meta_data->>'display_name'), ''),
    nullif(trim(u.raw_user_meta_data->>'full_name'), ''),
    split_part(u.email, '@', 1)
  ),
  'admin',
  array['ten_talents']::text[]
from auth.users u
on conflict (id) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---- Tighten CMS write policies to admins only ----

drop policy if exists "Authenticated can read all posts" on public.posts;
drop policy if exists "Admins can read all posts" on public.posts;
create policy "Admins can read all posts"
  on public.posts
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Authenticated can insert posts" on public.posts;
drop policy if exists "Admins can insert posts" on public.posts;
create policy "Admins can insert posts"
  on public.posts
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Authenticated can update posts" on public.posts;
drop policy if exists "Admins can update posts" on public.posts;
create policy "Admins can update posts"
  on public.posts
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated can delete posts" on public.posts;
drop policy if exists "Admins can delete posts" on public.posts;
create policy "Admins can delete posts"
  on public.posts
  for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "Authenticated can upload post images" on storage.objects;
drop policy if exists "Admins can upload post images" on storage.objects;
create policy "Admins can upload post images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'post-images' and public.is_admin());

drop policy if exists "Authenticated can update post images" on storage.objects;
drop policy if exists "Admins can update post images" on storage.objects;
create policy "Admins can update post images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'post-images' and public.is_admin())
  with check (bucket_id = 'post-images' and public.is_admin());

drop policy if exists "Authenticated can delete post images" on storage.objects;
drop policy if exists "Admins can delete post images" on storage.objects;
create policy "Admins can delete post images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'post-images' and public.is_admin());

drop policy if exists "Authenticated can upload post videos" on storage.objects;
drop policy if exists "Admins can upload post videos" on storage.objects;
create policy "Admins can upload post videos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'post-videos' and public.is_admin());

drop policy if exists "Authenticated can update post videos" on storage.objects;
drop policy if exists "Admins can update post videos" on storage.objects;
create policy "Admins can update post videos"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'post-videos' and public.is_admin())
  with check (bucket_id = 'post-videos' and public.is_admin());

drop policy if exists "Authenticated can delete post videos" on storage.objects;
drop policy if exists "Admins can delete post videos" on storage.objects;
create policy "Admins can delete post videos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'post-videos' and public.is_admin());

drop policy if exists "Authenticated can read all tracks" on public.tracks;
drop policy if exists "Admins can read all tracks" on public.tracks;
create policy "Admins can read all tracks"
  on public.tracks
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Authenticated can insert tracks" on public.tracks;
drop policy if exists "Admins can insert tracks" on public.tracks;
create policy "Admins can insert tracks"
  on public.tracks
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Authenticated can update tracks" on public.tracks;
drop policy if exists "Admins can update tracks" on public.tracks;
create policy "Admins can update tracks"
  on public.tracks
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Authenticated can delete tracks" on public.tracks;
drop policy if exists "Admins can delete tracks" on public.tracks;
create policy "Admins can delete tracks"
  on public.tracks
  for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "Authenticated can upload track audio" on storage.objects;
drop policy if exists "Admins can upload track audio" on storage.objects;
create policy "Admins can upload track audio"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'track-audio' and public.is_admin());

drop policy if exists "Authenticated can update track audio" on storage.objects;
drop policy if exists "Admins can update track audio" on storage.objects;
create policy "Admins can update track audio"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'track-audio' and public.is_admin())
  with check (bucket_id = 'track-audio' and public.is_admin());

drop policy if exists "Authenticated can delete track audio" on storage.objects;
drop policy if exists "Admins can delete track audio" on storage.objects;
create policy "Admins can delete track audio"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'track-audio' and public.is_admin());

drop policy if exists "Authenticated can insert site files" on public.site_files;
drop policy if exists "Admins can insert site files" on public.site_files;
create policy "Admins can insert site files"
  on public.site_files
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Authenticated can update site files" on public.site_files;
drop policy if exists "Admins can update site files" on public.site_files;
create policy "Admins can update site files"
  on public.site_files
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
