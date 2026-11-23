import { HERO_BACKGROUNDS } from "./heroBackgrounds.js";

/** Empty CMS shape used by the admin editor and merge helpers. */
export const EMPTY_HOMEPAGE_CONTENT = {
  hero: {
    quote: "",
    quoteAttribution: "",
    title: "",
    description: "",
  },
  discoverMoreHref: "",
  introTitle: "",
  introBody: "",
  announcementsTitle: "",
  announcementsIntro: "",
  programsTitle: "",
  programsIntro: "",
  programTeasers: [],
  donateTitle: "",
  donateBody: "",
  donateCta: "",
  bankDetails: "",
  heroImages: [],
};

function asString(value) {
  return typeof value === "string" ? value : "";
}

function normalizeTeaser(item) {
  if (!item || typeof item !== "object") return null;
  return {
    title: asString(item.title),
    description: asString(item.description),
  };
}

function normalizeHeroImage(item) {
  if (!item || typeof item !== "object") return null;
  const src = asString(item.src).trim();
  if (!src) return null;
  return {
    src,
    alt: asString(item.alt),
  };
}

/** Normalize a raw CMS jsonb payload into a safe content object. */
export function normalizeHomepageContent(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const hero = source.hero && typeof source.hero === "object" ? source.hero : {};
  const teasers = Array.isArray(source.programTeasers)
    ? source.programTeasers.map(normalizeTeaser).filter(Boolean)
    : [];
  const images = Array.isArray(source.heroImages)
    ? source.heroImages.map(normalizeHeroImage).filter(Boolean)
    : [];

  return {
    hero: {
      quote: asString(hero.quote),
      quoteAttribution: asString(hero.quoteAttribution),
      title: asString(hero.title),
      description: asString(hero.description),
    },
    discoverMoreHref: asString(source.discoverMoreHref),
    introTitle: asString(source.introTitle),
    introBody: asString(source.introBody),
    announcementsTitle: asString(source.announcementsTitle),
    announcementsIntro: asString(source.announcementsIntro),
    programsTitle: asString(source.programsTitle),
    programsIntro: asString(source.programsIntro),
    programTeasers: teasers,
    donateTitle: asString(source.donateTitle),
    donateBody: asString(source.donateBody),
    donateCta: asString(source.donateCta),
    bankDetails: asString(source.bankDetails),
    heroImages: images,
  };
}

function pickText(cmsValue, fallback) {
  const value = asString(cmsValue).trim();
  return value || fallback;
}

/**
 * Merge CMS overrides with i18n/static defaults.
 * Non-empty CMS strings win; empty fields keep the translated defaults.
 */
export function mergeHomepageContent(cms, defaults) {
  const content = normalizeHomepageContent(cms);
  const fallback = defaults || {};
  const fallbackHero = fallback.hero || {};
  const fallbackTeasers = Array.isArray(fallback.programTeasers)
    ? fallback.programTeasers
    : [];
  const fallbackImages =
    Array.isArray(fallback.heroImages) && fallback.heroImages.length
      ? fallback.heroImages
      : HERO_BACKGROUNDS;

  return {
    hero: {
      quote: pickText(content.hero.quote, fallbackHero.quote || ""),
      quoteAttribution: pickText(
        content.hero.quoteAttribution,
        fallbackHero.quoteAttribution || ""
      ),
      title: pickText(content.hero.title, fallbackHero.title || ""),
      description: pickText(
        content.hero.description,
        fallbackHero.description || ""
      ),
    },
    discoverMoreHref: pickText(
      content.discoverMoreHref,
      fallback.discoverMoreHref || "/programs"
    ),
    introTitle: pickText(content.introTitle, fallback.introTitle || ""),
    introBody: pickText(content.introBody, fallback.introBody || ""),
    announcementsTitle: pickText(
      content.announcementsTitle,
      fallback.announcementsTitle || ""
    ),
    announcementsIntro: pickText(
      content.announcementsIntro,
      fallback.announcementsIntro || ""
    ),
    programsTitle: pickText(content.programsTitle, fallback.programsTitle || ""),
    programsIntro: pickText(content.programsIntro, fallback.programsIntro || ""),
    programTeasers: content.programTeasers.length
      ? content.programTeasers
      : fallbackTeasers,
    donateTitle: pickText(content.donateTitle, fallback.donateTitle || ""),
    donateBody: pickText(content.donateBody, fallback.donateBody || ""),
    donateCta: pickText(content.donateCta, fallback.donateCta || ""),
    bankDetails: pickText(content.bankDetails, fallback.bankDetails || ""),
    heroImages: content.heroImages.length ? content.heroImages : fallbackImages,
  };
}
