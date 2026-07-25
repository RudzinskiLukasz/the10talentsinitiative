import { describe, expect, it } from "vitest";
import { isSupabaseConfigured, isValidHttpUrl } from "./supabase.js";

describe("supabase config helpers", () => {
  it("accepts only http(s) URLs", () => {
    expect(isValidHttpUrl("https://uesdvhkhcmrwdorcbkbf.supabase.co")).toBe(true);
    expect(isValidHttpUrl("http://localhost:54321")).toBe(true);
    expect(isValidHttpUrl("uesdvhkhcmrwdorcbkbf")).toBe(false);
    expect(isValidHttpUrl("uesdvhkhcmrwdorcbkbf.supabase.co")).toBe(false);
    expect(isValidHttpUrl("")).toBe(false);
  });

  it("disables Supabase during unit tests", () => {
    expect(isSupabaseConfigured).toBe(false);
  });
});
