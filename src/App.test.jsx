import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App.jsx";
import { hero, programsPage, contactPage } from "./data/content.js";

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe("App routing", () => {
  beforeEach(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.clear();
  });

  it("renders the home page at /", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { level: 1, name: hero.title })
    ).toBeInTheDocument();
  });

  it("renders the programs page at /programs", () => {
    renderAt("/programs");
    expect(
      screen.getByRole("heading", { name: programsPage.title })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Passion Play.*Cinema Awards/i })
    ).toBeInTheDocument();
  });

  it("renders the contact page at /contact", () => {
    renderAt("/contact");
    expect(screen.getByRole("heading", { name: contactPage.title })).toBeInTheDocument();
    expect(screen.getByText(contactPage.intro)).toBeInTheDocument();
  });
});
