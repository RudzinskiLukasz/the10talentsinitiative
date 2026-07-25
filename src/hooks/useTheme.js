import { useCallback, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "ttt-theme";
const THEME_COLORS = {
  dark: { default: "#0d0820", "paper-glass": "#1c1c1e", ona: "#1a0f1a" },
  light: { default: "#f7f3ec", "paper-glass": "#f5f5f7", ona: "#faf6f0" },
};

function getThemeColor(theme) {
  const variantAttr = document.documentElement.getAttribute("data-theme-variant");
  const variant =
    variantAttr && THEME_COLORS[theme][variantAttr]
      ? variantAttr
      : "default";
  return THEME_COLORS[theme][variant];
}

function readDocumentTheme() {
  if (typeof document === "undefined") return "dark";
  // The inline script in index.html has already resolved + applied the theme.
  const current = document.documentElement.getAttribute("data-theme");
  return current === "light" ? "light" : "dark";
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", getThemeColor(theme));
}

/** Shared store so every useTheme() call stays in sync. */
let theme = typeof document !== "undefined" ? readDocumentTheme() : "dark";
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return theme;
}

function getServerSnapshot() {
  return "dark";
}

function setTheme(next) {
  theme = next;
  applyTheme(theme);
  listeners.forEach((listener) => listener());
}

/**
 * Theme state hook.
 * - Reads the theme already applied by the no-flash inline script.
 * - Persists explicit choices to localStorage.
 * - Keeps in sync with the OS preference until the user makes a choice.
 * - Shares state across all hook consumers.
 */
export function useTheme() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    // Re-sync from the document once after mount (covers SSR / late script).
    const fromDoc = readDocumentTheme();
    if (fromDoc !== theme) setTheme(fromDoc);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (e) => {
      // Only follow the system if the user hasn't made an explicit choice.
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? "light" : "dark");
      }
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      /* ignore persistence errors (e.g. private mode) */
    }
    setTheme(next);
  }, []);

  return { theme: current, toggleTheme };
}
