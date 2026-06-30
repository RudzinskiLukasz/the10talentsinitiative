import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import ThemeToggle from "./ThemeToggle.jsx";
import i18n from "../i18n/index.js";

function renderToggle(props) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeToggle {...props} />
    </I18nextProvider>
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    i18n.changeLanguage("en");
  });

  it("calls onToggle when clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    renderToggle({ theme: "dark", onToggle });

    await user.click(screen.getByRole("switch", { name: i18n.t("common.switchToLight") }));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("reflects light mode as checked on the switch", () => {
    renderToggle({ theme: "light", onToggle: () => {} });
    expect(screen.getByRole("switch", { name: i18n.t("common.switchToDark") })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });
});
