import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HERO_BACKGROUNDS } from "../data/heroBackgrounds.js";
import {
  EMPTY_HOMEPAGE_CONTENT,
  mergeHomepageContent,
} from "../data/homepageContent.js";
import { fetchHomepageContent } from "../lib/homepageApi.js";
import { isSupabaseConfigured } from "../lib/supabase.js";

function buildI18nDefaults(t) {
  const programTeasers = t("homePage.programTeasers", { returnObjects: true });
  return {
    hero: {
      quote: t("hero.quote"),
      quoteAttribution: t("hero.quoteAttribution"),
      title: t("hero.title"),
      description: t("hero.description"),
    },
    discoverMoreHref: t("homePage.discoverMoreHref"),
    introTitle: t("homePage.introTitle"),
    introBody: t("homePage.introBody"),
    announcementsTitle: t("homePage.announcementsTitle"),
    announcementsIntro: t("homePage.announcementsIntro"),
    programsTitle: t("homePage.programsTitle"),
    programsIntro: t("homePage.programsIntro"),
    programTeasers: Array.isArray(programTeasers) ? programTeasers : [],
    donateTitle: t("homePage.donateTitle"),
    donateBody: t("homePage.donateBody"),
    donateCta: t("homePage.donateCta"),
    bankDetails: t("homePage.bankDetails"),
    heroImages: HERO_BACKGROUNDS,
  };
}

/** Live homepage copy + hero images (CMS overrides with i18n fallback). */
export function useHomepageContent() {
  const { t } = useTranslation();
  const [cms, setCms] = useState(EMPTY_HOMEPAGE_CONTENT);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!isSupabaseConfigured) {
      setCms(EMPTY_HOMEPAGE_CONTENT);
      setLoading(false);
      return undefined;
    }

    function load({ silent = false } = {}) {
      if (!silent) setLoading(true);
      return fetchHomepageContent()
        .then((content) => {
          if (!active) return;
          setCms(content);
          setError(null);
        })
        .catch((err) => {
          if (!active) return;
          setError(err);
          if (!silent) setCms(EMPTY_HOMEPAGE_CONTENT);
        })
        .finally(() => {
          if (active && !silent) setLoading(false);
        });
    }

    load();

    const onVisible = () => {
      if (document.visibilityState === "visible") load({ silent: true });
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      active = false;
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, []);

  const content = mergeHomepageContent(cms, buildI18nDefaults(t));

  return { content, loading, error };
}
