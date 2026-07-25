import { describe, expect, it } from "vitest";
import {
  DEFAULT_POST_CATEGORY,
  POST_CATEGORIES,
  getCategoryByHref,
  getCategoryByValue,
} from "./postCategories.js";

describe("postCategories", () => {
  it("defaults to Daily Reflections / Homilies", () => {
    expect(DEFAULT_POST_CATEGORY).toBe("Homilies/Reflections");
    expect(POST_CATEGORIES.find((c) => c.isDefault)?.href).toBe(
      "/daily-reflections"
    );
  });

  it("maps T-Talents Sports href and value", () => {
    expect(getCategoryByHref("/t-talents-sports")?.value).toBe(
      "T-Talents Sports"
    );
    expect(getCategoryByValue("T-Talents Sports")?.href).toBe(
      "/t-talents-sports"
    );
  });
});
