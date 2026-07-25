import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim() || "";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || "";

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Unit tests always use the static posts fallback (ignore local .env). */
export const isSupabaseConfigured =
  import.meta.env.MODE !== "test" &&
  Boolean(url && anonKey && isValidHttpUrl(url));

if (
  import.meta.env.MODE !== "test" &&
  (url || anonKey) &&
  !isSupabaseConfigured
) {
  console.warn(
    "[supabase] Ignoring invalid VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. " +
      "Expected URL like https://YOUR_PROJECT.supabase.co — falling back to static posts."
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
