import { screen } from "@testing-library/react";
import App from "../App.jsx";
import { renderWithI18n, i18n } from "../test/i18n.jsx";
import { POST_CATEGORIES, DEFAULT_POST_CATEGORY } from "../data/postCategories.js";

describe("Category and admin surfaces", () => {
  beforeEach(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.clear();
    i18n.changeLanguage("en");
  });

  it("lists the five post section tabs with Daily Reflections as default", () => {
    expect(POST_CATEGORIES).toHaveLength(5);
    expect(DEFAULT_POST_CATEGORY).toBe("Homilies/Reflections");
    expect(POST_CATEGORIES.filter((c) => c.isDefault)).toHaveLength(1);
    expect(POST_CATEGORIES.map((c) => c.href)).toEqual([
      "/daily-reflections",
      "/t-talents-records",
      "/t-talents-studios",
      "/t-talents-series",
      "/t-talents-sports",
    ]);
  });

  it("renders Daily Reflections listing", () => {
    renderWithI18n(<App />, { route: "/daily-reflections" });
    expect(
      screen.getByRole("heading", { name: i18n.t("nav.dailyReflections") })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Meet The Wonderful Lectors of SS\. Peter and Paul, Nyanya, Abuja!/i,
      })
    ).toBeInTheDocument();
  });

  it("renders T-Talents Sports empty state when no sports posts exist", () => {
    renderWithI18n(<App />, { route: "/t-talents-sports" });
    expect(
      screen.getByRole("heading", { name: i18n.t("secondaryNav.tTalentsSports") })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        i18n.t("categoryPosts.empty", {
          category: i18n.t("secondaryNav.tTalentsSports"),
        })
      )
    ).toBeInTheDocument();
  });

  it("shows updated advisory council members on contact", () => {
    renderWithI18n(<App />, { route: "/contact" });
    expect(screen.getByRole("heading", { name: /Allison James/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Łukasz Rudziński/i })).toBeInTheDocument();
    expect(screen.queryByText(/Eke Onyemauchechi/i)).not.toBeInTheDocument();
  });
});
