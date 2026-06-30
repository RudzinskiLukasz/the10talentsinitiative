import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo.jsx";
import SearchBar from "./SearchBar.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import ThemeVariantSelect from "./ThemeVariantSelect.jsx";
import { useTheme } from "../hooks/useTheme.js";
import { useThemeVariant } from "../hooks/useThemeVariant.js";
import { mainNav, secondaryNav } from "../data/content.js";

function NavLink({ item, onClick, className = "", activeClassName = "", mobile = false }) {
  const { pathname } = useLocation();
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const base = mobile
    ? "rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-surface-hover hover:text-fg"
    : "rounded-full px-4 py-2 text-sm font-medium transition hover:text-fg hover:bg-surface-hover";
  const inactive = "text-fg-muted";
  const active = "bg-surface-hover text-fg ring-1 ring-border-subtle";

  return (
    <Link
      to={item.href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`${base} ${isActive ? active : inactive} ${className} ${isActive ? activeClassName : ""}`}
    >
      {item.label}
    </Link>
  );
}

function SecondaryNavLink({ item, onClick, className = "" }) {
  const { pathname } = useLocation();
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      to={item.href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] transition ${
        isActive
          ? "bg-surface-hover text-accent ring-1 ring-border-subtle"
          : "text-fg-subtle hover:bg-surface-hover hover:text-fg-muted"
      } ${className}`}
    >
      {item.label}
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { variant, setVariant } = useThemeVariant();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerSurface = scrolled
    ? "border-b border-border bg-surface-nav backdrop-blur-xl"
    : "border-b border-transparent";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${headerSurface}`}
    >
      <div className="mx-auto max-w-6xl">
        <nav
          className="flex h-16 items-center justify-between px-5 sm:px-8"
          aria-label="Main"
        >
          <Logo />

          <div className="hidden items-center gap-0.5 lg:flex">
            {mainNav.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <SearchBar className="hidden lg:block" />
            <SearchBar className="lg:hidden" compact />
            <ThemeVariantSelect
              variant={variant}
              onChange={setVariant}
              className="hidden sm:block"
            />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-fg transition hover:bg-surface-hover lg:hidden"
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

        <div
          className={`hidden border-t border-border-subtle lg:block ${
            scrolled ? "bg-surface-nav/80" : "bg-transparent"
          }`}
          aria-label="Secondary"
        >
          <div className="flex h-9 items-center gap-2 px-5 sm:px-8">
            {secondaryNav.map((item) => (
              <SecondaryNavLink key={item.href} item={item} />
            ))}
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-border-subtle bg-surface-nav backdrop-blur-xl transition-all duration-300 lg:hidden ${
          open ? "max-h-[36rem]" : "max-h-0"
        }`}
      >
        <div className="mx-auto max-w-6xl px-5 py-4">
          <div className="mb-4 px-1 lg:hidden">
            <SearchBar className="w-full" />
          </div>
          <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-fg-faint">
            Menu
          </p>
          <div className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                onClick={() => setOpen(false)}
                mobile
              />
            ))}
          </div>

          <p className="mb-2 mt-5 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-fg-faint">
            More
          </p>
          <div className="flex flex-col gap-1">
            {secondaryNav.map((item) => (
              <SecondaryNavLink
                key={item.href}
                item={item}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-left text-sm normal-case tracking-normal"
              />
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-border-subtle pt-4">
            <div className="flex items-center gap-3 px-1">
              <ThemeVariantSelect
                id="theme-variant-mobile"
                variant={variant}
                onChange={setVariant}
                className="flex-1"
              />
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
