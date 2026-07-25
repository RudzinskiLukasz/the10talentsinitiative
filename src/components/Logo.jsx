import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const imgClass =
  "h-auto w-[min(309px,55vw)] object-contain object-left sm:w-[309px]";

/**
 * Theme-aware logo. Uses CSS `dark:` visibility tied to `data-theme`
 * on <html>. Both assets are transparent PNGs (no baked-in page color).
 */
export default function Logo({ className = "" }) {
  const { t } = useTranslation();

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
