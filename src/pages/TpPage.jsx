import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";

export default function TpPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t("pages.tp.title")} />
      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <Reveal className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm leading-relaxed text-fg-muted">
            {t("common.contentComingSoon")}
          </p>
        </Reveal>
      </section>
    </>
  );
}
