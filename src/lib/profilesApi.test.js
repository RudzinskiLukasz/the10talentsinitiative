import { describe, expect, it } from "vitest";
import { normalizeProfile } from "./profilesApi.js";

describe("normalizeProfile", () => {
  it("returns null for empty input", () => {
    expect(normalizeProfile(null)).toBeNull();
  });

  it("maps snake_case fields and defaults apps", () => {
    expect(
      normalizeProfile({
        id: "abc",
        display_name: "Ada",
        role: "member",
        apps: null,
        created_at: "2026-01-01",
        updated_at: "2026-01-02",
      })
    ).toEqual({
      id: "abc",
      displayName: "Ada",
      role: "member",
      apps: ["ten_talents"],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-02",
    });
  });

  it("keeps admin role and apps list", () => {
    expect(
      normalizeProfile({
        id: "1",
        display_name: "Admin",
        role: "admin",
        apps: ["ten_talents", "cast"],
      })
    ).toMatchObject({
      role: "admin",
      apps: ["ten_talents", "cast"],
    });
  });
});
