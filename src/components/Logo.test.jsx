import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import Logo from "./Logo.jsx";
import i18n from "../i18n/index.js";

describe("Logo", () => {
  beforeEach(() => {
    localStorage.clear();
    i18n.changeLanguage("en");
  });

  it("uses black logo.png in light mode for contrast", () => {
    localStorage.setItem("ttt-theme", "light");
    document.documentElement.setAttribute("data-theme", "light");

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Logo />
        </MemoryRouter>
      </I18nextProvider>
    );

    expect(
      screen.getByRole("img", { name: /The Ten Talents Initiative/i })
    ).toHaveAttribute("src", "/images/logo.png");
  });

  it("uses logo-on-dark.png in dark mode", () => {
    localStorage.setItem("ttt-theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Logo />
        </MemoryRouter>
      </I18nextProvider>
    );

    expect(
      screen.getByRole("img", { name: /The Ten Talents Initiative/i })
    ).toHaveAttribute("src", "/images/logo-on-dark.png");
  });
});
