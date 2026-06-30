import { THEME_VARIANTS } from "../hooks/useThemeVariant.js";

export default function ThemeVariantSelect({
  variant,
  onChange,
  className = "",
  id = "theme-variant",
}) {
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Theme style
      </label>
      <select
        id={id}
        value={variant}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Theme style"
        className="h-10 cursor-pointer appearance-none rounded-xl border border-border bg-surface py-0 pl-3 pr-8 text-sm font-medium text-fg ring-1 ring-transparent transition hover:bg-surface-hover hover:ring-border-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {THEME_VARIANTS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
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
  );
}
