-- Theme file editor (WordPress-style custom CSS, JS, and HTML).
-- Run in the Supabase SQL editor after 003_post_scheduling_and_video.sql.
-- Keep the path allowlist in sync with src/data/siteFiles.js.

create table if not exists public.site_files (
  path text primary key,
  content text not null default '',
  previous_content text,
  updated_at timestamptz not null default now(),
  constraint site_files_content_len check (char_length(content) <= 200000),
  constraint site_files_previous_len check (
    previous_content is null or char_length(previous_content) <= 200000
  ),
  constraint site_files_path_allowed check (path = any (array[
    'custom.css',
    'custom.js',
    'head.html',
    'header.html',
    'footer.html',
    'pages/home.html',
    'pages/programs.html',
    'pages/daily-reflections.html',
    'pages/events.html',
    'pages/songs-books.html',
    'pages/contact.html',
    'pages/t-talents-records.html',
    'pages/t-talents-studios.html',
    'pages/t-talents-series.html',
    'pages/t-talents-sports.html',
    'pages/catholic-singles-forum.html',
    'pages/donations.html',
    'pages/upcoming-programs.html',
    'pages/privacy-policy.html',
    'pages/cookie-policy.html'
  ]))
);

create or replace function public.set_site_files_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_files_set_updated_at on public.site_files;
create trigger site_files_set_updated_at
  before update on public.site_files
  for each row
  execute function public.set_site_files_updated_at();

alter table public.site_files enable row level security;

drop policy if exists "Public can read site files" on public.site_files;
create policy "Public can read site files"
  on public.site_files
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can insert site files" on public.site_files;
create policy "Authenticated can insert site files"
  on public.site_files
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update site files" on public.site_files;
create policy "Authenticated can update site files"
  on public.site_files
  for update
  to authenticated
  using (true)
  with check (true);
