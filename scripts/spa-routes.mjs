/**
 * Client-side routes that must resolve to the SPA shell on the static host.
 * Keep in sync with src/App.jsx (static segments only — dynamic :slug posts
 * still need the catch-all /* → /index.html rewrite on Render).
 */
export const SPA_SHELL_ROUTES = [
  "/admin",
  "/admin/login",
  "/admin/posts/new",
  "/admin/tracks",
  "/admin/tracks/new",
  "/programs",
  "/daily-reflections",
  "/events",
  "/songs-books",
  "/contact",
  "/t-talents-records",
  "/t-talents-studios",
  "/t-talents-series",
  "/t-talents-sports",
  "/catholic-singles-forum",
  "/donations",
  "/upcoming-programs",
  "/privacy-policy",
  "/cookie-policy-eu",
  "/donor-dashboard",
  "/donation-failed",
  "/donation-confirmation",
];
