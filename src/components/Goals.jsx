import Reveal from "./Reveal.jsx";
import { goals } from "../data/content.js";

export default function Goals() {
  return (
    <section
      id="goals"
      className="relative scroll-mt-20 border-y border-border-subtle bg-bg-band py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal
            as="span"
            className="text-xs font-bold uppercase tracking-[0.22em] text-accent"
          >
            What Drives Us
          </Reveal>
          <Reveal
            as="h2"
            delay={60}
            className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            Eight goals, one calling
          </Reveal>
          <Reveal
            as="p"
            delay={120}
            className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg"
          >
            Every program we run flows from these commitments to the youth of
            the Church.
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {goals.map((g, i) => (
            <Reveal
              key={g.theme}
              delay={(i % 2) * 80}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-7 shadow-sm shadow-black/[0.03] transition hover:border-accent/40 hover:shadow-md hover:shadow-black/[0.05]"
            >
              <div className="glow-primary-soft pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl transition group-hover:opacity-0" />
              <div className="glow-accent pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-0 blur-3xl transition group-hover:opacity-100" />
              <div className="relative flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary-soft">
                  {g.theme}
                </span>
                <span className="font-display text-3xl font-semibold text-fg/10 transition group-hover:text-accent/40">
                  0{i + 1}
                </span>
              </div>
              <h3 className="relative mt-3 font-display text-xl font-semibold leading-snug text-fg">
                {g.title}
              </h3>
              <ul className="relative mt-4 space-y-3">
                {g.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex gap-3 text-sm leading-relaxed text-fg-muted"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {pt}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
