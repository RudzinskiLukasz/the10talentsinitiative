import { useEffect, useRef, useState } from "react";

function isInViewport(node) {
  const rect = node.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const vw = window.innerWidth || document.documentElement.clientWidth;
  return rect.bottom > 0 && rect.right > 0 && rect.top < vh && rect.left < vw;
}

/**
 * Lightweight scroll-reveal wrapper. Adds an `is-visible` class the first
 * time the element enters the viewport. Keeps the bundle lean (no anim libs).
 *
 * Falls back to visible quickly if IntersectionObserver is missing or stalls
 * (percentage rootMargin bugs on some WebKit builds left content at opacity:0,
 * which looked like a blank white page in light theme).
 */
export default function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    // Above-the-fold content: show immediately (don't wait for async IO).
    if (isInViewport(node)) {
      setVisible(true);
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    let cancelled = false;
    const show = () => {
      if (!cancelled) setVisible(true);
    };

    // Safety net so content never stays invisible forever.
    const fallback = window.setTimeout(show, 1200);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.unobserve(entry.target);
          window.clearTimeout(fallback);
        }
      },
      // Pixel rootMargin — percentage values are unreliable in some WebKit builds.
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
