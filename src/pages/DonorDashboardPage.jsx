import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader.jsx";

export default function DonorDashboardPage() {
  const { t } = useTranslation();
  return <PageHeader title={t("pages.donorDashboard.title")} />;
}
