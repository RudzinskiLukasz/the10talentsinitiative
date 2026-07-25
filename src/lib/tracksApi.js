import { isSupabaseConfigured, supabase } from "./supabase.js";

const TRACK_COLUMNS =
  "id, title, artist, description, cover_url, audio_url, file_name, mime_type, date, status, created_at, updated_at";

const AUDIO_MIME_PREFIX = "audio/";
const COVER_MIME_PREFIX = "image/";
const MAX_AUDIO_BYTES = 80 * 1024 * 1024;
const MAX_COVER_BYTES = 8 * 1024 * 1024;

function normalizeTrack(row) {
  if (!row) return null;
  return {
    ...row,
    date: typeof row.date === "string" ? row.date.slice(0, 10) : row.date,
    artist: row.artist || "",
    description: row.description || "",
    file_name: row.file_name || "",
    mime_type: row.mime_type || "",
  };
}

function sortByDateDesc(a, b) {
  return String(b.date).localeCompare(String(a.date));
}

function requireSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }
}

function safeFileName(name) {
  return String(name || "file")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase();
}

async function uploadToTrackBucket(file, folder) {
  requireSupabase();
  const path = `${folder}/${Date.now()}-${safeFileName(file.name)}`;
  const { error } = await supabase.storage.from("track-audio").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("track-audio").getPublicUrl(path);
  return data.publicUrl;
}

/** Published tracks for T-Talents Records (empty list when CMS is offline). */
export async function fetchPublishedTracks() {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("tracks")
    .select(TRACK_COLUMNS)
    .eq("status", "published")
    .order("date", { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeTrack).sort(sortByDateDesc);
}

export async function fetchAdminTracks() {
  requireSupabase();
  const { data, error } = await supabase
    .from("tracks")
    .select(TRACK_COLUMNS)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeTrack);
}

export async function fetchAdminTrackById(id) {
  requireSupabase();
  const { data, error } = await supabase
    .from("tracks")
    .select(TRACK_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return normalizeTrack(data);
}

export async function createTrack(payload) {
  requireSupabase();
  const { data, error } = await supabase
    .from("tracks")
    .insert(payload)
    .select(TRACK_COLUMNS)
    .single();
  if (error) throw error;
  return normalizeTrack(data);
}

export async function updateTrack(id, payload) {
  requireSupabase();
  const { data, error } = await supabase
    .from("tracks")
    .update(payload)
    .eq("id", id)
    .select(TRACK_COLUMNS)
    .single();
  if (error) throw error;
  return normalizeTrack(data);
}

export async function deleteTrack(id) {
  requireSupabase();
  const { error } = await supabase.from("tracks").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadTrackAudio(file) {
  if (!file?.type?.startsWith(AUDIO_MIME_PREFIX)) {
    throw new Error("Please choose an audio file (MP3, WAV, M4A, etc.).");
  }
  if (file.size > MAX_AUDIO_BYTES) {
    throw new Error("Audio file is too large (max 80 MB).");
  }
  const url = await uploadToTrackBucket(file, "audio");
  return {
    audio_url: url,
    file_name: file.name,
    mime_type: file.type || "",
  };
}

export async function uploadTrackCover(file) {
  if (!file?.type?.startsWith(COVER_MIME_PREFIX)) {
    throw new Error("Please choose an image for the cover.");
  }
  if (file.size > MAX_COVER_BYTES) {
    throw new Error("Cover image is too large (max 8 MB).");
  }
  const url = await uploadToTrackBucket(file, "covers");
  return { cover_url: url };
}

/** Force a file download even when the audio URL is cross-origin. */
export async function downloadTrackFile(track) {
  if (!track?.audio_url) {
    throw new Error("No audio file available.");
  }
  const response = await fetch(track.audio_url);
  if (!response.ok) {
    throw new Error("Download failed. Please try again.");
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = track.file_name || `${track.title || "track"}.mp3`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}
