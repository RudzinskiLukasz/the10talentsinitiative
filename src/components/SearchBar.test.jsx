import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import { searchContent } from "../data/searchIndex.js";
import i18n from "../i18n/index.js";

function renderSearchBar(props = {}) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <SearchBar {...props} />
      </MemoryRouter>
    </I18nextProvider>
  );
}

describe("searchContent", () => {
  beforeEach(() => {
    i18n.changeLanguage("en");
  });

  it("returns nav pages for matching queries", () => {
    const results = searchContent("programs");
    expect(results.some((r) => r.title === i18n.t("nav.programs"))).toBe(true);
  });

  it("returns coming soon for placeholder secondary nav items", () => {
    const results = searchContent("T-Talents Records");
    const match = results.find((r) => r.title === i18n.t("secondaryNav.tTalentsRecords"));
    expect(match).toBeDefined();
    expect(match.comingSoon).toBe(true);
  });
});

describe("SearchBar", () => {
  beforeEach(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    i18n.changeLanguage("en");
  });

  it("renders a search combobox with placeholder", () => {
    renderSearchBar();
    expect(screen.getByRole("combobox", { name: /search site content/i })).toHaveAttribute(
      "placeholder",
      i18n.t("common.searchPlaceholder")
    );
  });

  it("filters and shows results when typing", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    await user.type(screen.getByRole("combobox"), "Programs");

    await waitFor(() => {
      expect(screen.getAllByRole("option").length).toBeGreaterThan(0);
    });

    expect(
      screen.getByRole("option", {
        name: new RegExp(`^${i18n.t("nav.programs")}`, "i"),
      })
    ).toBeInTheDocument();
  });

  it("shows empty state when nothing matches", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    await user.type(screen.getByRole("combobox"), "zzzznotfoundxyz");

    await waitFor(() => {
      expect(screen.getByText(i18n.t("common.noResults"))).toBeInTheDocument();
    });
  });

  it("renders compact search toggle button", () => {
    renderSearchBar({ compact: true });
    expect(screen.getByRole("button", { name: /open search/i })).toBeInTheDocument();
  });
});
