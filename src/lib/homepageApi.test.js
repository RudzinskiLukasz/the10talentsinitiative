import { describe, expect, it } from "vitest";
import { EMPTY_HOMEPAGE_CONTENT } from "../data/homepageContent.js";
import { fetchHomepageContent, migrationHint } from "./homepageApi.js";

describe("homepageApi", () => {
  it("returns empty content when Supabase is not configured (test mode)", async () => {
    await expect(fetchHomepageContent()).resolves.toEqual(EMPTY_HOMEPAGE_CONTENT);
  });

  it("hints to run the homepage migration when the table is missing", () => {
    expect(migrationHint('relation "homepage_content" does not exist')).toMatch(
      /007_homepage_content\.sql/
    );
  });
});
