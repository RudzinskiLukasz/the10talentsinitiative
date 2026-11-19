import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CastLaunchButton from "../components/CastLaunchButton.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

export default function CatholicSinglesForumPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <>
      <PageHeader title={t("secondaryNav.catholicSinglesForum")} />
      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <p className="text-base leading-relaxed text-fg-muted sm:text-lg">
              {t("forum.intro")}
            </p>
          </Reveal>

          <Reveal delay={80} className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
              {t("forum.castTitle")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted sm:text-base">
              {t("forum.castBody")}
            </p>
          </Reveal>

          <Reveal delay={140} className="mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold text-fg">{t("forum.ctaTitle")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">{t("forum.ctaBody")}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CastLaunchButton />
              {user ? (
                <Link
                  to="/account"
                  className="inline-flex items-center justify-center rounded-full border border-border-strong bg-bg px-6 py-3 text-sm font-semibold text-fg transition hover:bg-surface-hover"
                >
                  {t("account.goToAccount")}
                </Link>
              ) : (
                <Link
                  to="/account/register"
                  className="inline-flex items-center justify-center rounded-full border border-border-strong bg-bg px-6 py-3 text-sm font-semibold text-fg transition hover:bg-surface-hover"
                >
                  {t("account.createAccount")}
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
