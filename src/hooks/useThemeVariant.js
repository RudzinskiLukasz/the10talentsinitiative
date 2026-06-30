import { useCallback, useEffect, useState } from "react";

export const STORAGE_KEY = "ttt-theme-variant";

export const THEME_VARIANTS = [
  { value: "default", label: "Ten Talents" },
  { value: "paper-glass", label: "Paper Glass" },
];

const THEME_COLORS = {
  dark: { default: "#0d0820", "paper-glass": "#1c1c1e" },
  light: { default: "#f7f3ec", "paper-glass": "#f5f5f7" },
};

function getInitialVariant() {
  if (typeof document === "undefined") return "default";
  const current = document.documentElement.getAttribute("data-theme-variant");
  return current === "paper-glass" ? "paper-glass" : "default";
}

function applyVariant(variant) {
  const root = document.documentElement;
  if (variant === "default") {
    root.removeAttribute("data-theme-variant");
  } else {
    root.setAttribute("data-theme-variant", variant);
  }

  const theme = root.getAttribute("data-theme") === "light" ? "light" : "dark";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", THEME_COLORS[theme][variant]);
  }
}

/**
 * Theme variant hook (orthogonal to light/dark).
 * - Reads the variant already applied by the no-flash inline script.
 * - Persists explicit choices to localStorage.
 */
export function useThemeVariant() {
  const [variant, setVariantState] = useState(getInitialVariant);

  useEffect(() => {
    applyVariant(variant);
  }, [variant]);

  const setVariant = useCallback((next) => {
    const value = next === "paper-glass" ? "paper-glass" : "default";
    setVariantState(value);
    try {
      if (value === "default") {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, value);
      }
    } catch (e) {
      /* ignore persistence errors */
    }
  }, []);

  return { variant, setVariant };
}
