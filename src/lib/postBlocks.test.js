import { describe, expect, it } from "vitest";
import {
  blocksToTipTapDoc,
  isPostPubliclyVisible,
  parseVideoEmbed,
  tipTapDocToBlocks,
} from "./postBlocks.js";

describe("isPostPubliclyVisible", () => {
  const now = new Date("2026-06-15T12:00:00.000Z");

  it("shows published posts", () => {
    expect(isPostPubliclyVisible({ status: "published" }, now)).toBe(true);
  });

  it("hides drafts", () => {
    expect(isPostPubliclyVisible({ status: "draft" }, now)).toBe(false);
  });

  it("shows scheduled posts only after publish_at", () => {
    expect(
      isPostPubliclyVisible(
        { status: "scheduled", publish_at: "2026-06-15T11:00:00.000Z" },
        now
      )
    ).toBe(true);
    expect(
      isPostPubliclyVisible(
        { status: "scheduled", publish_at: "2026-06-15T13:00:00.000Z" },
        now
      )
    ).toBe(false);
  });
});

describe("parseVideoEmbed", () => {
  it("parses YouTube watch URLs", () => {
    expect(parseVideoEmbed("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toEqual({
      type: "embed",
      provider: "youtube",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    });
  });

  it("parses youtu.be short links", () => {
    expect(parseVideoEmbed("https://youtu.be/dQw4w9WgXcQ")).toMatchObject({
      provider: "youtube",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    });
  });

  it("parses Vimeo URLs", () => {
    expect(parseVideoEmbed("https://vimeo.com/123456789")).toEqual({
      type: "embed",
      provider: "vimeo",
      url: "https://vimeo.com/123456789",
      embedUrl: "https://player.vimeo.com/video/123456789",
    });
  });

  it("rejects unsupported hosts", () => {
    expect(parseVideoEmbed("https://example.com/video/1")).toBeNull();
  });
});

describe("TipTap ↔ blocks round trip", () => {
  it("converts media and rich text", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Hello ", marks: [{ type: "bold" }] },
            { type: "text", text: "world" },
          ],
        },
        { type: "image", attrs: { src: "https://cdn.example/a.jpg", alt: "A" } },
        { type: "video", attrs: { src: "https://cdn.example/a.mp4", poster: null } },
        {
          type: "embed",
          attrs: {
            provider: "youtube",
            url: "https://www.youtube.com/watch?v=abc",
            embedUrl: "https://www.youtube.com/embed/abc",
          },
        },
      ],
    };

    const blocks = tipTapDocToBlocks(doc);
    expect(blocks).toHaveLength(4);
    expect(blocks[0].type).toBe("rich");
    expect(blocks[0].content).toContain("Hello");
    expect(blocks[1]).toMatchObject({ type: "image", src: "https://cdn.example/a.jpg" });
    expect(blocks[2]).toMatchObject({ type: "video", src: "https://cdn.example/a.mp4" });
    expect(blocks[3]).toMatchObject({ type: "embed", provider: "youtube" });

    const roundTrip = blocksToTipTapDoc(blocks);
    expect(roundTrip.content).toHaveLength(4);
    expect(roundTrip.content[1].type).toBe("image");
  });

  it("loads legacy text blocks", () => {
    const doc = blocksToTipTapDoc([
      { type: "text", content: "Para one\n\nPara two" },
      { type: "image", src: "/img.jpg", alt: "" },
    ]);
    expect(doc.content.filter((n) => n.type === "paragraph")).toHaveLength(2);
    expect(doc.content.some((n) => n.type === "image")).toBe(true);
  });
});
