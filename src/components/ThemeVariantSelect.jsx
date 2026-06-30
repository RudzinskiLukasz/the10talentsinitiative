import { useCallback, useEffect, useId, useRef, useState } from "react";
import { THEME_VARIANTS } from "../hooks/useThemeVariant.js";

export default function ThemeVariantSelect({
  variant,
  onChange,
  className = "",
  id: idProp,
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const listboxId = `${id}-listbox`;
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const selectedIndex = THEME_VARIANTS.findIndex((o) => o.value === variant);
  const selected = THEME_VARIANTS[selectedIndex >= 0 ? selectedIndex : 0];

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const select = useCallback(
    (value) => {
      onChange(value);
      close();
      buttonRef.current?.focus();
    },
    [onChange, close]
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
      setHighlightedIndex((i) => (i + 1) % THEME_VARIANTS.length);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(
        (i) => (i - 1 + THEME_VARIANTS.length) % THEME_VARIANTS.length
      );
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const option = THEME_VARIANTS[highlightedIndex];
      if (option) select(option.value);
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

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-label="Theme style"
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onButtonKeyDown}
        className="flex h-10 w-full min-w-0 items-center gap-2 rounded-xl border border-border bg-surface py-0 pl-3 pr-2.5 text-left text-sm font-medium text-fg ring-1 ring-transparent transition hover:bg-surface-hover hover:ring-border-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
          aria-label="Theme style"
          tabIndex={-1}
          onKeyDown={onListboxKeyDown}
          className="absolute left-0 right-0 top-full z-[60] mt-1 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg ring-1 ring-border-subtle"
        >
          {THEME_VARIANTS.map((option, index) => {
            const isSelected = variant === option.value;
            const isHighlighted = highlightedIndex === index;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => select(option.value)}
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
