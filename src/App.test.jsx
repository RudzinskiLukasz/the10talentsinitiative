import { screen } from "@testing-library/react";
import App from "./App.jsx";
import { renderWithI18n, i18n } from "./test/i18n.jsx";

describe("App routing", () => {
  beforeEach(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.clear();
    i18n.changeLanguage("en");
  });

  it("renders the home page at /", () => {
    renderWithI18n(<App />, { route: "/" });
    expect(
      screen.getByRole("heading", { level: 1, name: i18n.t("hero.title") })
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t("hero.quote"))).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: i18n.t("homePage.introTitle") })
    ).toBeInTheDocument();
  });

  it("renders the programs page at /programs", () => {
    renderWithI18n(<App />, { route: "/programs" });
    expect(
      screen.getByRole("heading", { name: i18n.t("programsPage.title") })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Passion Play.*Cinema Awards/i })
    ).toBeInTheDocument();
  });

  it("renders the contact page at /contact", () => {
    renderWithI18n(<App />, { route: "/contact" });
    expect(
      screen.getByRole("heading", { level: 1, name: /My Gifts Are For Christ/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: i18n.t("contactPage.title") })
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t("mission.eyebrow"))).toBeInTheDocument();
    expect(screen.getByText(i18n.t("contactPage.intro"))).toBeInTheDocument();
  });

  it("renders translated home hero in Polish", () => {
    renderWithI18n(<App />, { route: "/", language: "pl" });
    expect(
      screen.getByRole("heading", { level: 1, name: i18n.t("hero.title") })
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t("hero.quote"))).toBeInTheDocument();
  });

  it("renders a daily reflection post at its slug URL", () => {
    renderWithI18n(<App />, {
      route: "/meet-the-wonderful-lectors-of-ss-peter-and-paul-nyanya-abuja",
    });
    expect(
      screen.getByRole("heading", {
        name: /Meet The Wonderful Lectors of SS\. Peter and Paul, Nyanya, Abuja!/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: i18n.t("common.backToDailyReflections") })
    ).toHaveAttribute("href", "/daily-reflections");
  });

  it("renders translated nav in German", () => {
    renderWithI18n(<App />, { route: "/", language: "de" });
    expect(screen.getAllByRole("link", { name: i18n.t("nav.programs") }).length).toBeGreaterThan(
      0
    );
  });
});
