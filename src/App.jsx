import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Mission from "./components/Mission.jsx";
import Goals from "./components/Goals.jsx";
import Team from "./components/Team.jsx";
import Join from "./components/Join.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Mission />
        <Goals />
        <Team />
        <Join />
      </main>
      <Footer />
    </div>
  );
}
