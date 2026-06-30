import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ContactPage from "./ContactPage.jsx";
import { contactPage } from "../data/content.js";

describe("ContactPage security", () => {
  it("external links use rel=noopener noreferrer with target=_blank", () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    const externalLinks = contactPage.social.filter((item) => item.href.startsWith("http"));

    for (const item of externalLinks) {
      const link = screen.getByRole("link", { name: item.label });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("does not render submitted form values as HTML", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    await user.type(screen.getByRole("textbox", { name: /name/i }), "<script>alert(1)</script>");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "test@example.com");
    await user.type(screen.getByRole("textbox", { name: /message/i }), "Hello");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.queryByText("<script>alert(1)</script>")).not.toBeInTheDocument();
    expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
  });
});
