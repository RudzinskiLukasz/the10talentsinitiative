import { isValidHttpUrl } from "./supabase.js";

/**
 * CAST shares the same Supabase Auth project. We hand off the current session
 * via URL hash tokens; CAST should mount a /auth/callback route that calls
 * supabase.auth.getSession() with detectSessionInUrl: true (or setSession).
 */
export function getCastAppUrl() {
  const raw = import.meta.env.VITE_CAST_APP_URL?.trim() || "";
  if (!raw || !isValidHttpUrl(raw)) return null;
  return raw.replace(/\/+$/, "");
}

export function isCastConfigured() {
  return Boolean(getCastAppUrl());
}

export function buildCastHandoffUrl(session, { path = "/", callbackPath = "/auth/callback" } = {}) {
  const base = getCastAppUrl();
  if (!base) {
    throw new Error("CAST is not configured. Set VITE_CAST_APP_URL.");
  }
  if (!session?.access_token || !session?.refresh_token) {
    throw new Error("Not signed in.");
  }

  const callback = new URL(callbackPath, `${base}/`);
  const hash = new URLSearchParams({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: String(session.expires_in ?? 3600),
    token_type: session.token_type || "bearer",
    type: "sso",
    redirect_to: path.startsWith("/") ? path : `/${path}`,
  });
  callback.hash = hash.toString();
  return callback.toString();
}

/** Inbound: parse redirect_to from a Supabase-style auth hash (if present). */
export function getRedirectFromAuthHash(hash) {
  const raw = String(hash || "").replace(/^#/, "");
  if (!raw) return "/account";
  const params = new URLSearchParams(raw);
  const redirectTo = params.get("redirect_to") || "/account";
  return redirectTo.startsWith("/") ? redirectTo : "/account";
}
