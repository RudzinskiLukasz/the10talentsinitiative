#!/usr/bin/env node
/**
 * Smoke-check that a deployed host serves the SPA shell for deep links
 * (especially /admin). Exit 1 if any checked URL returns non-HTML / 404.
 *
 * Usage:
 *   node scripts/check-spa-fallback.mjs
 *   node scripts/check-spa-fallback.mjs https://www.the10talentsinitiative.com
 */
const DEFAULT_ORIGIN = "https://www.the10talentsinitiative.com";

const origin = (process.argv[2] || DEFAULT_ORIGIN).replace(/\/$/, "");

const paths = [
  "/",
  "/admin",
  "/admin/login",
  "/programs",
  "/daily-reflections",
  "/admin.html",
  "/admin/index.html",
];

function isSpaShell(status, contentType, body) {
  if (status < 200 || status >= 300) return false;
  if (!String(contentType || "").includes("text/html")) return false;
  // Reject Render's plain-text "Not Found" and empty error bodies.
  if (!body || /^\s*Not Found\s*$/i.test(body)) return false;
  return /<html[\s>]/i.test(body) || /<div id="root"/i.test(body);
}

const results = [];

for (const path of paths) {
  const url = `${origin}${path}`;
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { Accept: "text/html" },
    });
    const body = await res.text();
    const ok = isSpaShell(res.status, res.headers.get("content-type"), body);
    results.push({ path, status: res.status, ok, finalUrl: res.url });
  } catch (err) {
    results.push({ path, status: 0, ok: false, error: err.message });
  }
}

const failed = results.filter((r) => !r.ok);

for (const r of results) {
  const mark = r.ok ? "OK " : "FAIL";
  const detail = r.error || `HTTP ${r.status}`;
  console.log(`${mark}  ${r.path}  (${detail})`);
}

if (failed.length) {
  console.error(`
SPA fallback is broken on ${origin} for: ${failed.map((f) => f.path).join(", ")}

Fix on Render (Static Site → Redirects/Rewrites):
  Source: /*    Destination: /index.html    Action: Rewrite

Or sync the Blueprint so render.yaml routes are applied, then redeploy.
Until then, /admin.html is a file-based emergency entry after the next deploy.
`);
  process.exit(1);
}

console.log(`\nAll ${results.length} SPA smoke checks passed for ${origin}`);
