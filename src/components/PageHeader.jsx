import HeroPhotoBackground from "./HeroPhotoBackground.jsx";
import Reveal from "./Reveal.jsx";

export default function PageHeader({ eyebrow, title, description, className = "" }) {
  return (
    <section
      className={`hero-on-photo relative min-h-[min(48vh,26rem)] overflow-hidden pt-page-top pb-16 sm:min-h-[min(52vh,30rem)] sm:pb-20 ${className}`}
    >
      <HeroPhotoBackground showDots={false} />

      <div className="relative mx-auto flex max-w-4xl flex-col justify-center px-5 text-center sm:px-8">
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
          className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-balance drop-shadow-sm sm:text-5xl"
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
