import { useCallback, useEffect, useState } from "react";

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

function getInitialTheme() {
  if (typeof document === "undefined") return "dark";
  // The inline script in index.html has already resolved + applied the theme.
  const current = document.documentElement.getAttribute("data-theme");
  return current === "light" ? "light" : "dark";
}

/**
 * Theme state hook.
 * - Reads the theme already applied by the no-flash inline script.
 * - Persists explicit choices to localStorage.
 * - Keeps in sync with the OS preference until the user makes a choice.
 */
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", getThemeColor(theme));
  }, [theme]);

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
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* ignore persistence errors (e.g. private mode) */
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
