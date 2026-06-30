import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle.jsx";

describe("ThemeToggle", () => {
  it("calls onToggle when clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(<ThemeToggle theme="dark" onToggle={onToggle} />);

    await user.click(screen.getByRole("switch", { name: /switch to light mode/i }));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("reflects light mode as checked on the switch", () => {
    render(<ThemeToggle theme="light" onToggle={() => {}} />);
    expect(screen.getByRole("switch", { name: /switch to dark mode/i })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });
});
