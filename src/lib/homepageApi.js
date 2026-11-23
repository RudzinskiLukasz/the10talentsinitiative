import {
  EMPTY_HOMEPAGE_CONTENT,
  normalizeHomepageContent,
} from "../data/homepageContent.js";
import { isSupabaseConfigured, supabase } from "./supabase.js";

const HOME_ID = "home";
const COLUMNS = "id, content, updated_at";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const IMAGE_MIME_PREFIX = "image/";

let missingTableWarned = false;

function requireSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
  }
}

export function migrationHint(message) {
  const text = message || "Could not save homepage content.";
  if (/homepage_content|schema cache|relation|does not exist/i.test(text)) {
    return `${text} Run supabase/migrations/007_homepage_content.sql in the Supabase SQL editor.`;
  }
  return text;
}

function normalizeRow(row) {
  if (!row) return null;
  return {
    id: row.id || HOME_ID,
    content: normalizeHomepageContent(row.content),
    updated_at: row.updated_at || null,
  };
}

function safeFileName(name) {
  return String(name || "image")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase();
}

/** Public read — returns empty content when CMS is offline or missing. */
export async function fetchHomepageContent() {
  if (!isSupabaseConfigured) {
    return { ...EMPTY_HOMEPAGE_CONTENT };
  }

  const { data, error } = await supabase
    .from("homepage_content")
    .select(COLUMNS)
    .eq("id", HOME_ID)
    .maybeSingle();

  if (error) {
    if (!missingTableWarned) {
      missingTableWarned = true;
      console.warn("[homepage] Content is unavailable.", error.message);
    }
    return { ...EMPTY_HOMEPAGE_CONTENT };
  }

  return normalizeHomepageContent(data?.content);
}

/** Admin read — throws when Supabase/table is unavailable. */
export async function fetchAdminHomepageContent() {
  requireSupabase();

  const { data, error } = await supabase
    .from("homepage_content")
    .select(COLUMNS)
    .eq("id", HOME_ID)
    .maybeSingle();

  if (error) throw new Error(migrationHint(error.message));
  if (!data) {
    return {
      id: HOME_ID,
      content: { ...EMPTY_HOMEPAGE_CONTENT },
      updated_at: null,
    };
  }
  return normalizeRow(data);
}

export async function saveHomepageContent(content) {
  requireSupabase();
  const payload = normalizeHomepageContent(content);

  const { data, error } = await supabase
    .from("homepage_content")
    .upsert({ id: HOME_ID, content: payload }, { onConflict: "id" })
    .select(COLUMNS)
    .single();

  if (error) throw new Error(migrationHint(error.message));
  return normalizeRow(data);
}

export async function uploadHomepageImage(file) {
  requireSupabase();

  if (!file || !String(file.type || "").startsWith(IMAGE_MIME_PREFIX)) {
    throw new Error("Choose an image file (JPEG, PNG, WebP, or GIF).");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 8 MB or smaller.");
  }

  const path = `hero/${Date.now()}-${safeFileName(file.name)}`;
  const { error } = await supabase.storage
    .from("homepage-images")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg",
    });

  if (error) throw new Error(migrationHint(error.message));

  const { data } = supabase.storage.from("homepage-images").getPublicUrl(path);
  return data.publicUrl;
}
