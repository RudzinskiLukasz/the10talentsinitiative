import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";

export default function EventsPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={t("eventsPage.title")}
        description={t("eventsPage.intro")}
      />
      <section className="mx-auto max-w-4xl px-5 pb-20 sm:px-8">
        <Reveal className="rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-fg-subtle">
            {t("eventsPage.weekLabel")}
          </p>
          <p className="mt-4 text-fg-muted">{t("eventsPage.emptyMessage")}</p>
        </Reveal>
      </section>
    </>
  );
}
