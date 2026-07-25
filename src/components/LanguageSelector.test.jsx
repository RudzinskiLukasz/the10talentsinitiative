import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import LanguageSelector from "./LanguageSelector.jsx";
import i18n from "../i18n/index.js";

function renderSelector(language = "en") {
  i18n.changeLanguage(language);
  return render(
    <I18nextProvider i18n={i18n}>
      <LanguageSelector />
    </I18nextProvider>
  );
}

describe("LanguageSelector", () => {
  beforeEach(() => {
    localStorage.clear();
    i18n.changeLanguage("en");
    document.documentElement.lang = "en";
  });

  it("renders with language label and current selection", () => {
    renderSelector("en");
    expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /language/i })).toHaveTextContent(
      /english/i
    );
  });

  it("changes language on selection", async () => {
    const user = userEvent.setup();
    renderSelector("en");

    await user.click(screen.getByRole("combobox", { name: /language/i }));
    await user.click(screen.getByRole("option", { name: "Polski" }));

    expect(i18n.language).toBe("pl");
    expect(document.documentElement.lang).toBe("pl");
    expect(localStorage.getItem("ttt-lang")).toBe("pl");
  });

  it("shows native language names in options", async () => {
    const user = userEvent.setup();
    renderSelector("en");

    await user.click(screen.getByRole("combobox", { name: /language/i }));

    expect(screen.getByRole("option", { name: "Polski" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Deutsch" })).toBeInTheDocument();
  });
});
