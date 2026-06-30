import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { songsBooksPage } from "../data/content.js";

export default function SongsBooksPage() {
  return (
    <>
      <PageHeader
        title={songsBooksPage.title}
        description={songsBooksPage.intro}
      />
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-fg">
            {songsBooksPage.releasesTitle}
          </h2>
          <p className="mt-2 text-fg-muted">{songsBooksPage.releasesIntro}</p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {songsBooksPage.items.map((item, i) => (
            <Reveal
              key={`${item.title}-${i}`}
              delay={(i % 3) * 70}
              className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold leading-snug text-fg">
                  {item.title}
                </h3>
                {item.badge && (
                  <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary-soft">
                    {item.badge}
                  </span>
                )}
              </div>
              {item.subtitle && (
                <p className="mt-2 text-xs text-fg-subtle">{item.subtitle}</p>
              )}
              {item.price && (
                <p className="mt-3 font-display text-xl font-semibold text-gradient-gold">
                  {item.price}
                </p>
              )}
              {item.description && (
                <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
                  {item.description}
                </p>
              )}
              {item.action && (
                <button
                  type="button"
                  className="mt-5 inline-flex w-fit rounded-full border border-border-strong bg-surface px-5 py-2 text-sm font-semibold text-fg transition hover:bg-surface-hover"
                >
                  {item.action}
                </button>
              )}
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
