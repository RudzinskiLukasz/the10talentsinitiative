import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import EventsPage, { getGoogleCalendarEmbedUrl } from "./EventsPage.jsx";
import { site } from "../data/site.js";
import i18n from "../i18n/index.js";

describe("EventsPage", () => {
  it("builds a Google Calendar embed URL for the site Gmail", () => {
    const url = new URL(getGoogleCalendarEmbedUrl());
    expect(url.origin + url.pathname).toBe(
      "https://calendar.google.com/calendar/embed"
    );
    expect(url.searchParams.get("src")).toBe(site.email);
    expect(url.searchParams.get("ctz")).toBe("Africa/Lagos");
  });

  it("embeds the public Google Calendar below the page header", () => {
    i18n.changeLanguage("en");
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <EventsPage />
        </MemoryRouter>
      </I18nextProvider>
    );

    expect(
      screen.getByRole("heading", { name: i18n.t("eventsPage.title") })
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t("eventsPage.intro"))).toBeInTheDocument();

    const iframe = screen.getByTitle(i18n.t("eventsPage.calendarTitle"));
    expect(iframe).toHaveAttribute("src", getGoogleCalendarEmbedUrl());
  });
});
