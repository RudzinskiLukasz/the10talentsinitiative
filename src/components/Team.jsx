import { useState } from "react";
import { useTranslation } from "react-i18next";
import Reveal from "./Reveal.jsx";
import { teamEmails, teamPhotos } from "../data/site.js";

function initials(name) {
  const cleaned = name
    .replace(/^(Rev\.|Fr\.|Mr\.|Mrs\.|Miss|Dr\.)\s*/gi, "")
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

function TeamAvatar({ name, image, variant = "grid" }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = image && !failed;
  const isLead = variant === "lead";

  if (showPhoto) {
    return (
      <div
        className={
          isLead
            ? "mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-[3rem] ring-2 ring-gold-400/40 shadow-2xl shadow-cta/25 transition hover:ring-gold-400/70 sm:mx-0 sm:max-w-[320px]"
            : "aspect-[3/4] w-full overflow-hidden rounded-[2.75rem] ring-2 ring-border transition group-hover:ring-primary/40"
        }
      >
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          width={isLead ? 320 : 280}
          height={isLead ? 427 : 373}
          className="h-full w-full object-cover object-top"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={
        isLead
          ? "mx-auto grid aspect-[3/4] w-full max-w-[280px] place-items-center rounded-[3rem] bg-gradient-to-br from-gold-400 to-gold-600 font-display text-5xl font-bold text-on-cta shadow-2xl shadow-cta/25 sm:mx-0 sm:max-w-[320px]"
          : "grid aspect-[3/4] w-full place-items-center rounded-[2.75rem] bg-primary/15 font-display text-4xl font-bold text-primary-soft ring-1 ring-border transition group-hover:bg-primary/25"
      }
    >
      {initials(name)}
    </div>
  );
}

export default function Team() {
  const { t } = useTranslation();
  const team = t("team", { returnObjects: true });
  const [lead, ...members] = team;

  return (
    <section id="team" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal
            as="h2"
            className="font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            {t("teamSection.title")}
          </Reveal>
          <Reveal
            as="p"
            delay={120}
            className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg"
          >
            {t("teamSection.description")}
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <div className="surface-gradient relative overflow-hidden rounded-3xl border border-[color:var(--surface-grad-border)] p-8 shadow-xl shadow-black/[0.06] sm:p-10">
            <div className="glow-accent pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl" />
            <div className="relative flex flex-col items-center gap-8 text-center sm:flex-row sm:items-center sm:text-left">
              <TeamAvatar
                name={lead.name}
                image={teamPhotos[0]}
                variant="lead"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
                  {lead.name}
                </h3>
                <p className="mt-2 text-sm text-fg-subtle sm:text-base">
                  ({lead.role}).
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => {
            const email = teamEmails[i + 1];
            return (
              <Reveal
                key={m.name}
                delay={(i % 3) * 70}
                className="group overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-sm shadow-black/[0.03] transition hover:border-primary/40 hover:bg-surface-hover sm:p-6"
              >
                <TeamAvatar
                  name={m.name}
                  image={teamPhotos[i + 1]}
                  variant="grid"
                />
                <div className="mt-5 min-w-0 text-center">
                  <h3 className="font-display text-lg font-semibold text-fg">
                    {m.name}
                  </h3>
                  <p className="mt-1 text-sm text-fg-subtle">({m.role})</p>
                </div>
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-primary-soft transition hover:text-accent"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                    <span className="truncate">
                      {t("common.email")} {email}
                    </span>
                  </a>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
