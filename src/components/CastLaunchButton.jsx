import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth.jsx";
import { isCastConfigured } from "../lib/cast.js";

export default function CastLaunchButton({ className = "", path = "/" }) {
  const { t } = useTranslation();
  const { user, openCast } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ready = isCastConfigured();

  if (!ready) {
    return (
      <p className="text-sm text-fg-subtle" role="status">
        {t("account.castComingSoon")}
      </p>
    );
  }

  if (!user) {
    return (
      <Link
        to="/account/login"
        state={{ from: { pathname: "/account" } }}
        className={
          className ||
          "inline-flex items-center justify-center rounded-full bg-cta px-6 py-3 text-sm font-bold text-on-cta transition hover:bg-cta-hover"
        }
      >
        {t("account.signInForCast")}
      </Link>
    );
  }

  async function handleClick() {
    setError("");
    setBusy(true);
    try {
      await openCast({ path });
    } catch (err) {
      setError(err.message || t("account.errors.castFailed"));
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className={
          className ||
          "inline-flex items-center justify-center rounded-full bg-cta px-6 py-3 text-sm font-bold text-on-cta transition hover:bg-cta-hover disabled:opacity-50"
        }
      >
        {busy ? t("account.openingCast") : t("account.openCast")}
      </button>
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
