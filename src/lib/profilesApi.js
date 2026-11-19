import { isSupabaseConfigured, supabase } from "./supabase.js";

export function normalizeProfile(row) {
  if (!row) return null;
  return {
    id: row.id,
    displayName: row.display_name ?? "",
    role: row.role === "admin" ? "admin" : "member",
    apps: Array.isArray(row.apps) && row.apps.length > 0 ? row.apps : ["ten_talents"],
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

export async function fetchProfile(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, role, apps, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return normalizeProfile(data);
}

export async function updateDisplayName(userId, displayName) {
  if (!isSupabaseConfigured || !userId) {
    throw new Error("Supabase is not configured.");
  }
  const trimmed = String(displayName || "").trim();
  if (!trimmed) {
    throw new Error("Display name is required.");
  }
  const { data, error } = await supabase
    .from("profiles")
    .update({ display_name: trimmed })
    .eq("id", userId)
    .select("id, display_name, role, apps, created_at, updated_at")
    .single();
  if (error) throw error;
  return normalizeProfile(data);
}

/** Marks this identity as linked to CAST (append-only via RPC). */
export async function linkCastApp() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }
  const { data, error } = await supabase.rpc("link_cast_app");
  if (error) throw error;
  return normalizeProfile(data);
}
