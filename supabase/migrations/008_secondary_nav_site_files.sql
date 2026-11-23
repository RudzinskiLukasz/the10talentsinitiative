-- Allow theme HTML for new secondary-nav pages.
-- Keep in sync with src/data/siteFiles.js.

alter table public.site_files
  drop constraint if exists site_files_path_allowed;

alter table public.site_files
  add constraint site_files_path_allowed check (path = any (array[
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
    'pages/catholic-poets-collective.html',
    'pages/catholic-composers.html',
    'pages/tti-spirituality-unit.html',
    'pages/donations.html',
    'pages/upcoming-programs.html',
    'pages/privacy-policy.html',
    'pages/cookie-policy.html'
  ]));
