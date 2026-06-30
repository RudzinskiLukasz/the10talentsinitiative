import Reveal from "./Reveal.jsx";

export default function PageHeader({ eyebrow, title, description, className = "" }) {
  return (
    <section className={`relative overflow-hidden pt-page-top pb-12 sm:pb-16 ${className}`}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-primary absolute left-1/2 top-[-20%] h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-[120px] opacity-70" />
        <div className="bg-grid absolute inset-0" />
      </div>
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        {eyebrow && (
          <Reveal
            as="span"
            className="text-xs font-bold uppercase tracking-[0.22em] text-accent"
          >
            {eyebrow}
          </Reveal>
        )}
        <Reveal
          as="h1"
          delay={60}
          className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl"
        >
          {title}
        </Reveal>
        {description && (
          <Reveal
            as="p"
            delay={120}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg"
          >
            {description}
          </Reveal>
        )}
      </div>
    </section>
  );
}
