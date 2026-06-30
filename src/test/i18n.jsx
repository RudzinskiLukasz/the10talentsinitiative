import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n/index.js";

export function renderWithI18n(ui, { route = "/", language = "en" } = {}) {
  i18n.changeLanguage(language);
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </I18nextProvider>
  );
}

export { i18n };
