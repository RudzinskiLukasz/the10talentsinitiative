import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HeroPhotoBackground from "../../components/HeroPhotoBackground.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";

const MIN_PASSWORD = 8;

export default function AccountRegisterPage() {
  const { t } = useTranslation();
  const { user, loading, configured, signUp } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/account" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setInfo("");

    if (password.length < MIN_PASSWORD) {
      setError(t("account.errors.passwordTooShort", { min: MIN_PASSWORD }));
      return;
    }
    if (password !== confirm) {
      setError(t("account.errors.passwordMismatch"));
      return;
    }

    setSubmitting(true);
    try {
      const result = await signUp({
        email: email.trim(),
        password,
        displayName: displayName.trim(),
      });
      if (result.needsEmailConfirmation) {
        setInfo(t("account.checkEmail"));
        return;
      }
      navigate("/account", { replace: true });
    } catch (err) {
      setError(err.message || t("account.errors.signUpFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative grid min-h-[min(88vh,52rem)] place-items-center overflow-hidden px-5 py-16 sm:px-8">
      <HeroPhotoBackground showDots={false} showFade={false} />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface/95 p-6 shadow-sm backdrop-blur-md sm:p-8">
        <h1 className="font-display text-2xl font-semibold text-fg">
          {t("account.registerTitle")}
        </h1>
        <p className="mt-2 text-sm text-fg-muted">{t("account.registerBody")}</p>

        {!configured && (
          <p className="mt-4 rounded-xl border border-border-subtle bg-bg/60 p-3 text-sm text-fg-muted">
            {t("account.notConfigured")}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-fg">{t("account.displayName")}</span>
            <input
              required
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={!configured || submitting}
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2"
            />
          </label>
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
              autoComplete="new-password"
              minLength={MIN_PASSWORD}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!configured || submitting}
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-fg">{t("account.confirmPassword")}</span>
            <input
              required
              type="password"
              autoComplete="new-password"
              minLength={MIN_PASSWORD}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={!configured || submitting}
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2"
            />
          </label>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-xl border border-accent/30 bg-accent/10 p-3 text-sm text-fg" role="status">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={!configured || submitting}
            className="w-full rounded-full bg-cta px-5 py-3 text-sm font-semibold text-on-cta transition hover:bg-cta-hover disabled:opacity-50"
          >
            {submitting ? t("account.creatingAccount") : t("account.createAccount")}
          </button>
        </form>

        <p className="mt-6 text-sm text-fg-muted">
          {t("account.haveAccount")}{" "}
          <Link to="/account/login" className="font-semibold text-primary-soft hover:text-accent">
            {t("account.signIn")}
          </Link>
        </p>
      </div>
    </section>
  );
}
