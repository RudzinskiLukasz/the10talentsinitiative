import { screen } from "@testing-library/react";
import App from "../../App.jsx";
import { renderWithI18n } from "../../test/i18n.jsx";

describe("Account register", () => {
  it("shows the public registration form", () => {
    renderWithI18n(<App />, { route: "/account/register" });
    expect(
      screen.getByRole("heading", { name: /Create your account/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Display name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/i)).toBeInTheDocument();
  });

  it("shows the public login form", () => {
    renderWithI18n(<App />, { route: "/account/login" });
    expect(screen.getByRole("heading", { name: /Welcome back/i })).toBeInTheDocument();
  });
});
