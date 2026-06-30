import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function Layout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ScrollRestoration />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
