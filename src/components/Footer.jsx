import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "./Logo.jsx";
import { useMainNav } from "../i18n/nav.js";
import { site } from "../data/site.js";
import ThemeVariantSelect from "./ThemeVariantSelect.jsx";
import { useThemeVariant } from "../hooks/useThemeVariant.js";

export default function Footer() {
  const { t } = useTranslation();
  const mainNav = useMainNav();
  const { variant, setVariant } = useThemeVariant();

  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-fg-subtle">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-fg-faint">
              {t("footer.explore")}
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
              {t("footer.privacyPolicy")}
            </Link>
            <Link
              to="/cookie-policy-eu"
              className="text-sm text-fg-muted transition hover:text-accent"
            >
              {t("footer.cookiePolicy")}
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-fg-faint">
              {t("footer.getInTouch")}
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
            <span className="text-sm text-fg-faint">{t("footer.region")}</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-border-subtle pt-6 sm:flex-row">
          <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:items-end">
            <div className="flex w-full flex-col gap-1.5 sm:w-44">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-fg-faint">
                {t("common.themeStyle")}
              </span>
              <ThemeVariantSelect
                variant={variant}
                onChange={setVariant}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 text-center text-xs text-fg-faint sm:items-end sm:text-right">
            <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
            <p className="italic">{t("footer.quote")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
