import { render, screen } from "@testing-library/react";
import FacebookPageEmbed from "./FacebookPageEmbed.jsx";

describe("FacebookPageEmbed", () => {
  beforeEach(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it("renders the Facebook Page Plugin iframe for The Ten Talents Initiative", () => {
    render(<FacebookPageEmbed />);

    const iframe = screen.getByTitle("The Ten Talents Initiative on Facebook");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining("facebook.com/plugins/page.php")
    );
    expect(iframe.getAttribute("src")).toContain(
      encodeURIComponent("https://www.facebook.com/profile.php?id=61585447853379")
    );
    expect(iframe.getAttribute("src")).toContain("tabs=timeline");
    expect(iframe.getAttribute("src")).toContain("colorscheme=dark");
  });

  it("accepts a custom page href", () => {
    render(<FacebookPageEmbed href="https://www.facebook.com/example" />);

    const iframe = screen.getByTitle("The Ten Talents Initiative on Facebook");
    expect(iframe.getAttribute("src")).toContain(
      encodeURIComponent("https://www.facebook.com/example")
    );
  });
});
