import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CastLaunchButton from "../../components/CastLaunchButton.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import Reveal from "../../components/Reveal.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function AccountPage() {
  const { t } = useTranslation();
  const {
    user,
    profile,
    loading,
    configured,
    isAdmin,
    signOut,
    updateDisplayName,
  } = useAuth();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile?.displayName != null) {
      setName(profile.displayName);
    }
  }, [profile?.displayName]);

  if (!loading && !user) {
    return <Navigate to="/account/login" replace />;
  }

  async function handleSave(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      await updateDisplayName(name);
      setMessage(t("account.saved"));
    } catch (err) {
      setError(err.message || t("account.errors.saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    setError("");
    try {
      await signOut();
    } catch (err) {
      setError(err.message || t("account.errors.signOutFailed"));
    }
  }

  return (
    <>
      <PageHeader title={t("account.pageTitle")} />
      <section className="mx-auto max-w-2xl px-5 pb-20 sm:px-8">
        {loading ? (
          <p className="text-sm text-fg-muted">{t("account.loading")}</p>
        ) : (
          <Reveal className="space-y-8">
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <p className="text-sm text-fg-muted">{t("account.signedInAs")}</p>
              <p className="mt-1 font-medium text-fg">{user?.email}</p>
              {isAdmin && (
                <p className="mt-3 text-sm text-accent">{t("account.adminBadge")}</p>
              )}

              <form onSubmit={handleSave} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-fg">{t("account.displayName")}</span>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!configured || saving}
                    className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2"
                  />
                </label>

                {error && (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                )}
                {message && (
                  <p className="text-sm text-accent" role="status">
                    {message}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={!configured || saving}
                    className="rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-on-cta transition hover:bg-cta-hover disabled:opacity-50"
                  >
                    {saving ? t("account.saving") : t("account.save")}
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-full border border-border-strong bg-surface px-5 py-2.5 text-sm font-semibold text-fg transition hover:bg-surface-hover"
                  >
                    {t("account.signOut")}
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-fg">
                {t("account.sharedTitle")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {t("account.sharedBody")}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-fg-muted">
                {(Array.isArray(profile?.apps) ? profile.apps : ["ten_talents"]).map((app) => (
                  <li key={app} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {t(`account.apps.${app}`, { defaultValue: app })}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <CastLaunchButton />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/catholic-singles-forum"
                  className="inline-flex rounded-full border border-border-strong bg-bg px-5 py-2.5 text-sm font-semibold text-fg transition hover:bg-surface-hover"
                >
                  {t("secondaryNav.catholicSinglesForum")}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex rounded-full bg-accent/15 px-5 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/25"
                  >
                    {t("account.openAdmin")}
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        )}
      </section>
    </>
  );
}
