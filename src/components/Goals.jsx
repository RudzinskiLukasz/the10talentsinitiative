import Reveal from "./Reveal.jsx";
import { goals, goalsSection } from "../data/content.js";

export default function Goals() {
  const numberedGoals = goals.flatMap((group) =>
    group.points.map((point) => ({ groupTitle: group.title, point }))
  );

  return (
    <section
      id="goals"
      className="relative scroll-mt-20 border-y border-border-subtle bg-bg-band py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal
            as="h2"
            className="font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            {goalsSection.title}
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {goals.map((g, i) => (
            <Reveal
              key={g.title}
              delay={(i % 2) * 80}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-7 shadow-sm shadow-black/[0.03] transition hover:border-accent/40 hover:shadow-md hover:shadow-black/[0.05]"
            >
              <div className="glow-primary-soft pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl transition group-hover:opacity-0" />
              <div className="glow-accent pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-0 blur-3xl transition group-hover:opacity-100" />
              <h3 className="relative font-display text-xl font-semibold leading-snug text-fg">
                {g.title}
              </h3>
              <ol className="relative mt-4 space-y-3">
                {g.points.map((pt) => {
                  const number =
                    numberedGoals.findIndex(
                      (item) => item.groupTitle === g.title && item.point === pt
                    ) + 1;
                  return (
                    <li
                      key={pt}
                      className="flex gap-3 text-sm leading-relaxed text-fg-muted"
                    >
                      <span className="mt-0.5 shrink-0 font-semibold text-accent">
                        {number}.
                      </span>
                      {pt}
                    </li>
                  );
                })}
              </ol>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
