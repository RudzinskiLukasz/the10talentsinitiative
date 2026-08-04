import { describe, expect, it } from "vitest";
import {
  applySpaEntryNormalize,
  normalizeSpaEntryPathname,
} from "./normalizeSpaEntry.js";

describe("normalizeSpaEntryPathname", () => {
  it("maps file-based admin shells onto /admin routes", () => {
    expect(normalizeSpaEntryPathname("/admin.html")).toBe("/admin");
    expect(normalizeSpaEntryPathname("/admin.html/")).toBe("/admin");
    expect(normalizeSpaEntryPathname("/admin/index.html")).toBe("/admin");
    expect(normalizeSpaEntryPathname("/admin/login/index.html")).toBe("/admin/login");
    expect(normalizeSpaEntryPathname("/admin/tracks/index.html")).toBe("/admin/tracks");
  });

  it("leaves normal SPA paths unchanged", () => {
    expect(normalizeSpaEntryPathname("/admin")).toBe("/admin");
    expect(normalizeSpaEntryPathname("/admin/login")).toBe("/admin/login");
    expect(normalizeSpaEntryPathname("/programs")).toBe("/programs");
  });
});

describe("applySpaEntryNormalize", () => {
  it("rewrites history for admin.html emergency entry", () => {
    const calls = [];
    const history = {
      replaceState(_state, _title, url) {
        calls.push(url);
      },
    };
    const location = {
      pathname: "/admin.html",
      search: "?x=1",
      hash: "#top",
    };

    expect(applySpaEntryNormalize(history, location)).toBe(true);
    expect(calls).toEqual(["/admin?x=1#top"]);
  });

  it("is a no-op for already-normalized paths", () => {
    const history = { replaceState() { throw new Error("should not run"); } };
    const location = { pathname: "/admin", search: "", hash: "" };
    expect(applySpaEntryNormalize(history, location)).toBe(false);
  });
});
