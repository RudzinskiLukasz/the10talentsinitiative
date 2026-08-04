#!/usr/bin/env node
/**
 * After `vite build`, copy the SPA shell to well-known HTML entry paths.
 *
 * Primary hosting fix is still Render rewrite `/*` → `/index.html` (see
 * render.yaml). These extra shells give a working deep-link entry when that
 * rewrite is missing: `/admin.html` and `/admin/index.html` are real files.
 */
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SPA_SHELL_ROUTES } from "./spa-routes.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const buildDir = join(root, "build");
const shell = join(buildDir, "index.html");

if (!existsSync(shell)) {
  console.error("[ensure-spa-shells] Missing build/index.html — run vite build first.");
  process.exit(1);
}

const targets = new Set(["admin.html"]);

for (const route of SPA_SHELL_ROUTES) {
  const trimmed = route.replace(/^\//, "").replace(/\/$/, "");
  if (!trimmed) continue;
  // Real file at /path/index.html (works without rewrite when opened explicitly)
  targets.add(join(trimmed, "index.html"));
}

for (const relative of targets) {
  const dest = join(buildDir, relative);
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(shell, dest);
}

console.log(
  `[ensure-spa-shells] Copied SPA shell to ${targets.size} fallback paths (incl. admin.html).`
);
