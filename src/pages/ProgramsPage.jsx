import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { programsPage } from "../data/content.js";

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        title={programsPage.title}
        description={programsPage.intro}
      />
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="space-y-16">
          {programsPage.pillars.map((pillar, pillarIndex) => (
            <div key={pillar.name}>
              <Reveal>
                <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
                  {pillar.name}
                </h2>
                <p className="mt-3 max-w-3xl text-fg-muted">{pillar.intro}</p>
              </Reveal>

              <div className="mt-8 space-y-5">
                {pillar.programs.map((program, i) => (
                  <Reveal
                    key={program.number}
                    delay={(i % 2) * 60}
                    className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8"
                  >
                    <div className="flex items-start gap-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 font-display text-lg font-semibold text-primary-soft">
                        {program.number}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-xl font-semibold text-fg">
                          {program.title}
                        </h3>
                        {program.body && (
                          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-fg-muted sm:text-base">
                            {program.body}
                          </p>
                        )}
                        {program.aim && (
                          <p className="mt-3 text-sm leading-relaxed text-fg-muted sm:text-base">
                            <span className="font-semibold text-fg">Aim: </span>
                            {program.aim}
                          </p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {pillarIndex < programsPage.pillars.length - 1 && (
                <div className="mt-12 border-b border-border-subtle" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 border-t border-border-subtle pt-16">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
              {programsPage.upcomingEventsTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-fg-muted">
              {programsPage.upcomingEventsIntro}
            </p>
          </Reveal>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {programsPage.upcomingEvents.map((event, i) => (
              <Reveal key={event.title} delay={i * 70}>
                <div className="h-full rounded-2xl border border-border bg-bg-band p-6">
                  <h3 className="font-display text-lg font-semibold text-fg">{event.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-fg-muted">
                    {event.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
