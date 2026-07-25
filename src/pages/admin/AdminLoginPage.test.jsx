import { screen } from "@testing-library/react";
import App from "../../App.jsx";
import { renderWithI18n } from "../../test/i18n.jsx";

describe("Admin routes", () => {
  it("shows the admin login page", () => {
    renderWithI18n(<App />, { route: "/admin/login" });
    expect(
      screen.getByRole("heading", { name: /Admin sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Supabase is not configured/i)).toBeInTheDocument();
  });

  it("redirects /admin to login when unauthenticated", () => {
    renderWithI18n(<App />, { route: "/admin" });
    expect(
      screen.getByRole("heading", { name: /Admin sign in/i })
    ).toBeInTheDocument();
  });
});
