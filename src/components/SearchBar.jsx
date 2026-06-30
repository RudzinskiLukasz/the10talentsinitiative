import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchContent } from "../data/searchIndex.js";

const DEBOUNCE_MS = 200;

function SearchIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

function navigateToResult(result, navigate) {
  const hashIdx = result.path.indexOf("#");
  const pathname = hashIdx >= 0 ? result.path.slice(0, hashIdx) || "/" : result.path;
  const hash = hashIdx >= 0 ? result.path.slice(hashIdx + 1) : null;

  navigate(hash ? `${pathname}#${hash}` : pathname);

  if (hash) {
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

export default function SearchBar({ className = "", compact = false }) {
  const navigate = useNavigate();
  const listboxId = useId();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(!compact);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [pending, setPending] = useState(false);

  const showPanel = open && expanded && query.trim().length > 0;

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(-1);
      setPending(false);
      return;
    }

    setPending(true);
    const timer = window.setTimeout(() => {
      const next = searchContent(query);
      setResults(next);
      setActiveIndex(next.length ? 0 : -1);
      setPending(false);
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
        if (compact) setExpanded(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [compact]);

  const selectResult = useCallback(
    (result) => {
      if (!result) return;
      navigateToResult(result, navigate);
      setQuery("");
      setResults([]);
      setOpen(false);
      setActiveIndex(-1);
      if (compact) setExpanded(false);
      inputRef.current?.blur();
    },
    [compact, navigate]
  );

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
      if (compact) {
        setExpanded(false);
        inputRef.current?.blur();
      }
      return;
    }

    if (!showPanel) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : -1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) =>
        results.length ? (i <= 0 ? results.length - 1 : i - 1) : -1
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        selectResult(results[activeIndex]);
      }
    }
  };

  const toggleCompact = () => {
    setExpanded((v) => {
      const next = !v;
      if (next) {
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
      return next;
    });
  };

  if (compact && !expanded) {
    return (
      <div ref={containerRef} className={className}>
        <button
          type="button"
          onClick={toggleCompact}
          aria-label="Open search"
          className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-fg-muted transition hover:bg-surface-hover hover:text-fg"
        >
          <SearchIcon />
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`flex items-center gap-2 rounded-xl border border-border bg-surface px-3 transition focus-within:ring-1 focus-within:ring-border-strong ${
          compact ? "w-full" : "h-9 w-36 xl:w-52"
        }`}
      >
        <SearchIcon className="h-3.5 w-3.5 shrink-0 text-fg-faint" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-label="Search site content"
          aria-expanded={showPanel}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          placeholder="Search…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-fg placeholder:text-fg-faint focus:outline-none"
          autoComplete="off"
        />
        {compact && (
          <button
            type="button"
            onClick={() => {
              setExpanded(false);
              setOpen(false);
              setQuery("");
            }}
            aria-label="Close search"
            className="text-fg-faint transition hover:text-fg"
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>

      {showPanel && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className={`absolute z-[60] mt-1.5 overflow-hidden rounded-xl border border-border bg-surface-nav shadow-lg backdrop-blur-xl ${
            compact ? "inset-x-0" : "left-0 w-64 xl:w-80"
          }`}
        >
          {pending ? (
            <p className="px-3 py-3 text-sm text-fg-subtle" role="status">
              Searching…
            </p>
          ) : results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-fg-subtle" role="status">
              No results found
            </p>
          ) : (
            <ul className="max-h-72 overflow-y-auto py-1">
              {results.map((result, index) => (
                <li key={`${result.path}-${result.title}`} role="presentation">
                  <button
                    id={`${listboxId}-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectResult(result)}
                    className={`w-full px-3 py-2.5 text-left transition ${
                      index === activeIndex ? "bg-surface-hover" : "hover:bg-surface-hover"
                    }`}
                  >
                    <span className="block truncate text-sm font-medium text-fg">
                      {result.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-fg-subtle">
                      {result.comingSoon
                        ? "Coming soon"
                        : [result.category, result.section, result.excerpt]
                            .filter(Boolean)
                            .join(" · ")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
