import {
  MAX_SITE_FILE_CHARS,
  assertSiteFilePath,
  getSiteFile,
} from "../data/siteFiles.js";
import { isSupabaseConfigured, supabase } from "./supabase.js";

export const SITE_FILES_UPDATED_EVENT = "ttt-site-files-updated";

const FILE_COLUMNS = "path, content, previous_content, updated_at";

let missingTableWarned = false;

function notifySiteFilesUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SITE_FILES_UPDATED_EVENT));
}

function requireSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
  }
}

function normalizeRow(row) {
  if (!row || !getSiteFile(row.path)) return null;
  return {
    path: row.path,
    content: row.content || "",
    previous_content: row.previous_content ?? null,
    updated_at: row.updated_at || null,
  };
}

function rowsToMap(rows) {
  const map = {};
  for (const row of rows || []) {
    const file = normalizeRow(row);
    if (file) map[file.path] = file;
  }
  return map;
}

export function migrationHint(message) {
  const text = message || "Could not save the file.";
  if (/site_files|schema cache|relation|does not exist/i.test(text)) {
    return `${text} Run supabase/migrations/004_site_files.sql in the Supabase SQL editor.`;
  }
  return text;
}

/**
 * Public read of theme files. Missing table or network errors return an empty
 * map so the live site keeps rendering.
 */
export async function fetchSiteFiles({ throwOnError = false } = {}) {
  if (!isSupabaseConfigured) return {};

  const { data, error } = await supabase.from("site_files").select(FILE_COLUMNS);
  if (error) {
    if (throwOnError) throw new Error(error.message);
    if (!missingTableWarned) {
      missingTableWarned = true;
      console.warn("[site-files] Custom code is unavailable.", error.message);
    }
    return {};
  }
  return rowsToMap(data);
}

function assertContent(content) {
  if (typeof content !== "string") {
    throw new Error("File content must be text.");
  }
  if (content.length > MAX_SITE_FILE_CHARS) {
    throw new Error(
      `This file is over the ${MAX_SITE_FILE_CHARS.toLocaleString("en-US")} character limit.`
    );
  }
}

export async function saveSiteFile(path, content) {
  assertSiteFilePath(path);
  assertContent(content);
  requireSupabase();

  const existing = await supabase
    .from("site_files")
    .select("content")
    .eq("path", path)
    .maybeSingle();
  if (existing.error) throw new Error(existing.error.message);

  const { data, error } = await supabase
    .from("site_files")
    .upsert(
      {
        path,
        content,
        previous_content: existing.data ? existing.data.content : null,
      },
      { onConflict: "path" }
    )
    .select(FILE_COLUMNS)
    .single();
  if (error) throw new Error(error.message);

  notifySiteFilesUpdated();
  return normalizeRow(data);
}

export async function revertSiteFile(path) {
  assertSiteFilePath(path);
  requireSupabase();

  const existing = await supabase
    .from("site_files")
    .select("content, previous_content")
    .eq("path", path)
    .maybeSingle();
  if (existing.error) throw new Error(existing.error.message);
  if (!existing.data || existing.data.previous_content == null) {
    throw new Error("There is no previous version to restore.");
  }

  const { data, error } = await supabase
    .from("site_files")
    .update({
      content: existing.data.previous_content,
      previous_content: existing.data.content,
    })
    .eq("path", path)
    .select(FILE_COLUMNS)
    .single();
  if (error) throw new Error(error.message);

  notifySiteFilesUpdated();
  return normalizeRow(data);
}
