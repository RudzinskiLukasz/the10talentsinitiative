import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme.js";

export default function Logo({ className = "" }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Link
      to="/"
      className={`group flex items-center ${className}`}
      aria-label={`${t("site.name")} — ${t("nav.home").toLowerCase()}`}
    >
      <img
        src={isDark ? "/images/logo-on-dark.png" : "/images/logo.png"}
        alt="The Ten Talents Initiative"
        className="h-auto w-[min(309px,55vw)] object-contain object-left sm:w-[309px]"
        width={309}
        height={173}
      />
    </Link>
  );
}
