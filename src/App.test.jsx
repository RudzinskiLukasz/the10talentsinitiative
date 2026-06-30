import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App.jsx";
import { homePage } from "./data/content.js";

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
    expect(screen.getByRole("heading", { level: 1, name: homePage.hero })).toBeInTheDocument();
  });

  it("renders the programs placeholder at /programs", () => {
    renderAt("/programs");
    expect(screen.getByRole("heading", { name: "Programs" })).toBeInTheDocument();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
  });

  it("renders the contact placeholder at /contact", () => {
    renderAt("/contact");
    expect(screen.getByRole("heading", { name: "Contact Us" })).toBeInTheDocument();
  });
});
