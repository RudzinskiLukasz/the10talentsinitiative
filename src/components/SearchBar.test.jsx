import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import { searchContent } from "../data/searchIndex.js";

function renderSearchBar(props = {}) {
  return render(
    <MemoryRouter>
      <SearchBar {...props} />
    </MemoryRouter>
  );
}

describe("searchContent", () => {
  it("returns nav pages for matching queries", () => {
    const results = searchContent("programs");
    expect(results.some((r) => r.title === "Programs")).toBe(true);
  });

  it("returns coming soon for placeholder secondary nav items", () => {
    const results = searchContent("T-Talents Records");
    const match = results.find((r) => r.title === "T-Talents Records");
    expect(match).toBeDefined();
    expect(match.comingSoon).toBe(true);
  });
});

describe("SearchBar", () => {
  beforeEach(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  });

  it("renders a search combobox with placeholder", () => {
    renderSearchBar();
    expect(screen.getByRole("combobox", { name: /search site content/i })).toHaveAttribute(
      "placeholder",
      "Search…"
    );
  });

  it("filters and shows results when typing", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    await user.type(screen.getByRole("combobox"), "Programs");

    await waitFor(() => {
      expect(screen.getAllByRole("option").length).toBeGreaterThan(0);
    });

    expect(screen.getByRole("option", { name: /^Programs Navigation/i })).toBeInTheDocument();
  });

  it("shows empty state when nothing matches", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    await user.type(screen.getByRole("combobox"), "zzzznotfoundxyz");

    await waitFor(() => {
      expect(screen.getByText("No results found")).toBeInTheDocument();
    });
  });

  it("renders compact search toggle button", () => {
    renderSearchBar({ compact: true });
    expect(screen.getByRole("button", { name: /open search/i })).toBeInTheDocument();
  });
});
