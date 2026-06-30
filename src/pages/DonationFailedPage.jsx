import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader.jsx";

export default function DonationFailedPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={t("donationFailedPage.title")}
        description={t("donationFailedPage.body")}
      />
      <section className="mx-auto max-w-3xl px-5 pb-20 text-center sm:px-8">
        <Link
          to="/donations"
          className="inline-flex rounded-full bg-cta px-7 py-3 text-sm font-bold text-on-cta transition hover:bg-cta-hover"
        >
          {t("common.tryAgain")}
        </Link>
      </section>
    </>
  );
}
