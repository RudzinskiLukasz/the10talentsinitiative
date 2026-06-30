import { render, screen } from "@testing-library/react";
import Reveal from "./Reveal.jsx";

describe("Reveal", () => {
  it("renders children and applies reveal class", () => {
    render(
      <Reveal className="extra-class">
        <p>Visible content</p>
      </Reveal>
    );

    const child = screen.getByText("Visible content");
    expect(child).toBeInTheDocument();
    expect(child.parentElement).toHaveClass("reveal", "extra-class");
  });

  it("supports custom element via the as prop", () => {
    render(
      <Reveal as="section" data-testid="reveal-section">
        Section content
      </Reveal>
    );

    const section = screen.getByTestId("reveal-section");
    expect(section.tagName).toBe("SECTION");
    expect(section).toHaveClass("reveal");
  });
});
