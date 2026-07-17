import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Reveal from "./Reveal.jsx";

export default function Hero() {
  const { t } = useTranslation();
  const stats = t("stats", { returnObjects: true });

  return (
    <section id="top" className="relative overflow-hidden pt-page-top pb-20 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-primary absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-[120px] animate-float-slow" />
        <div className="glow-accent absolute right-[8%] top-[20%] h-[340px] w-[340px] rounded-full blur-[110px] animate-float-slower" />
        <div className="glow-primary-soft absolute left-[6%] bottom-[-10%] h-[360px] w-[360px] rounded-full blur-[120px]" />
        <div className="bg-grid absolute inset-0" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <blockquote className="relative px-2 sm:px-6">
            <p className="font-display text-xl font-medium leading-snug text-fg text-balance sm:text-2xl lg:text-[1.65rem]">
              {t("hero.quote")}
            </p>
            <footer className="mt-4 text-xs font-medium tracking-wide text-fg-subtle sm:text-sm">
              {t("hero.quoteAttribution")}
            </footer>
          </blockquote>
        </Reveal>

        <Reveal
          as="h1"
          delay={80}
          className="mx-auto mt-10 max-w-4xl text-center font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:mt-12 sm:text-6xl lg:text-7xl"
        >
          {t("hero.title")}
        </Reveal>

        <Reveal
          as="p"
          delay={160}
          className="mx-auto mt-6 max-w-3xl text-center text-base leading-relaxed text-fg-muted sm:text-lg"
        >
          {t("hero.description")}
        </Reveal>

        <Reveal
          delay={240}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            to={t("hero.ctaPrimaryHref")}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-cta px-7 py-3.5 text-sm font-bold text-on-cta shadow-xl shadow-cta/25 transition hover:bg-cta-hover sm:w-auto"
          >
            {t("hero.ctaPrimary")}
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <a
            href={t("hero.ctaSecondaryHref")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-7 py-3.5 text-sm font-semibold text-fg transition hover:bg-surface-hover sm:w-auto"
          >
            {t("hero.ctaSecondary")}
          </a>
        </Reveal>

        <Reveal
          delay={320}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4 sm:gap-8"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-semibold text-gradient-gold sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs font-medium text-fg-subtle sm:text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
