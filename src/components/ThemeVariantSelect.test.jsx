import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeVariantSelect from "./ThemeVariantSelect.jsx";

describe("ThemeVariantSelect", () => {
  it("shows the current theme variant label", () => {
    render(<ThemeVariantSelect variant="default" onChange={() => {}} />);
    expect(screen.getByRole("combobox", { name: "Theme style" })).toHaveTextContent(
      "Extendable theme"
    );
  });

  it("opens a listbox on click and selects an option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ThemeVariantSelect variant="default" onChange={onChange} />);

    const trigger = screen.getByRole("combobox", { name: "Theme style" });
    await user.click(trigger);

    expect(screen.getByRole("listbox", { name: "Theme style" })).toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: "Paper glass theme" }));

    expect(onChange).toHaveBeenCalledWith("paper-glass");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes on Escape and outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <ThemeVariantSelect variant="default" onChange={() => {}} />
        <button type="button">Outside</button>
      </div>
    );

    const trigger = screen.getByRole("combobox", { name: "Theme style" });
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
    render(<ThemeVariantSelect variant="default" onChange={onChange} />);

    const trigger = screen.getByRole("combobox", { name: "Theme style" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("paper-glass");
  });
});
