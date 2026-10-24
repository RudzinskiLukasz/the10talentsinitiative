import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";
import InstallPrompt from "../components/InstallPrompt.jsx";
import { SiteCodeProvider, SiteCodeSlot } from "../components/SiteCode.jsx";

export default function Layout() {
  return (
    <SiteCodeProvider>
      <div className="relative min-h-screen overflow-x-hidden">
        <ScrollToTop />
        <Navbar />
        <main className="pt-[var(--header-height)]">
          <SiteCodeSlot name="header" />
          <Outlet />
          <SiteCodeSlot name="page" />
          <SiteCodeSlot name="footer" />
        </main>
        <Footer />
        <InstallPrompt />
      </div>
    </SiteCodeProvider>
  );
}
