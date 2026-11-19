import { screen } from "@testing-library/react";
import App from "../App.jsx";
import { renderWithI18n } from "../test/i18n.jsx";

describe("Catholic Singles Forum", () => {
  it("offers CAST handoff messaging and account creation", () => {
    renderWithI18n(<App />, { route: "/catholic-singles-forum" });
    expect(screen.getByRole("heading", { name: /Shared with CAST/i })).toBeInTheDocument();
    expect(screen.getByText(/VITE_CAST_APP_URL/i)).toBeInTheDocument();
    const registerLinks = screen.getAllByRole("link", { name: /Create account/i });
    expect(registerLinks.length).toBeGreaterThan(0);
    expect(registerLinks.every((link) => link.getAttribute("href") === "/account/register")).toBe(
      true
    );
  });
});
