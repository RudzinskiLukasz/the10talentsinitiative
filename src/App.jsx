import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProgramsPage from "./pages/ProgramsPage.jsx";
import DailyReflectionsPage from "./pages/DailyReflectionsPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import SongsBooksPage from "./pages/SongsBooksPage.jsx";
import TpPage from "./pages/TpPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import DonationsPage from "./pages/DonationsPage.jsx";
import UpcomingProgramsPage from "./pages/UpcomingProgramsPage.jsx";
import BlogPostPage from "./pages/BlogPostPage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import CookiePolicyPage from "./pages/CookiePolicyPage.jsx";
import DonorDashboardPage from "./pages/DonorDashboardPage.jsx";
import DonationFailedPage from "./pages/DonationFailedPage.jsx";
import DonationConfirmationPage from "./pages/DonationConfirmationPage.jsx";
import { posts } from "./data/posts.js";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="daily-reflections" element={<DailyReflectionsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="songs-books" element={<SongsBooksPage />} />
        <Route path="tp" element={<TpPage />} />
        <Route path="contact" element={<ContactPage />} />
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
