import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import { mainNav, secondaryNav } from "../data/content.js";

function renderNavbar(initialRoute = "/") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Navbar />
    </MemoryRouter>
  );
}

describe("Navbar", () => {
  beforeEach(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.clear();
  });

  it("renders all main navigation links", () => {
    renderNavbar();
    for (const item of mainNav) {
      expect(screen.getAllByRole("link", { name: item.label }).length).toBeGreaterThan(0);
    }
  });

  it("renders all secondary navigation links", () => {
    renderNavbar();
    for (const item of secondaryNav) {
      expect(screen.getAllByRole("link", { name: item.label }).length).toBeGreaterThan(0);
    }
  });

  it("marks the active main nav link on the current route", () => {
    renderNavbar("/programs");
    const programsLinks = screen.getAllByRole("link", { name: "Programs" });
    expect(programsLinks.some((link) => link.getAttribute("aria-current") === "page")).toBe(
      true
    );
  });

  it("exposes a theme toggle switch", () => {
    renderNavbar();
    expect(
      screen.getAllByRole("switch", { name: /switch to (light|dark) mode/i }).length
    ).toBeGreaterThan(0);
  });

  it("exposes a foldable theme variant selector", () => {
    renderNavbar();
    expect(
      screen.getAllByRole("combobox", { name: "Theme style" }).length
    ).toBeGreaterThan(0);
  });

  it("separates main and secondary navigation regions", () => {
    renderNavbar();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Secondary" })).toBeInTheDocument();
  });
});
