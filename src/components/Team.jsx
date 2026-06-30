import Reveal from "./Reveal.jsx";
import { team, teamSection } from "../data/content.js";

function initials(name) {
  const cleaned = name
    .replace(/^(Rev\.|Fr\.|Mr\.|Mrs\.|Miss|Dr\.)\s*/gi, "")
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function Team() {
  const [lead, ...members] = team;

  return (
    <section id="team" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal
            as="h2"
            className="font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            {teamSection.title}
          </Reveal>
          <Reveal
            as="p"
            delay={120}
            className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg"
          >
            {teamSection.description}
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <div className="surface-gradient relative overflow-hidden rounded-3xl border border-[color:var(--surface-grad-border)] p-8 shadow-xl shadow-black/[0.06] sm:p-10">
            <div className="glow-accent pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl" />
            <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 font-display text-3xl font-bold text-on-cta shadow-xl shadow-cta/25">
                {initials(lead.name)}
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
                  {lead.name}
                </h3>
                <p className="mt-2 text-sm text-fg-subtle">({lead.role}).</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <Reveal
              key={m.name}
              delay={(i % 3) * 70}
              className="group rounded-2xl border border-border bg-surface p-6 shadow-sm shadow-black/[0.03] transition hover:border-primary/40 hover:bg-surface-hover"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/15 font-display text-lg font-bold text-primary-soft ring-1 ring-border transition group-hover:bg-primary/25">
                  {initials(m.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-fg">{m.name}</h3>
                  <p className="mt-0.5 text-sm text-fg-subtle">({m.role})</p>
                </div>
              </div>
              {m.email && (
                <a
                  href={`mailto:${m.email}`}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-primary-soft transition hover:text-accent"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  <span className="truncate">Email: {m.email}</span>
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
