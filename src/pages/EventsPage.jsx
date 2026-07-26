import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { site } from "../data/site.js";

const calendarId =
  import.meta.env.VITE_GOOGLE_CALENDAR_ID?.trim() || site.email;

const calendarTimezone =
  import.meta.env.VITE_GOOGLE_CALENDAR_TIMEZONE?.trim() || "Africa/Lagos";

export function getGoogleCalendarEmbedUrl() {
  const params = new URLSearchParams({
    src: calendarId,
    ctz: calendarTimezone,
  });
  return `https://calendar.google.com/calendar/embed?${params.toString()}`;
}

export default function EventsPage() {
  const { t } = useTranslation();
  const embedUrl = getGoogleCalendarEmbedUrl();

  return (
    <>
      <PageHeader
        title={t("eventsPage.title")}
        description={t("eventsPage.intro")}
      />
      <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <iframe
              title={t("eventsPage.calendarTitle")}
              src={embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[min(70vh,720px)] min-h-[520px] w-full border-0"
            />
          </div>
        </Reveal>
      </section>
    </>
  );
}
