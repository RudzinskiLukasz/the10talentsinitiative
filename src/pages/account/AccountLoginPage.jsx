import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HeroPhotoBackground from "../../components/HeroPhotoBackground.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function AccountLoginPage() {
  const { t } = useTranslation();
  const { user, loading, configured, signIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/account";

  if (!loading && user) {
    return <Navigate to={isAdmin && from.startsWith("/admin") ? from : "/account"} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await signIn(email.trim(), password);
      const admin = result.profile?.role === "admin";
      navigate(admin && from.startsWith("/admin") ? from : "/account", { replace: true });
    } catch (err) {
      setError(err.message || t("account.errors.signInFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative grid min-h-[min(88vh,52rem)] place-items-center overflow-hidden px-5 py-16 sm:px-8">
      <HeroPhotoBackground showDots={false} showFade={false} />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface/95 p-6 shadow-sm backdrop-blur-md sm:p-8">
        <h1 className="font-display text-2xl font-semibold text-fg">{t("account.loginTitle")}</h1>
        <p className="mt-2 text-sm text-fg-muted">{t("account.loginBody")}</p>

        {!configured && (
          <p className="mt-4 rounded-xl border border-border-subtle bg-bg/60 p-3 text-sm text-fg-muted">
            {t("account.notConfigured")}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-fg">{t("common.emailLabel")}</span>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!configured || submitting}
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-fg">{t("account.password")}</span>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!configured || submitting}
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2"
            />
          </label>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!configured || submitting}
            className="w-full rounded-full bg-cta px-5 py-3 text-sm font-semibold text-on-cta transition hover:bg-cta-hover disabled:opacity-50"
          >
            {submitting ? t("account.signingIn") : t("account.signIn")}
          </button>
        </form>

        <p className="mt-6 text-sm text-fg-muted">
          {t("account.noAccount")}{" "}
          <Link to="/account/register" className="font-semibold text-primary-soft hover:text-accent">
            {t("account.createOne")}
          </Link>
        </p>
      </div>
    </section>
  );
}
