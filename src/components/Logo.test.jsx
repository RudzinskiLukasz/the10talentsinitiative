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

  it("renders black logo for light mode and white logo for dark mode (CSS switched)", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Logo />
        </MemoryRouter>
      </I18nextProvider>
    );

    const lightLogo = screen.getByRole("img", {
      name: /The Ten Talents Initiative/i,
    });
    expect(lightLogo).toHaveAttribute("src", "/images/logo.png");
    expect(lightLogo.className).toMatch(/dark:hidden/);

    const darkLogo = document.querySelector(
      'img[src="/images/logo-on-dark.png"]'
    );
    expect(darkLogo).toBeTruthy();
    expect(darkLogo.className).toMatch(/dark:block/);
  });
});
