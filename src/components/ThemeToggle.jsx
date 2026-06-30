import { useTranslation } from "react-i18next";

export default function ThemeToggle({ theme, onToggle, className = "" }) {
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const label = isDark ? t("common.switchToLight") : t("common.switchToDark");

  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={!isDark}
      aria-label={label}
      title={label}
      className={`group relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-border bg-surface text-fg ring-1 ring-transparent transition hover:bg-surface-hover hover:ring-border-strong ${className}`}
    >
      <span className="relative block h-5 w-5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 h-5 w-5 text-accent transition-all duration-500 ${
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
          style={{ transitionTimingFunction: "var(--ease-spring)" }}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 h-5 w-5 text-primary-soft transition-all duration-500 ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
          style={{ transitionTimingFunction: "var(--ease-spring)" }}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      </span>
    </button>
  );
}
