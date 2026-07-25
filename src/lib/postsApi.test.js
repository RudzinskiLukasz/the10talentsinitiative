import { describe, expect, it } from "vitest";
import { contentToTextBlocks, slugifyTitle } from "./postsApi.js";

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
