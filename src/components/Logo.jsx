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
        src="/images/logo.png"
        alt="The Ten Talents Initiative"
        className={`h-9 w-auto object-contain object-left ${
          isDark ? "invert mix-blend-screen" : "mix-blend-multiply"
        }`}
        width={120}
        height={67}
      />
    </Link>
  );
}
