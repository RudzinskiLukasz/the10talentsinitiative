import {
  posts as staticPosts,
  getPostBySlug as getStaticPostBySlug,
} from "../data/posts.js";
import { isSupabaseConfigured, supabase } from "./supabase.js";

const POST_COLUMNS =
  "id, slug, title, excerpt, content, date, category, status, blocks, link, created_at, updated_at";

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

/** Published posts for the public site (Supabase or static fallback). */
export async function fetchPublishedPosts({ category } = {}) {
  if (!isSupabaseConfigured) {
    let list = [...staticPosts];
    if (category) list = list.filter((p) => p.category === category);
    return list.sort(sortByDateDesc);
  }

  let query = supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("status", "published")
    .order("date", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(normalizePost);
}

export async function fetchPublishedPostBySlug(slug) {
  if (!isSupabaseConfigured) {
    return getStaticPostBySlug(slug) || null;
  }

  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return normalizePost(data);
}

/** Admin: all posts including drafts. */
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

export async function uploadPostImage(file, { slug } = {}) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const folder = slug || "uploads";
  const path = `${folder}/${Date.now()}-${safeName}`;

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

export function slugifyTitle(title) {
  return String(title || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function contentToTextBlocks(content) {
  return String(content || "")
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((text) => ({ type: "text", content: text }));
}

export function blocksToContent(blocks) {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((b) => b?.type === "text" && b.content)
    .map((b) => b.content)
    .join("\n\n");
}
