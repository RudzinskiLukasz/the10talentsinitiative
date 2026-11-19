import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { buildCastHandoffUrl } from "../lib/cast.js";
import {
  fetchProfile,
  linkCastApp as apiLinkCastApp,
  updateDisplayName as apiUpdateDisplayName,
} from "../lib/profilesApi.js";
import { isSupabaseConfigured, supabase } from "../lib/supabase.js";

const AuthContext = createContext(null);

async function loadProfileSafe(userId) {
  if (!userId) return null;
  try {
    return await fetchProfile(userId);
  } catch (err) {
    console.warn("[auth] Could not load profile:", err?.message || err);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    async function applySession(nextSession) {
      const nextUser = nextSession?.user ?? null;
      const nextProfile = nextUser ? await loadProfileSafe(nextUser.id) : null;
      if (!active) return;
      setSession(nextSession ?? null);
      setProfile(nextProfile);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const nextProfile = data.user ? await loadProfileSafe(data.user.id) : null;
    setSession(data.session ?? null);
    setProfile(nextProfile);
    return { ...data, profile: nextProfile };
  }, []);

  const signUp = useCallback(async ({ email, password, displayName }) => {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    }
    const trimmedName = String(displayName || "").trim();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: trimmedName,
          apps: ["ten_talents"],
        },
      },
    });
    if (error) throw error;
    const nextProfile = data.user ? await loadProfileSafe(data.user.id) : null;
    if (data.session) {
      setSession(data.session);
      setProfile(nextProfile);
    }
    return {
      ...data,
      profile: nextProfile,
      needsEmailConfirmation: !data.session,
    };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId) {
      setProfile(null);
      return null;
    }
    const next = await loadProfileSafe(userId);
    setProfile(next);
    return next;
  }, [session?.user?.id]);

  const updateDisplayName = useCallback(
    async (displayName) => {
      const userId = session?.user?.id;
      if (!userId) throw new Error("Not signed in.");
      const next = await apiUpdateDisplayName(userId, displayName);
      setProfile(next);
      return next;
    },
    [session?.user?.id]
  );

  const openCast = useCallback(
    async ({ path = "/" } = {}) => {
      if (!session) throw new Error("Not signed in.");
      try {
        const next = await apiLinkCastApp();
        setProfile(next);
      } catch (err) {
        // Handoff still works if RPC/migration 006 is not applied yet.
        console.warn("[auth] link_cast_app skipped:", err?.message || err);
      }
      const url = buildCastHandoffUrl(session, { path });
      window.location.assign(url);
    },
    [session]
  );

  const value = useMemo(() => {
    const user = session?.user ?? null;
    const role = profile?.role ?? null;
    return {
      session,
      user,
      profile,
      loading,
      configured: isSupabaseConfigured,
      isAdmin: role === "admin",
      isMember: Boolean(user) && role !== "admin",
      signIn,
      signUp,
      signOut,
      refreshProfile,
      updateDisplayName,
      openCast,
    };
  }, [
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    updateDisplayName,
    openCast,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
