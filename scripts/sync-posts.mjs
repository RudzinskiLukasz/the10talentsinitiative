/**
 * Sync blog posts and images from the10talentsinitiative.com WordPress API.
 * Usage: node scripts/sync-posts.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WP_API =
  "https://the10talentsinitiative.com/wp-json/wp/v2/posts?per_page=100&orderby=date&order=desc";
const IMAGES_DIR = path.join(ROOT, "public/images/posts");
const POSTS_FILE = path.join(ROOT, "src/data/posts.js");
const CATEGORY_MAP = { 9: "Homilies/Reflections" };

function decodeEntities(text) {
  return text
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(html) {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<\/h[1-6]>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

function fullSizeUrl(url) {
  return url.replace(/-\d+x\d+(?=\.\w+$)/, "");
}

async function downloadImage(url, dest) {
  if (fs.existsSync(dest)) return;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

function parseBlocks(html, slug, pendingDownloads) {
  const blocks = [];
  const cleaned = html
    .replace(/<figure[^>]*>/gi, "")
    .replace(/<\/figure>/gi, "")
    .replace(/<div[^>]*>/gi, "")
    .replace(/<\/div>/gi, "");

  const parts = cleaned.split(/(<img[^>]+>)/gi);

  for (const part of parts) {
    if (/^<img/i.test(part)) {
      const srcMatch = part.match(/src="([^"]+)"/i);
      if (!srcMatch) continue;
      const remoteUrl = fullSizeUrl(srcMatch[1]);
      const filename = path.basename(new URL(remoteUrl).pathname);
      const localSrc = `/images/posts/${slug}/${filename}`;
      const localPath = path.join(IMAGES_DIR, slug, filename);
      pendingDownloads.push({ remoteUrl, localPath });
      const altMatch = part.match(/alt="([^"]*)"/i);
      blocks.push({
        type: "image",
        src: localSrc,
        alt: altMatch ? decodeEntities(altMatch[1]) : "",
      });
      continue;
    }

    const text = stripHtml(part);
    if (!text) continue;

    for (const paragraph of text.split(/\n+/).map((p) => p.trim()).filter(Boolean)) {
      blocks.push({ type: "text", content: paragraph });
    }
  }

  return blocks;
}

function blocksToContent(blocks) {
  return blocks
    .filter((b) => b.type === "text")
    .map((b) => b.content)
    .join("\n");
}

function escapeJs(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

async function main() {
  const res = await fetch(WP_API);
  if (!res.ok) throw new Error(`WordPress API error: ${res.status}`);
  const wpPosts = await res.json();

  const posts = [];
  const pendingDownloads = [];

  for (const wp of wpPosts) {
    if (wp.slug === "test") continue;

    const html = wp.content?.rendered ?? "";
    const blocks = parseBlocks(html, wp.slug, pendingDownloads);
    const content = blocksToContent(blocks);
    const excerpt = stripHtml(wp.excerpt?.rendered ?? "").replace(/\[…\]$/, "…");
    const categoryId = wp.categories?.[0];
    const category = CATEGORY_MAP[categoryId] ?? "Homilies/Reflections";

    const post = {
      slug: wp.slug,
      title: decodeEntities(wp.title?.rendered ?? ""),
      link: wp.link,
      date: wp.date?.slice(0, 10) ?? "",
      category,
      excerpt,
      content,
    };

    const images = blocks.filter((b) => b.type === "image");
    if (images.length > 0) {
      post.blocks = blocks;
    }

    posts.push(post);
  }

  console.log(`Downloading ${pendingDownloads.length} images…`);
  for (const { remoteUrl, localPath } of pendingDownloads) {
    try {
      await downloadImage(remoteUrl, localPath);
      console.log(`  ✓ ${path.relative(ROOT, localPath)}`);
    } catch (err) {
      console.warn(`  ✗ ${remoteUrl}: ${err.message}`);
    }
  }

  const lines = [
    "// Auto-sourced from the10talentsinitiative.com WordPress API",
    "// Regenerate: node scripts/sync-posts.mjs",
    "export const posts = " + JSON.stringify(posts, null, 2) + ";",
    "",
    "export function getPostBySlug(slug) {",
    "  return posts.find((p) => p.slug === slug);",
    "}",
    "",
  ];

  fs.writeFileSync(POSTS_FILE, lines.join("\n"));
  console.log(`Wrote ${posts.length} posts to ${path.relative(ROOT, POSTS_FILE)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
