import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout.jsx";
import PlaceholderPage from "./components/PlaceholderPage.jsx";
import HomePage from "./pages/HomePage.jsx";
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
        <Route path="programs" element={<PlaceholderPage title="Programs" />} />
        <Route
          path="daily-reflections"
          element={<PlaceholderPage title="Daily Reflections" />}
        />
        <Route path="events" element={<PlaceholderPage title="Events" />} />
        <Route
          path="songs-books"
          element={<PlaceholderPage title="Songs & Books" />}
        />
        <Route path="contact" element={<PlaceholderPage title="Contact Us" />} />
        <Route
          path="t-talents-records"
          element={<PlaceholderPage title="T-Talents Records" />}
        />
        <Route
          path="t-talents-studios"
          element={<PlaceholderPage title="T-Talents Studios" />}
        />
        <Route
          path="t-talents-series"
          element={<PlaceholderPage title="T-Talents Series" />}
        />
        <Route
          path="t-talents-sports"
          element={<PlaceholderPage title="T-Talents Sports" />}
        />
        <Route
          path="catholic-singles-forum"
          element={<PlaceholderPage title="Catholic Singles Forum" />}
        />
        <Route path="donations" element={<PlaceholderPage title="Donations" />} />
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
