import { describe, expect, it } from "vitest";
import {
  EMPTY_HOMEPAGE_CONTENT,
  mergeHomepageContent,
  normalizeHomepageContent,
} from "./homepageContent.js";
import { HERO_BACKGROUNDS } from "./heroBackgrounds.js";

describe("homepageContent", () => {
  it("normalizes missing and invalid payloads", () => {
    expect(normalizeHomepageContent(null)).toEqual(EMPTY_HOMEPAGE_CONTENT);
    expect(normalizeHomepageContent({ hero: "nope", programTeasers: [null] })).toEqual(
      {
        ...EMPTY_HOMEPAGE_CONTENT,
        programTeasers: [],
      }
    );
  });

  it("merges non-empty CMS fields over defaults", () => {
    const defaults = {
      hero: {
        quote: "Default quote",
        quoteAttribution: "Default attr",
        title: "Default title",
        description: "Default description",
      },
      discoverMoreHref: "/programs",
      introTitle: "Default intro",
      introBody: "Default body",
      announcementsTitle: "Announcements",
      announcementsIntro: "Intro",
      programsTitle: "Programs",
      programsIntro: "Programs intro",
      programTeasers: [{ title: "A", description: "B" }],
      donateTitle: "Donate",
      donateBody: "Please donate",
      donateCta: "Give",
      bankDetails: "BANK",
      heroImages: HERO_BACKGROUNDS,
    };

    const merged = mergeHomepageContent(
      {
        hero: { quote: "CMS quote", title: "  " },
        introTitle: "CMS intro",
        programTeasers: [{ title: "Workshop", description: "Learn media" }],
        heroImages: [{ src: "/custom.jpg", alt: "Custom" }],
      },
      defaults
    );

    expect(merged.hero.quote).toBe("CMS quote");
    expect(merged.hero.title).toBe("Default title");
    expect(merged.introTitle).toBe("CMS intro");
    expect(merged.introBody).toBe("Default body");
    expect(merged.programTeasers).toEqual([
      { title: "Workshop", description: "Learn media" },
    ]);
    expect(merged.heroImages).toEqual([{ src: "/custom.jpg", alt: "Custom" }]);
  });

  it("falls back to default hero images when CMS list is empty", () => {
    const merged = mergeHomepageContent(
      { heroImages: [] },
      { heroImages: HERO_BACKGROUNDS }
    );
    expect(merged.heroImages).toEqual(HERO_BACKGROUNDS);
  });
});
