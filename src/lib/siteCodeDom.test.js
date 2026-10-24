import { describe, expect, it } from "vitest";
import { applyCustomScript, applyHeadHtml, removeCustomScript } from "./siteCodeDom.js";

describe("site code DOM", () => {
  it("adds head markup and removes it on the next apply", () => {
    applyHeadHtml(
      '<meta name="x-site-code" content="1"><script>window.__siteHead = 1</script>'
    );
    expect(document.head.querySelector('meta[name="x-site-code"]')?.getAttribute("content")).toBe(
      "1"
    );
    expect(
      document.head.querySelector("script[data-site-code-head]")?.textContent
    ).toContain("__siteHead");

    applyHeadHtml("");
    expect(document.head.querySelector('meta[name="x-site-code"]')).toBeNull();
    expect(document.head.querySelector("script[data-site-code-head]")).toBeNull();
  });

  it("replaces the site script instead of stacking copies", () => {
    applyCustomScript("window.__siteJs = 1;");
    applyCustomScript("window.__siteJs = 2;");
    expect(document.querySelectorAll("#site-custom-js")).toHaveLength(1);
    expect(document.getElementById("site-custom-js")?.textContent).toContain("__siteJs = 2");
    removeCustomScript();
    expect(document.getElementById("site-custom-js")).toBeNull();
  });
});
