import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { donationsPage } from "../data/content.js";

export default function DonationsPage() {
  return (
    <>
      <PageHeader title={donationsPage.title} description={donationsPage.intro} />
      <section className="mx-auto max-w-4xl px-5 pb-20 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {donationsPage.options.map((option, i) => (
            <Reveal
              key={option.title}
              delay={i * 80}
              className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm"
            >
              <h2 className="font-display text-xl font-semibold text-fg">{option.title}</h2>
              {option.subtitle && (
                <p className="mt-2 text-sm text-fg-subtle">{option.subtitle}</p>
              )}
              {option.accountName && (
                <p className="mt-4 font-medium text-fg-muted">{option.accountName}</p>
              )}
              <button
                type="button"
                className="mt-6 rounded-full border border-border-strong bg-surface px-6 py-2.5 text-sm font-semibold text-fg transition hover:bg-surface-hover"
              >
                {option.cta}
              </button>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
