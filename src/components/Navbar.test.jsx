import { screen } from "@testing-library/react";
import Navbar from "./Navbar.jsx";
import { renderWithI18n, i18n } from "../test/i18n.jsx";

function renderNavbar(initialRoute = "/", language = "en") {
  return renderWithI18n(<Navbar />, { route: initialRoute, language });
}

describe("Navbar", () => {
  beforeEach(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.clear();
    i18n.changeLanguage("en");
  });

  it("renders all main navigation links", () => {
    renderNavbar();
    const navKeys = ["home", "programs", "dailyReflections", "events", "songsBooks", "contact"];
    for (const key of navKeys) {
      expect(screen.getAllByRole("link", { name: i18n.t(`nav.${key}`) }).length).toBeGreaterThan(
        0
      );
    }
  });

  it("renders all secondary navigation links", () => {
    renderNavbar();
    const keys = [
      "tTalentsRecords",
      "tTalentsStudios",
      "tTalentsSeries",
      "tTalentsSports",
      "catholicSinglesForum",
      "donations",
    ];
    for (const key of keys) {
      expect(
        screen.getAllByRole("link", { name: i18n.t(`secondaryNav.${key}`) }).length
      ).toBeGreaterThan(0);
    }
  });

  it("marks the active main nav link on the current route", () => {
    renderNavbar("/programs");
    const programsLinks = screen.getAllByRole("link", { name: i18n.t("nav.programs") });
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

  it("exposes a language selector", () => {
    renderNavbar();
    expect(
      screen.getAllByRole("combobox", { name: i18n.t("common.language") }).length
    ).toBeGreaterThan(0);
  });

  it("separates main and secondary navigation regions", () => {
    renderNavbar();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Secondary" })).toBeInTheDocument();
  });
});
