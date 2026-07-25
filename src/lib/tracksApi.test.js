import { describe, expect, it } from "vitest";
import { fetchPublishedTracks } from "./tracksApi.js";

describe("tracksApi", () => {
  it("returns an empty list when Supabase is not configured (test mode)", async () => {
    await expect(fetchPublishedTracks()).resolves.toEqual([]);
  });
});
