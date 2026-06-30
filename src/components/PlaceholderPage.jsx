import PageHeader from "./PageHeader.jsx";
import Reveal from "./Reveal.jsx";

export default function PlaceholderPage({ title }) {
  return (
    <>
      <PageHeader title={title} />
      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <Reveal className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm text-fg-subtle">Coming soon</p>
        </Reveal>
      </section>
    </>
  );
}
