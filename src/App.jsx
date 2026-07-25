import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "./layouts/Layout.jsx";
import PlaceholderPage from "./components/PlaceholderPage.jsx";
import AdminRoute from "./components/admin/AdminRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProgramsPage from "./pages/ProgramsPage.jsx";
import DailyReflectionsPage from "./pages/DailyReflectionsPage.jsx";
import CategoryPostsPage from "./pages/CategoryPostsPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import SongsBooksPage from "./pages/SongsBooksPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import UpcomingProgramsPage from "./pages/UpcomingProgramsPage.jsx";
import BlogPostPage from "./pages/BlogPostPage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import CookiePolicyPage from "./pages/CookiePolicyPage.jsx";
import DonorDashboardPage from "./pages/DonorDashboardPage.jsx";
import DonationFailedPage from "./pages/DonationFailedPage.jsx";
import DonationConfirmationPage from "./pages/DonationConfirmationPage.jsx";
import DonationsPage from "./pages/DonationsPage.jsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminPostsPage from "./pages/admin/AdminPostsPage.jsx";
import AdminPostEditorPage from "./pages/admin/AdminPostEditorPage.jsx";
import AdminTracksPage from "./pages/admin/AdminTracksPage.jsx";
import AdminTrackEditorPage from "./pages/admin/AdminTrackEditorPage.jsx";
import TTalentsRecordsPage from "./pages/TTalentsRecordsPage.jsx";

function PlaceholderRoute({ titleKey }) {
  const { t } = useTranslation();
  return <PlaceholderPage title={t(titleKey)} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminPostsPage />} />
          <Route path="posts/new" element={<AdminPostEditorPage />} />
          <Route path="posts/:id" element={<AdminPostEditorPage />} />
          <Route path="tracks" element={<AdminTracksPage />} />
          <Route path="tracks/new" element={<AdminTrackEditorPage />} />
          <Route path="tracks/:id" element={<AdminTrackEditorPage />} />
        </Route>
      </Route>

      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="daily-reflections" element={<DailyReflectionsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="songs-books" element={<SongsBooksPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="t-talents-records" element={<TTalentsRecordsPage />} />
        <Route
          path="t-talents-studios"
          element={<CategoryPostsPage categoryId="t-talents-studios" />}
        />
        <Route
          path="t-talents-series"
          element={<CategoryPostsPage categoryId="t-talents-series" />}
        />
        <Route
          path="t-talents-sports"
          element={<CategoryPostsPage categoryId="t-talents-sports" />}
        />
        <Route
          path="catholic-singles-forum"
          element={<PlaceholderRoute titleKey="secondaryNav.catholicSinglesForum" />}
        />
        <Route path="donations" element={<DonationsPage />} />
        <Route path="upcoming-programs" element={<UpcomingProgramsPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="cookie-policy-eu" element={<CookiePolicyPage />} />
        <Route path="donor-dashboard" element={<DonorDashboardPage />} />
        <Route path="donation-failed" element={<DonationFailedPage />} />
        <Route path="donation-confirmation" element={<DonationConfirmationPage />} />
        <Route path=":slug" element={<BlogPostPage />} />
      </Route>
    </Routes>
  );
}
