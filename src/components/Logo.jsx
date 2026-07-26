import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const sizeClass = {
  // Navbar: fixed height so transparent PNG padding does not inflate the bar
  compact:
    "h-12 w-auto max-w-[min(11rem,42vw)] object-contain object-left sm:h-14",
  // Footer / standalone: full brand mark
  default:
    "h-12 w-auto max-w-[min(11rem,42vw)] object-contain object-left lg:h-auto lg:max-w-none lg:w-[309px]",
};

/**
 * Theme-aware logo. Uses CSS `dark:` visibility tied to `data-theme`
 * on <html>. Both assets are transparent PNGs (no baked-in page color).
 */
export default function Logo({ className = "", size = "default" }) {
  const { t } = useTranslation();
  const imgClass = sizeClass[size] ?? sizeClass.default;

  return (
    <Link
      to="/"
      className={`group flex items-center ${className}`}
      aria-label={`${t("site.name")} — ${t("nav.home").toLowerCase()}`}
    >
      {/* Light mode: dark mark on transparent bg */}
      <img
        src="/images/logo-on-light.png"
        alt="The Ten Talents Initiative"
        className={`${imgClass} block dark:hidden`}
        width={309}
        height={173}
      />
      {/* Dark mode: light mark on transparent bg */}
      <img
        src="/images/logo-on-dark.png"
        alt=""
        aria-hidden="true"
        className={`${imgClass} hidden dark:block`}
        width={309}
        height={173}
      />
    </Link>
  );
}
