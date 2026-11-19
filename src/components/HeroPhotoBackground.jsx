import { useEffect, useState } from "react";
import { HERO_BACKGROUNDS } from "../data/heroBackgrounds.js";

const INTERVAL_MS = 6500;
const FADE_MS = 1400;

/**
 * Full-bleed photo slideshow for hero sections.
 * Crossfades with a subtle Ken Burns zoom; respects reduced motion.
 */
export default function HeroPhotoBackground({
  images = HERO_BACKGROUNDS,
  intervalMs = INTERVAL_MS,
  className = "",
}) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion || images.length < 2) return undefined;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [images.length, intervalMs, reduceMotion]);

  if (!images.length) return null;

  return (
    <div
      className={`hero-photo-bg pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {images.map((image, i) => {
        const isActive = reduceMotion ? i === 0 : i === index;
        return (
          <div
            key={image.src}
            className={`hero-photo-slide absolute inset-0 ${
              isActive ? "is-active" : ""
            } ${reduceMotion ? "motion-static" : ""}`}
            style={{ transitionDuration: `${FADE_MS}ms` }}
          >
            <img
              src={image.src}
              alt=""
              decoding="async"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              className="hero-photo-img h-full w-full object-cover"
            />
          </div>
        );
      })}

      {/* Readability: deep vignette + bottom fade into page bg */}
      <div className="hero-photo-scrim absolute inset-0" />
      <div className="hero-photo-fade absolute inset-x-0 bottom-0 h-1/3" />

      {!reduceMotion && images.length > 1 ? (
        <div className="hero-photo-dots absolute bottom-5 left-1/2 z-[1] flex -translate-x-1/2 gap-1.5 sm:bottom-7">
          {images.map((image, i) => (
            <span
              key={image.src}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index
                  ? "w-5 bg-white/90"
                  : "w-1.5 bg-white/35"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
