/**
 * Seed Supabase `posts` from the static src/data/posts.js snapshot.
 *
 * Requires (in env or .env — not Vite-prefixed):
 *   SUPABASE_URL or VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   node --env-file=.env scripts/seed-posts-from-static.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { posts } from "../src/data/posts.js";

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const rows = posts.map((post) => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt || "",
  content: post.content || "",
  date: post.date,
  category: post.category || "Homilies/Reflections",
  status: "published",
  blocks: post.blocks || null,
  link: post.link || null,
}));

const { data, error } = await supabase
  .from("posts")
  .upsert(rows, { onConflict: "slug" })
  .select("slug");

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(`Seeded ${data?.length ?? rows.length} posts.`);
