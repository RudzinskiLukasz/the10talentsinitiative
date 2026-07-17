import { useId } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../i18n/index.js";

export default function LanguageSelector({ className = "", compact = false }) {
  const { t, i18n } = useTranslation();
  const id = useId();

  return (
    <div className={`flex flex-col ${compact ? "gap-0" : "gap-1.5"} ${className}`}>
      {!compact ? (
        <label
          htmlFor={id}
          className="text-xs font-bold uppercase tracking-[0.2em] text-fg-faint"
        >
          {t("common.language")}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={id}
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          aria-label={t("common.language")}
          className={
            compact
              ? "h-10 w-full appearance-none rounded-xl border border-border bg-surface py-0 pl-3 pr-8 text-sm font-medium text-fg ring-1 ring-transparent transition hover:bg-surface-hover hover:ring-border-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              : "w-full appearance-none rounded-lg border border-border bg-surface py-2 pl-3 pr-8 text-sm text-fg-muted transition hover:border-border-strong hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          }
        >
          {SUPPORTED_LANGUAGES.map(({ code, labelKey }) => (
            <option key={code} value={code}>
              {t(labelKey)}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
