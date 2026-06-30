import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "./layouts/Layout.jsx";
import PlaceholderPage from "./components/PlaceholderPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProgramsPage from "./pages/ProgramsPage.jsx";
import DailyReflectionsPage from "./pages/DailyReflectionsPage.jsx";
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
import { posts } from "./data/posts.js";

function PlaceholderRoute({ titleKey }) {
  const { t } = useTranslation();
  return <PlaceholderPage title={t(titleKey)} />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="daily-reflections" element={<DailyReflectionsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="songs-books" element={<SongsBooksPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route
          path="t-talents-records"
          element={<PlaceholderRoute titleKey="secondaryNav.tTalentsRecords" />}
        />
        <Route
          path="t-talents-studios"
          element={<PlaceholderRoute titleKey="secondaryNav.tTalentsStudios" />}
        />
        <Route
          path="t-talents-series"
          element={<PlaceholderRoute titleKey="secondaryNav.tTalentsSeries" />}
        />
        <Route
          path="t-talents-sports"
          element={<PlaceholderRoute titleKey="secondaryNav.tTalentsSports" />}
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
        {posts.map((post) => (
          <Route key={post.slug} path={post.slug} element={<BlogPostPage />} />
        ))}
      </Route>
    </Routes>
  );
}
