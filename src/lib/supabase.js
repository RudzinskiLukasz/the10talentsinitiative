import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim() || "";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || "";

/** Unit tests always use the static posts fallback (ignore local .env). */
export const isSupabaseConfigured =
  import.meta.env.MODE !== "test" && Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
