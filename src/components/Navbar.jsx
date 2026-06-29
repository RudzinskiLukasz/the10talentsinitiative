import { useEffect, useState } from "react";
import Logo from "./Logo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { useTheme } from "../hooks/useTheme.js";
import { nav } from "../data/content.js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-surface-nav backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-fg-muted transition hover:text-fg hover:bg-surface-hover"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />

          <a
            href="#join"
            className="hidden rounded-full bg-cta px-5 py-2.5 text-sm font-bold text-on-cta shadow-lg shadow-cta/25 transition hover:bg-cta-hover hover:shadow-cta/40 sm:inline-flex"
          >
            Get Involved
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-fg transition hover:bg-surface-hover md:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-fg transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-fg transition-all duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-fg transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-border-subtle bg-surface-nav backdrop-blur-xl transition-all duration-300 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-fg-muted transition hover:bg-surface-hover hover:text-fg"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-2 flex items-center gap-3">
            <a
              href="#join"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl bg-cta px-4 py-3 text-center text-sm font-bold text-on-cta"
            >
              Get Involved
            </a>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>
      </div>
    </header>
  );
}
