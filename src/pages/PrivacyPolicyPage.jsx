import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader.jsx";
import ProseContent from "../components/ProseContent.jsx";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t("pages.privacyPolicy.title")} />
      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <ProseContent content={t("policies.privacy").split("\n")} />
      </section>
    </>
  );
}
