import { Link } from "react-router-dom";
import Reveal from "./Reveal.jsx";
import { mission } from "../data/content.js";

export default function Mission() {
  return (
    <section id="mission" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal
            as="h2"
            className="font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            {mission.eyebrow}
          </Reveal>
          <Reveal
            as="p"
            delay={120}
            className="mt-6 text-base leading-relaxed text-fg-muted sm:text-lg"
          >
            {mission.body}
          </Reveal>
          <Reveal delay={180} className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 rounded-full bg-cta px-5 py-2.5 text-sm font-bold text-on-cta transition hover:bg-cta-hover"
            >
              Discover Our Programs
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
