import {
  posts as staticPosts,
  getPostBySlug as getStaticPostBySlug,
} from "../data/posts.js";
import {
  blocksToContent,
  contentToTextBlocks,
  isPostPubliclyVisible,
} from "./postBlocks.js";
import { isSupabaseConfigured, supabase } from "./supabase.js";

export {
  blocksToContent,
  blocksToPlainContent,
  blocksToTipTapDoc,
  contentToTextBlocks,
  isPostPubliclyVisible,
  parseVideoEmbed,
  tipTapDocToBlocks,
} from "./postBlocks.js";

const POST_COLUMNS =
  "id, slug, title, excerpt, content, date, category, status, publish_at, blocks, link, created_at, updated_at";

function normalizePost(row) {
  if (!row) return null;
  return {
    ...row,
    date: typeof row.date === "string" ? row.date.slice(0, 10) : row.date,
    blocks: Array.isArray(row.blocks) ? row.blocks : undefined,
  };
}

function sortByDateDesc(a, b) {
  return String(b.date).localeCompare(String(a.date));
}

function staticPublishedPosts(category) {
  let list = [...staticPosts];
  if (category) list = list.filter((p) => p.category === category);
  return list.sort(sortByDateDesc);
}

/**
 * Merge CMS rows with the static WordPress snapshot.
 * Supabase wins on slug collision; static posts fill gaps until seed/admin
 * covers everything (empty CMS must not wipe the public archive).
 */
function mergeWithStatic(remotePosts, category) {
  const remote = (remotePosts || []).map(normalizePost).filter(Boolean);
  const remoteSlugs = new Set(remote.map((p) => p.slug));
  const missing = staticPublishedPosts(category).filter(
    (p) => !remoteSlugs.has(p.slug)
  );
  return [...remote, ...missing].sort(sortByDateDesc);
}

function filterPublicPosts(rows) {
  const now = new Date();
  return (rows || []).map(normalizePost).filter((p) => isPostPubliclyVisible(p, now));
}

/** Published (and due scheduled) posts for the public site. */
export async function fetchPublishedPosts({ category } = {}) {
  if (!isSupabaseConfigured) {
    return staticPublishedPosts(category);
  }

  let query = supabase
    .from("posts")
    .select(POST_COLUMNS)
    .in("status", ["published", "scheduled"])
    .order("date", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) {
    // Fallback for DBs that have not run 003 yet (no publish_at / scheduled).
    let fallback = supabase
      .from("posts")
      .select(
        "id, slug, title, excerpt, content, date, category, status, blocks, link, created_at, updated_at"
      )
      .eq("status", "published")
      .order("date", { ascending: false });
    if (category) fallback = fallback.eq("category", category);
    const second = await fallback;
    if (second.error) throw error;
    return mergeWithStatic(second.data, category);
  }

  return mergeWithStatic(filterPublicPosts(data), category);
}

export async function fetchPublishedPostBySlug(slug) {
  if (!isSupabaseConfigured) {
    return getStaticPostBySlug(slug) || null;
  }

  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    const second = await supabase
      .from("posts")
      .select(
        "id, slug, title, excerpt, content, date, category, status, blocks, link, created_at, updated_at"
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (second.error) throw error;
    return normalizePost(second.data) || getStaticPostBySlug(slug) || null;
  }

  const post = normalizePost(data);
  if (post && isPostPubliclyVisible(post)) return post;
  return getStaticPostBySlug(slug) || null;
}

/** Admin: all posts including drafts and scheduled. */
export async function fetchAdminPosts() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizePost);
}

export async function fetchAdminPostById(id) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return normalizePost(data);
}

export async function createPost(payload) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("posts")
    .insert(payload)
    .select(POST_COLUMNS)
    .single();

  if (error) throw error;
  return normalizePost(data);
}

export async function updatePost(id, payload) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("posts")
    .update(payload)
    .eq("id", id)
    .select(POST_COLUMNS)
    .single();

  if (error) throw error;
  return normalizePost(data);
}

export async function deletePost(id) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

function safeStorageName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export async function uploadPostImage(file, { slug } = {}) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const folder = slug || "uploads";
  const path = `${folder}/${Date.now()}-${safeStorageName(file.name)}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg",
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadPostVideo(file, { slug } = {}) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const allowed = ["video/mp4", "video/webm", "video/quicktime"];
  if (file.type && !allowed.includes(file.type)) {
    throw new Error("Unsupported video type. Use MP4, WebM, or MOV.");
  }

  const folder = slug || "uploads";
  const path = `${folder}/${Date.now()}-${safeStorageName(file.name)}`;

  const { error: uploadError } = await supabase.storage
    .from("post-videos")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "video/mp4",
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("post-videos").getPublicUrl(path);
  return data.publicUrl;
}

export function slugifyTitle(title) {
  return String(title || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Normalize admin save payload for status / publish_at rules. */
export function normalizePublishFields({ status, publish_at }) {
  const nextStatus = status || "draft";
  if (nextStatus === "draft") {
    return { status: "draft", publish_at: null };
  }
  if (nextStatus === "published") {
    return { status: "published", publish_at: publish_at || null };
  }
  if (nextStatus === "scheduled") {
    if (!publish_at) {
      throw new Error("Scheduled posts require a publish date and time.");
    }
    return { status: "scheduled", publish_at };
  }
  return { status: "draft", publish_at: null };
}
