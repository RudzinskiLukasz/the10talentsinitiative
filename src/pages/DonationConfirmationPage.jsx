import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader.jsx";

export default function DonationConfirmationPage() {
  const { t } = useTranslation();
  return <PageHeader title={t("pages.donationConfirmation.title")} />;
}
