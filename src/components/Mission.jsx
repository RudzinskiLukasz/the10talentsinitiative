import Reveal from "./Reveal.jsx";

const pillars = [
  {
    title: "Loved & Valued",
    body: "We reach out to Catholic youth so they feel cherished, encouraged, and seen — exactly as they are.",
    icon: (
      <path d="M12 21s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 12c0 4.65-7 9-7 9Z" />
    ),
  },
  {
    title: "Gifts Realised",
    body: "We walk alongside gifted youth — supporting their dreams, passions, and personal goals.",
    icon: (
      <>
        <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5Z" />
      </>
    ),
  },
  {
    title: "Faith In Service",
    body: "We celebrate those who serve the Church with their gifts through awards and empowerment programs.",
    icon: (
      <>
        <path d="M12 3v18M5 8h14M7 8c0 3 2 5 5 5s5-2 5-5" />
      </>
    ),
  },
];

export default function Mission() {
  return (
    <section id="mission" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <Reveal
              as="span"
              className="text-xs font-bold uppercase tracking-[0.22em] text-accent"
            >
              Our Mission
            </Reveal>
            <Reveal
              as="h2"
              delay={60}
              className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl"
            >
              Empowering Catholic youth to let their light shine
            </Reveal>
            <Reveal
              as="p"
              delay={120}
              className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg"
            >
              Founded in 2025 by Rev. Fr. Eze Emmanuel OSA and fellow Catholics,
              we reach out to youth across Nigeria, Africa, and beyond — helping
              them feel loved and valued while pursuing their dreams in faith.
            </Reveal>
            <Reveal delay={180} className="mt-8 flex flex-wrap gap-3">
              <a
                href="#goals"
                className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-5 py-2.5 text-sm font-semibold text-fg transition hover:bg-surface-hover"
              >
                See our goals
              </a>
              <a
                href="#team"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-soft transition hover:text-fg"
              >
                Meet the team →
              </a>
            </Reveal>
          </div>

          <div className="grid gap-4">
            {pillars.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 90}
                className="group flex gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-black/[0.03] transition hover:border-accent/40 hover:bg-surface-hover"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-accent ring-1 ring-border transition group-hover:bg-cta/15">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {p.icon}
                  </svg>
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-fg">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
