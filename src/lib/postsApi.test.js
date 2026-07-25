import { describe, expect, it } from "vitest";
import {
  contentToTextBlocks,
  fetchPublishedPosts,
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
