import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Reveal from "./Reveal.jsx";

export default function Join() {
  const { t } = useTranslation();

  return (
    <section id="join" className="relative scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28">
      <Reveal className="mx-auto max-w-5xl">
        <div className="cta-gradient relative overflow-hidden rounded-[2rem] border border-white/10 px-6 py-14 text-center shadow-2xl shadow-black/20 sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-gold-500/20 blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-grape-500/25 blur-[110px]" />
          </div>

          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-balance text-cream sm:text-5xl">
            {t("join.title")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">
            {t("join.body")}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={t("join.ctaHref")}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-bold text-night-950 shadow-xl shadow-gold-500/25 transition hover:bg-gold-400 sm:w-auto"
            >
              {t("join.cta")}
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
            <Link
              to="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-cream transition hover:bg-white/10 sm:w-auto"
            >
              {t("common.contactUs")}
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
