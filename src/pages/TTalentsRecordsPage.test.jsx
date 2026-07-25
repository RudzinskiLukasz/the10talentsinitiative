import { screen } from "@testing-library/react";
import App from "../App.jsx";
import { renderWithI18n, i18n } from "../test/i18n.jsx";

describe("T-Talents Records page", () => {
  beforeEach(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.clear();
    i18n.changeLanguage("en");
  });

  it("renders the Records music catalog empty state without CMS tracks", () => {
    renderWithI18n(<App />, { route: "/t-talents-records" });
    expect(
      screen.getByRole("heading", { name: i18n.t("tTalentsRecordsPage.title") })
    ).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t("tTalentsRecordsPage.empty"))
    ).toBeInTheDocument();
  });
});
