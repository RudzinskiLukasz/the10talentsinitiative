export default function Logo({ className = "" }) {
  return (
    <a
      href="#top"
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label="The Ten Talents Initiative — home"
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface-hover ring-1 ring-transparent transition group-hover:ring-accent/50">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <defs>
            <linearGradient id="logoGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f9d676" />
              <stop offset="1" stopColor="#e0972b" />
            </linearGradient>
          </defs>
          <path
            d="M12 3c.7 3.2 3.1 5.6 6.3 6.3C15.1 10 12.7 12.4 12 15.6 11.3 12.4 8.9 10 5.7 9.3 8.9 8.6 11.3 6.2 12 3Z"
            fill="url(#logoGold)"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-semibold tracking-tight text-fg">
          Ten Talents
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-soft">
          Initiative
        </span>
      </span>
    </a>
  );
}
