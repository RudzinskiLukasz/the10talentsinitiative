/**
 * Post content blocks: text / rich / image / video / embed.
 * TipTap JSON ↔ blocks conversion and safe embed URL parsing.
 */

const MEDIA_TYPES = new Set(["image", "video", "embed"]);
const TEXTISH_TYPES = new Set(["paragraph", "heading", "bulletList", "orderedList", "blockquote", "codeBlock", "horizontalRule"]);

/** Whether a CMS post row should appear on the public site. */
export function isPostPubliclyVisible(post, now = new Date()) {
  if (!post) return false;
  if (post.status === "published") return true;
  if (post.status === "scheduled" && post.publish_at) {
    const at = new Date(post.publish_at);
    return !Number.isNaN(at.getTime()) && at.getTime() <= now.getTime();
  }
  return false;
}

/**
 * Parse YouTube / Vimeo URLs into a safe embed block.
 * Returns null if the URL is not a supported provider.
 */
export function parseVideoEmbed(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  let parsed;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    let id = parsed.searchParams.get("v");
    if (!id && parsed.pathname.startsWith("/embed/")) {
      id = parsed.pathname.split("/")[2];
    }
    if (!id && parsed.pathname.startsWith("/shorts/")) {
      id = parsed.pathname.split("/")[2];
    }
    if (!id) return null;
    id = id.replace(/[^a-zA-Z0-9_-]/g, "");
    if (!id) return null;
    return {
      type: "embed",
      provider: "youtube",
      url: `https://www.youtube.com/watch?v=${id}`,
      embedUrl: `https://www.youtube.com/embed/${id}`,
    };
  }

  if (host === "youtu.be") {
    const id = parsed.pathname.replace(/^\//, "").split("/")[0]?.replace(/[^a-zA-Z0-9_-]/g, "");
    if (!id) return null;
    return {
      type: "embed",
      provider: "youtube",
      url: `https://www.youtube.com/watch?v=${id}`,
      embedUrl: `https://www.youtube.com/embed/${id}`,
    };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const parts = parsed.pathname.split("/").filter(Boolean);
    const id = (host === "player.vimeo.com" ? parts[1] : parts[0])?.replace(/\D/g, "");
    if (!id) return null;
    return {
      type: "embed",
      provider: "vimeo",
      url: `https://vimeo.com/${id}`,
      embedUrl: `https://player.vimeo.com/video/${id}`,
    };
  }

  return null;
}

function isMediaNode(node) {
  return node && MEDIA_TYPES.has(node.type);
}

function isTextishNode(node) {
  return node && TEXTISH_TYPES.has(node.type);
}

function plainTextFromNode(node) {
  if (!node) return "";
  if (node.type === "text") return node.text || "";
  if (!Array.isArray(node.content)) return "";
  return node.content.map(plainTextFromNode).join(node.type === "paragraph" || node.type === "heading" ? "" : " ");
}

function plainTextFromFragment(nodes) {
  if (!Array.isArray(nodes)) return "";
  return nodes
    .map((n) => {
      const t = plainTextFromNode(n).trim();
      return t;
    })
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Convert TipTap document JSON → CMS blocks[].
 */
export function tipTapDocToBlocks(doc) {
  const content = Array.isArray(doc?.content) ? doc.content : [];
  const blocks = [];
  let richBuffer = [];

  function flushRich() {
    if (!richBuffer.length) return;
    const plain = plainTextFromFragment(richBuffer);
    blocks.push({
      type: "rich",
      content: plain,
      doc: { type: "doc", content: richBuffer },
    });
    richBuffer = [];
  }

  for (const node of content) {
    if (node.type === "image") {
      flushRich();
      blocks.push({
        type: "image",
        src: node.attrs?.src || "",
        alt: node.attrs?.alt || "",
      });
    } else if (node.type === "video") {
      flushRich();
      blocks.push({
        type: "video",
        src: node.attrs?.src || "",
        poster: node.attrs?.poster || undefined,
      });
    } else if (node.type === "embed") {
      flushRich();
      blocks.push({
        type: "embed",
        provider: node.attrs?.provider || "youtube",
        url: node.attrs?.url || "",
        embedUrl: node.attrs?.embedUrl || "",
      });
    } else if (isTextishNode(node) || isMediaNode(node) === false) {
      richBuffer.push(node);
    }
  }
  flushRich();

  return blocks.length ? blocks : null;
}

/**
 * Convert CMS blocks[] → TipTap document JSON.
 */
export function blocksToTipTapDoc(blocks) {
  const content = [];

  if (!Array.isArray(blocks) || !blocks.length) {
    return { type: "doc", content: [{ type: "paragraph" }] };
  }

  for (const block of blocks) {
    if (!block) continue;

    if (block.type === "rich" && block.doc?.content) {
      content.push(...block.doc.content);
      continue;
    }

    if (block.type === "text" && block.content) {
      const paragraphs = String(block.content).split(/\n\n+/);
      for (const p of paragraphs) {
        const trimmed = p.trim();
        if (!trimmed) continue;
        content.push({
          type: "paragraph",
          content: [{ type: "text", text: trimmed }],
        });
      }
      continue;
    }

    if (block.type === "image" && block.src) {
      content.push({
        type: "image",
        attrs: { src: block.src, alt: block.alt || "" },
      });
      continue;
    }

    if (block.type === "video" && block.src) {
      content.push({
        type: "video",
        attrs: { src: block.src, poster: block.poster || null },
      });
      continue;
    }

    if (block.type === "embed" && block.embedUrl) {
      content.push({
        type: "embed",
        attrs: {
          provider: block.provider || "youtube",
          url: block.url || "",
          embedUrl: block.embedUrl,
        },
      });
    }
  }

  if (!content.length) {
    content.push({ type: "paragraph" });
  }

  return { type: "doc", content };
}

/** Plain-text body for the `content` column (search / fallback). */
export function blocksToPlainContent(blocks) {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((b) => {
      if (b?.type === "text" || b?.type === "rich") return b.content || "";
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

export function contentToTextBlocks(content) {
  return String(content || "")
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((text) => ({ type: "text", content: text }));
}

export function blocksToContent(blocks) {
  return blocksToPlainContent(blocks);
}
