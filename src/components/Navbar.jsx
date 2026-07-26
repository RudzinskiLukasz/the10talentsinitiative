import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "./Logo.jsx";
import SearchBar from "./SearchBar.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import LanguageSelector from "./LanguageSelector.jsx";
import { useTheme } from "../hooks/useTheme.js";
import { useMainNav, useSecondaryNav } from "../i18n/nav.js";

function NavLink({ item, onClick, className = "", activeClassName = "", mobile = false }) {
  const { pathname } = useLocation();
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const base = mobile
    ? "rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-surface-hover hover:text-fg"
    : "shrink-0 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-medium transition hover:bg-surface-hover hover:text-fg xl:px-3.5 xl:py-2 xl:text-sm";
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

export default function Navbar() {
  const { t } = useTranslation();
  const mainNav = useMainNav();
  const secondaryNav = useSecondaryNav();
  const headerRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${header.offsetHeight}px`
      );
    };

    syncHeaderHeight();

    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(header);

    return () => observer.disconnect();
  }, [open]);

  const headerSurface = scrolled
    ? "border-b border-border bg-surface-nav backdrop-blur-xl"
    : "border-b border-transparent";

  const secondaryBand = scrolled
    ? "border-border-subtle/80 bg-surface-nav/60"
    : "border-border-subtle/60 bg-surface-nav/30";

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 overflow-visible transition-all duration-300 ${headerSurface}`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex min-h-12 flex-nowrap items-center gap-2 px-5 sm:min-h-14 sm:gap-3 sm:px-8">
          <Logo className="shrink-0" />

          <nav
            className="hidden min-w-0 flex-1 lg:block"
            aria-label="Main"
          >
            <div className="flex flex-nowrap items-center gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] xl:gap-1 [&::-webkit-scrollbar]:hidden">
              {mainNav.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </nav>

          <div className="ml-auto flex shrink-0 flex-nowrap items-center gap-1.5 sm:gap-2">
            <SearchBar className="lg:hidden" compact />
            <LanguageSelector
              compact
              className="hidden w-36 lg:block xl:w-44"
            />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={t("common.toggleMenu")}
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
        </div>

        <nav
          className={`hidden border-t lg:block ${secondaryBand}`}
          aria-label="Secondary"
        >
          <div className="flex min-h-8 items-center gap-2 px-5 sm:px-8 xl:min-h-9">
            <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] xl:gap-1 [&::-webkit-scrollbar]:hidden">
              {secondaryNav.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
            <SearchBar className="hidden shrink-0 lg:block" align="end" />
          </div>
        </nav>
      </div>

      <div
        className={`border-t border-border-subtle bg-surface-nav backdrop-blur-xl transition-[max-height] duration-300 lg:hidden ${
          open
            ? "max-h-[min(36rem,calc(100dvh-3.5rem))] overflow-y-auto overscroll-contain"
            : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="mx-auto max-w-6xl px-5 py-4">
          <div className="mb-4 px-1 lg:hidden">
            <SearchBar className="w-full" />
          </div>
          <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-fg-faint">
            {t("common.menu")}
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
            {t("common.more")}
          </p>
          <div className="flex flex-col gap-1">
            {secondaryNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                onClick={() => setOpen(false)}
                mobile
              />
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-border-subtle pt-4">
            <div className="flex items-center gap-3 px-1">
              <LanguageSelector compact className="flex-1" />
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
