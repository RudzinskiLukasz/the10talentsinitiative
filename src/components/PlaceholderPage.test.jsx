import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PlaceholderPage from "./PlaceholderPage.jsx";

describe("PlaceholderPage", () => {
  it("renders the page title and coming soon message", () => {
    render(
      <MemoryRouter>
        <PlaceholderPage title="Programs" />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Programs" })).toBeInTheDocument();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
  });
});
