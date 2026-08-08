import { describe, expect, it } from "vitest";
import {
  contentToTextBlocks,
  fetchPublishedPosts,
  normalizePublishFields,
  slugifyTitle,
} from "./postsApi.js";
import { posts as staticPosts } from "../data/posts.js";

describe("postsApi helpers", () => {
  it("slugifies titles", () => {
    expect(slugifyTitle("Meet The Wonderful Lectors!")).toBe(
      "meet-the-wonderful-lectors"
    );
  });

  it("splits content into text blocks", () => {
    expect(contentToTextBlocks("Hello\n\nWorld")).toEqual([
      { type: "text", content: "Hello" },
      { type: "text", content: "World" },
    ]);
  });

  it("normalizes publish fields for scheduling", () => {
    expect(normalizePublishFields({ status: "draft" })).toEqual({
      status: "draft",
      publish_at: null,
    });
    expect(
      normalizePublishFields({
        status: "scheduled",
        publish_at: "2026-08-01T10:00:00.000Z",
      })
    ).toEqual({
      status: "scheduled",
      publish_at: "2026-08-01T10:00:00.000Z",
    });
    expect(() =>
      normalizePublishFields({ status: "scheduled", publish_at: null })
    ).toThrow(/require a publish date/i);
  });
});

describe("fetchPublishedPosts archive", () => {
  it("keeps the static Homilies/Reflections archive available", async () => {
    const list = await fetchPublishedPosts({
      category: "Homilies/Reflections",
    });
    const staticHomilies = staticPosts.filter(
      (p) => p.category === "Homilies/Reflections"
    );
    expect(list.length).toBeGreaterThanOrEqual(staticHomilies.length);
    expect(list.some((p) => p.slug === staticHomilies[0].slug)).toBe(true);
  });
});
