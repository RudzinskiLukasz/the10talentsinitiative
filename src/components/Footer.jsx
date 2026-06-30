import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";
import { mainNav, site } from "../data/content.js";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-fg-subtle">
              Nurturing the God-given gifts of Catholic youth — for Christ and
              His Church.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-fg-faint">
              Explore
            </span>
            {mainNav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm text-fg-muted transition hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/privacy-policy"
              className="text-sm text-fg-muted transition hover:text-accent"
            >
              Privacy Policy
            </Link>
            <Link
              to="/cookie-policy-eu"
              className="text-sm text-fg-muted transition hover:text-accent"
            >
              Cookie Policy (EU)
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-fg-faint">
              Get In Touch
            </span>
            <a
              href={`mailto:${site.contactEmail}`}
              className="text-sm text-fg-muted transition hover:text-accent"
            >
              {site.contactEmail}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="text-sm text-fg-muted transition hover:text-accent"
            >
              {site.email}
            </a>
            <span className="text-sm text-fg-faint">Nigeria • Africa • Beyond</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border-subtle pt-6 text-xs text-fg-faint sm:flex-row">
          <p>© {new Date().getFullYear()} The Ten Talents Initiative. All rights reserved.</p>
          <p className="italic">"To each according to his ability." — Matthew 25:15</p>
        </div>
      </div>
    </footer>
  );
}
