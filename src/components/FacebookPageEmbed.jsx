import { useEffect, useRef, useState } from "react";
import { useTheme } from "../hooks/useTheme.js";
import { contactSocial } from "../data/site.js";

const FACEBOOK_PAGE_URL =
  contactSocial.find((item) => item.key === "facebook")?.href ??
  "https://www.facebook.com/profile.php?id=61585447853379";

const MIN_WIDTH = 180;
const MAX_WIDTH = 500;

/**
 * Official Facebook Page Plugin embed for The Ten Talents Initiative.
 * Responsive within Facebook's 180–500px width constraint; follows site theme.
 */
export default function FacebookPageEmbed({
  href = FACEBOOK_PAGE_URL,
  height = 500,
  className = "",
}) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(MAX_WIDTH);
  const { theme } = useTheme();

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateWidth = (next) => {
      const clamped = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.floor(next)));
      setWidth((prev) => (prev === clamped ? prev : clamped));
    };

    updateWidth(node.getBoundingClientRect().width);

    const observer = new ResizeObserver(([entry]) => {
      updateWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const src = new URL("https://www.facebook.com/plugins/page.php");
  src.searchParams.set("href", href);
  src.searchParams.set("tabs", "timeline");
  src.searchParams.set("width", String(width));
  src.searchParams.set("height", String(height));
  src.searchParams.set("small_header", "false");
  src.searchParams.set("adapt_container_width", "true");
  src.searchParams.set("hide_cover", "false");
  src.searchParams.set("show_facepile", "true");
  src.searchParams.set("colorscheme", theme === "dark" ? "dark" : "light");

  return (
    <div
      ref={containerRef}
      className={`mx-auto w-full max-w-[500px] overflow-hidden rounded-2xl border border-border bg-surface shadow-sm ${className}`}
    >
      <iframe
        title="The Ten Talents Initiative on Facebook"
        src={src.toString()}
        width={width}
        height={height}
        className="mx-auto block max-w-full border-0"
        style={{ overflow: "hidden" }}
        scrolling="no"
        allow="encrypted-media"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
