import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  MAX_SITE_FILE_CHARS,
  SITE_FILES,
  assertSiteFilePath,
  escapeStyleContent,
  getSiteFile,
  hasVisibleMarkup,
  markupWithoutScripts,
  normalizePathname,
  siteFileForRoute,
} from "./siteFiles.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

describe("site file catalog", () => {
  it("resolves known theme files and rejects the rest", () => {
    expect(getSiteFile("custom.css")?.language).toBe("css");
    expect(getSiteFile("custom.js")?.language).toBe("javascript");
    expect(getSiteFile("../secret.env")).toBeNull();
    expect(() => assertSiteFilePath("pages/home.html")).not.toThrow();
    expect(() => assertSiteFilePath("wp-config.php")).toThrow(/cannot be edited/i);
  });

  it("matches public routes, including a trailing slash", () => {
    expect(normalizePathname("/programs/")).toBe("/programs");
    expect(siteFileForRoute("/").path).toBe("pages/home.html");
    expect(siteFileForRoute("/programs/").route).toBe("/programs");
    expect(siteFileForRoute("/meet-the-wonderful-lectors")).toBeNull();
    expect(siteFileForRoute("/admin/code")).toBeNull();
  });

  it("keeps the database allowlist aligned with the editor", () => {
    const sql = readFileSync(
      resolve(root, "supabase/migrations/004_site_files.sql"),
      "utf8"
    );
    expect(sql).toContain(String(MAX_SITE_FILE_CHARS));
    for (const file of SITE_FILES) {
      expect(sql).toContain(`'${file.path}'`);
    }
  });

  it("stops CSS from closing the style tag and detects visible markup", () => {
    expect(escapeStyleContent("a { color: red } </style><script>")).toBe(
      "a { color: red } <\\/style><script>"
    );
    expect(hasVisibleMarkup("<p>Hello</p>")).toBe(true);
    expect(hasVisibleMarkup("<script>alert(1)</script>")).toBe(false);
    expect(markupWithoutScripts('<p>Hi</p><script>bad()</script>')).toBe("<p>Hi</p>");
  });
});
