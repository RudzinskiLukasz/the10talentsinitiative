import { afterEach, describe, expect, it, vi } from "vitest";
import { buildCastHandoffUrl, getCastAppUrl, getRedirectFromAuthHash, isCastConfigured } from "./cast.js";

describe("cast handoff", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reads CAST URL from env", () => {
    vi.stubEnv("VITE_CAST_APP_URL", "https://cast.example.com/");
    expect(getCastAppUrl()).toBe("https://cast.example.com");
    expect(isCastConfigured()).toBe(true);
  });

  it("ignores invalid CAST URL", () => {
    vi.stubEnv("VITE_CAST_APP_URL", "not-a-url");
    expect(getCastAppUrl()).toBeNull();
    expect(isCastConfigured()).toBe(false);
  });

  it("builds a hash-based SSO callback URL", () => {
    vi.stubEnv("VITE_CAST_APP_URL", "https://cast.example.com");
    const url = buildCastHandoffUrl(
      {
        access_token: "access",
        refresh_token: "refresh",
        expires_in: 90,
        token_type: "bearer",
      },
      { path: "/home" }
    );
    const parsed = new URL(url);
    expect(parsed.origin + parsed.pathname).toBe("https://cast.example.com/auth/callback");
    const hash = new URLSearchParams(parsed.hash.replace(/^#/, ""));
    expect(hash.get("access_token")).toBe("access");
    expect(hash.get("refresh_token")).toBe("refresh");
    expect(hash.get("redirect_to")).toBe("/home");
    expect(hash.get("type")).toBe("sso");
  });

  it("reads redirect_to from auth hash", () => {
    expect(getRedirectFromAuthHash("#redirect_to=%2Fprograms&type=sso")).toBe("/programs");
    expect(getRedirectFromAuthHash("")).toBe("/account");
  });
});
