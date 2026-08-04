/**
 * Map file-based SPA emergency entries onto React Router paths.
 * Used when Render rewrite is missing and the shell was opened as a real file
 * (e.g. /admin.html or /admin/index.html from ensure-spa-shells).
 */
const FILE_ENTRY_REWRITES = [
  { test: /^\/admin\.html\/?$/i, path: "/admin" },
  { test: /^\/admin\/index\.html$/i, path: "/admin" },
  { test: /^\/admin\/login\/index\.html$/i, path: "/admin/login" },
  { test: /^\/admin\/tracks\/index\.html$/i, path: "/admin/tracks" },
  { test: /^\/admin\/tracks\/new\/index\.html$/i, path: "/admin/tracks/new" },
  { test: /^\/admin\/posts\/new\/index\.html$/i, path: "/admin/posts/new" },
];

export function normalizeSpaEntryPathname(pathname) {
  for (const rule of FILE_ENTRY_REWRITES) {
    if (rule.test.test(pathname)) return rule.path;
  }
  return pathname;
}

/** Apply history rewrite once at boot (before React Router mounts). */
export function applySpaEntryNormalize(history = window.history, location = window.location) {
  const next = normalizeSpaEntryPathname(location.pathname);
  if (next === location.pathname) return false;
  history.replaceState(null, "", `${next}${location.search}${location.hash}`);
  return true;
}
