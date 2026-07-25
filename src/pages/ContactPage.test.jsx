import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import ContactPage from "./ContactPage.jsx";
import { contactSocial } from "../data/site.js";
import i18n from "../i18n/index.js";

vi.mock("../lib/contact.js", () => ({
  submitContactMessage: vi.fn().mockResolvedValue({ success: true }),
}));

import { submitContactMessage } from "../lib/contact.js";

function renderContactPage() {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    </I18nextProvider>
  );
}

describe("ContactPage security", () => {
  beforeEach(() => {
    i18n.changeLanguage("en");
    vi.mocked(submitContactMessage).mockClear();
    vi.mocked(submitContactMessage).mockResolvedValue({ success: true });
  });

  it("external links use rel=noopener noreferrer with target=_blank", () => {
    renderContactPage();

    const externalLinks = contactSocial.filter((item) => item.href.startsWith("http"));

    for (const item of externalLinks) {
      const index = contactSocial.indexOf(item);
      const link = screen.getByRole("link", { name: i18n.t(`contactPage.social.${index}`) });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("does not render submitted form values as HTML", async () => {
    const user = userEvent.setup();
    renderContactPage();

    await user.type(screen.getByRole("textbox", { name: /name/i }), "<script>alert(1)</script>");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "test@example.com");
    await user.type(screen.getByRole("textbox", { name: /message/i }), "Hello");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(i18n.t("common.thankYouMessage"))).toBeInTheDocument();
    });
    expect(screen.queryByText("<script>alert(1)</script>")).not.toBeInTheDocument();
    expect(submitContactMessage).toHaveBeenCalledWith({
      name: "<script>alert(1)</script>",
      email: "test@example.com",
      subject: "",
      message: "Hello",
    });
  });

  it("shows an error when sending fails", async () => {
    vi.mocked(submitContactMessage).mockRejectedValueOnce(new Error("network"));
    const user = userEvent.setup();
    renderContactPage();

    await user.type(screen.getByRole("textbox", { name: /name/i }), "Ada");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "ada@example.com");
    await user.type(screen.getByRole("textbox", { name: /message/i }), "Hello");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(i18n.t("common.sendError"));
    expect(screen.queryByText(i18n.t("common.thankYouMessage"))).not.toBeInTheDocument();
  });
});
