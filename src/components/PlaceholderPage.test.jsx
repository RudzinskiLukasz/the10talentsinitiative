import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import PlaceholderPage from "./PlaceholderPage.jsx";
import i18n from "../i18n/index.js";

describe("PlaceholderPage", () => {
  it("renders the page title and coming soon message", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <PlaceholderPage title="Programs" />
      </I18nextProvider>
    );

    expect(screen.getByRole("heading", { name: "Programs" })).toBeInTheDocument();
    expect(screen.getByText(i18n.t("common.comingSoon"))).toBeInTheDocument();
  });
});
