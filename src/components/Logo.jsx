import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme.js";

export default function Logo({ className = "" }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Link
      to="/"
      className={`group flex items-center ${className}`}
      aria-label={`${t("site.name")} — ${t("nav.home").toLowerCase()}`}
    >
      <img
        src={theme === "dark" ? "/images/logo-white.png" : "/images/logo.png"}
        alt="The Ten Talents Initiative"
        className="h-9 w-auto object-contain"
        width={120}
        height={67}
      />
    </Link>
  );
}
