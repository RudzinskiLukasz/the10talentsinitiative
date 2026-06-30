import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import ThemeVariantSelect from "./ThemeVariantSelect.jsx";
import i18n from "../i18n/index.js";

function renderSelect(props) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeVariantSelect {...props} />
    </I18nextProvider>
  );
}

describe("ThemeVariantSelect", () => {
  beforeEach(() => {
    i18n.changeLanguage("en");
  });

  it("shows the current theme variant label", () => {
    renderSelect({ variant: "default", onChange: () => {} });
    expect(screen.getByRole("combobox", { name: i18n.t("common.themeStyle") })).toHaveTextContent(
      i18n.t("themes.extendable")
    );
  });

  it("opens a listbox on click and selects an option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ variant: "default", onChange });

    const trigger = screen.getByRole("combobox", { name: i18n.t("common.themeStyle") });
    await user.click(trigger);

    expect(screen.getByRole("listbox", { name: i18n.t("common.themeStyle") })).toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: i18n.t("themes.paperGlass") }));

    expect(onChange).toHaveBeenCalledWith("paper-glass");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes on Escape and outside click", async () => {
    const user = userEvent.setup();
    render(
      <I18nextProvider i18n={i18n}>
        <div>
          <ThemeVariantSelect variant="default" onChange={() => {}} />
          <button type="button">Outside</button>
        </div>
      </I18nextProvider>
    );

    const trigger = screen.getByRole("combobox", { name: i18n.t("common.themeStyle") });
    await user.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ variant: "default", onChange });

    const trigger = screen.getByRole("combobox", { name: i18n.t("common.themeStyle") });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("paper-glass");
  });

  it("lists all three theme variants including Ona", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ variant: "default", onChange });

    await user.click(screen.getByRole("combobox", { name: i18n.t("common.themeStyle") }));

    expect(screen.getByRole("option", { name: i18n.t("themes.extendable") })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: i18n.t("themes.paperGlass") })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: i18n.t("themes.ona") })).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: i18n.t("themes.ona") }));
    expect(onChange).toHaveBeenCalledWith("ona");
  });

  it("shows Ona theme label when selected", () => {
    renderSelect({ variant: "ona", onChange: () => {} });
    expect(screen.getByRole("combobox", { name: i18n.t("common.themeStyle") })).toHaveTextContent(
      i18n.t("themes.ona")
    );
  });
});
