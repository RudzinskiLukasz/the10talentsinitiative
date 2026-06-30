import { useCallback, useEffect, useState } from "react";

export const STORAGE_KEY = "ttt-theme-variant";

export const THEME_VARIANTS = [
  { value: "default", label: "Extendable theme" },
  { value: "paper-glass", label: "Paper glass theme" },
  { value: "ona", label: "Ona theme" },
];

const VALID_VARIANTS = new Set(
  THEME_VARIANTS.map((v) => v.value).filter((v) => v !== "default")
);

const THEME_COLORS = {
  dark: { default: "#0d0820", "paper-glass": "#1c1c1e", ona: "#1a0f1a" },
  light: { default: "#f7f3ec", "paper-glass": "#f5f5f7", ona: "#faf6f0" },
};

function getInitialVariant() {
  if (typeof document === "undefined") return "default";
  const current = document.documentElement.getAttribute("data-theme-variant");
  return VALID_VARIANTS.has(current) ? current : "default";
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
    const value = VALID_VARIANTS.has(next) ? next : "default";
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
