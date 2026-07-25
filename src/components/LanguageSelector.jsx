import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../i18n/index.js";

export default function LanguageSelector({ className = "", compact = false }) {
  const { t, i18n } = useTranslation();
  const id = useId();
  const listboxId = `${id}-listbox`;
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const options = SUPPORTED_LANGUAGES.map((lang) => ({
    ...lang,
    label: t(lang.labelKey),
  }));

  const currentCode = (i18n.language || "en").split("-")[0];
  const selectedIndex = options.findIndex((o) => o.code === currentCode);
  const selected = options[selectedIndex >= 0 ? selectedIndex : 0];

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const select = useCallback(
    (code) => {
      i18n.changeLanguage(code);
      close();
      buttonRef.current?.focus();
    },
    [i18n, close]
  );

  const openMenu = useCallback(() => {
    setOpen(true);
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [selectedIndex]);

  useEffect(() => {
    if (!open) return undefined;

    const onDocPointerDown = (e) => {
      if (!containerRef.current?.contains(e.target)) close();
    };

    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [open, close]);

  const onButtonKeyDown = (e) => {
    if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        close();
      }
      return;
    }

    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => (i + 1) % options.length);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => (i - 1 + options.length) % options.length);
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const option = options[highlightedIndex];
      if (option) select(option.code);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      buttonRef.current?.focus();
    }
  };

  const onListboxKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      buttonRef.current?.focus();
    }
  };

  const triggerClass = compact
    ? "flex h-10 w-full min-w-0 items-center gap-2 rounded-xl border border-border bg-surface py-0 pl-3 pr-2.5 text-left text-sm font-medium text-fg ring-1 ring-transparent transition hover:bg-surface-hover hover:ring-border-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    : "flex w-full min-w-0 items-center gap-2 rounded-lg border border-border bg-surface py-2 pl-3 pr-2.5 text-left text-sm text-fg-muted transition hover:border-border-strong hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col ${compact ? "gap-0" : "gap-1.5"} ${className}`}
    >
      {!compact ? (
        <label
          htmlFor={id}
          className="text-xs font-bold uppercase tracking-[0.2em] text-fg-faint"
        >
          {t("common.language")}
        </label>
      ) : null}
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-label={t("common.language")}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onButtonKeyDown}
        className={triggerClass}
      >
        <span className="min-w-0 flex-1 truncate">{selected.label}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 shrink-0 text-fg-subtle transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={t("common.language")}
          tabIndex={-1}
          onKeyDown={onListboxKeyDown}
          className="absolute left-0 right-0 top-full z-[60] mt-1 max-h-64 overflow-auto rounded-xl border border-border bg-bg py-1 shadow-lg ring-1 ring-border-subtle"
        >
          {options.map((option, index) => {
            const isSelected = currentCode === option.code;
            const isHighlighted = highlightedIndex === index;

            return (
              <li
                key={option.code}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => select(option.code)}
                className={`cursor-pointer px-3 py-2 text-sm transition ${
                  isHighlighted || isSelected
                    ? "bg-surface-hover text-fg"
                    : "text-fg-muted hover:bg-surface-hover hover:text-fg"
                }`}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
