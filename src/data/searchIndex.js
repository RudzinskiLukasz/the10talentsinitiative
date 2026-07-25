import { site } from "./site.js";
import { MAIN_NAV, SECONDARY_NAV } from "../i18n/nav.js";
import { posts } from "./posts.js";
import i18n from "../i18n/index.js";

const PLACEHOLDER_PATHS = new Set([
  "/catholic-singles-forum",
  "/donations",
]);

function entry({ title, excerpt = "", path, section, category = "Page", comingSoon = false }) {
  return {
    title,
    excerpt,
    path,
    section,
    category,
    comingSoon,
    searchText: [title, excerpt, section, category].filter(Boolean).join(" ").toLowerCase(),
  };
}

function truncate(text, max = 120) {
  if (!text || text.length <= max) return text || "";
  return `${text.slice(0, max).trim()}…`;
}

export function buildSearchIndex(t, postList = posts) {
  const items = [];
  const comingSoon = t("common.comingSoon");
  const articles = Array.isArray(postList) ? postList : posts;

  for (const { key, href } of MAIN_NAV) {
    items.push(
      entry({
        title: t(`nav.${key}`),
        excerpt: t("site.name"),
        path: href,
        category: t("search.categories.navigation"),
      })
    );
  }

  for (const { key, href } of SECONDARY_NAV) {
    items.push(
      entry({
        title: t(`secondaryNav.${key}`),
        excerpt: PLACEHOLDER_PATHS.has(href) ? comingSoon : t("site.name"),
        path: href,
        category: t("search.categories.more"),
        comingSoon: PLACEHOLDER_PATHS.has(href),
      })
    );
  }

  const goals = t("goals", { returnObjects: true });
  const team = t("team", { returnObjects: true });
  const programsPage = t("programsPage", { returnObjects: true });
  const songsBooksPage = t("songsBooksPage", { returnObjects: true });

  items.push(
    entry({
      title: t("hero.title"),
      excerpt: t("hero.description"),
      path: "/contact",
      section: t("search.sections.hero"),
      category: t("search.categories.about"),
    }),
    entry({
      title: t("mission.eyebrow"),
      excerpt: t("mission.body"),
      path: "/contact#mission",
      section: t("search.sections.mission"),
      category: t("search.categories.about"),
    }),
    entry({
      title: t("goalsSection.title"),
      excerpt: goals.map((g) => g.title).join(". "),
      path: "/contact#goals",
      section: t("search.sections.goals"),
      category: t("search.categories.about"),
    }),
    entry({
      title: t("teamSection.title"),
      excerpt: t("teamSection.description"),
      path: "/contact#team",
      section: t("search.sections.team"),
      category: t("search.categories.about"),
    }),
    entry({
      title: t("join.title"),
      excerpt: t("join.body"),
      path: "/contact#join",
      section: t("search.sections.join"),
      category: t("search.categories.about"),
    }),
    entry({
      title: t("hero.title"),
      excerpt: t("hero.description"),
      path: "/",
      section: t("search.sections.home"),
      category: t("search.categories.home"),
    }),
    entry({
      title: t("hero.quote"),
      excerpt: t("hero.quoteAttribution"),
      path: "/",
      section: t("search.sections.hero"),
      category: t("search.categories.home"),
    }),
    entry({
      title: t("homePage.introTitle"),
      excerpt: t("homePage.introBody"),
      path: "/",
      section: t("search.sections.about"),
      category: t("search.categories.home"),
    })
  );

  for (const member of team) {
    items.push(
      entry({
        title: member.name,
        excerpt: member.role,
        path: "/contact#team",
        section: t("search.sections.team"),
        category: t("search.categories.team"),
      })
    );
  }

  for (const goal of goals) {
    items.push(
      entry({
        title: goal.title,
        excerpt: goal.points.join(" "),
        path: "/contact#goals",
        section: t("search.sections.goals"),
        category: t("search.categories.goals"),
      })
    );
  }

  items.push(
    entry({
      title: programsPage.title,
      excerpt: programsPage.intro,
      path: "/programs",
      category: t("search.categories.programs"),
    })
  );

  for (const pillar of programsPage.pillars) {
    items.push(
      entry({
        title: pillar.name,
        excerpt: pillar.intro,
        path: "/programs",
        section: t("search.sections.programs"),
        category: t("search.categories.programs"),
      })
    );
    for (const program of pillar.programs) {
      items.push(
        entry({
          title: program.title,
          excerpt: truncate(program.body || program.aim || ""),
          path: "/programs",
          section: pillar.name,
          category: t("search.categories.programs"),
        })
      );
    }
  }

  for (const event of programsPage.upcomingEvents) {
    items.push(
      entry({
        title: event.title,
        excerpt: event.details.join(" "),
        path: "/programs",
        section: t("search.sections.upcomingEvents"),
        category: t("search.categories.events"),
      })
    );
  }

  items.push(
    entry({
      title: t("dailyReflectionsPage.title"),
      excerpt: t("search.sections.dailyReflectionsExcerpt"),
      path: "/daily-reflections",
      category: t("search.categories.reflections"),
    }),
    entry({
      title: t("eventsPage.title"),
      excerpt: t("eventsPage.intro"),
      path: "/events",
      category: t("search.categories.events"),
    }),
    entry({
      title: songsBooksPage.title,
      excerpt: songsBooksPage.intro,
      path: "/songs-books",
      category: t("search.categories.resources"),
    })
  );

  for (const item of songsBooksPage.items) {
    items.push(
      entry({
        title: item.title,
        excerpt: truncate(item.description || item.subtitle || ""),
        path: "/songs-books",
        section: songsBooksPage.releasesTitle,
        category: t("search.categories.resources"),
      })
    );
  }

  items.push(
    entry({
      title: t("contactPage.title"),
      excerpt: t("contactPage.intro"),
      path: "/contact",
      category: t("search.categories.contact"),
    }),
    entry({
      title: t("donationsPage.title"),
      excerpt: t("donationsPage.intro"),
      path: "/donations",
      category: t("search.categories.donations"),
      comingSoon: true,
    }),
    entry({
      title: t("search.sections.upcomingProgramsTitle"),
      excerpt: t("search.sections.upcomingProgramsExcerpt"),
      path: "/upcoming-programs",
      category: t("search.categories.programs"),
    }),
    entry({
      title: t("pages.privacyPolicy.title"),
      excerpt: t("search.sections.privacyExcerpt"),
      path: "/privacy-policy",
      category: t("search.categories.legal"),
    }),
    entry({
      title: t("pages.cookiePolicy.title"),
      excerpt: t("search.sections.cookieExcerpt"),
      path: "/cookie-policy-eu",
      category: t("search.categories.legal"),
    })
  );

  for (const post of articles) {
    const translated = t(`posts.bySlug.${post.slug}`, { returnObjects: true, defaultValue: {} });
    const title = translated.title || post.title;
    const excerpt = truncate(translated.excerpt || post.excerpt || post.content);
    items.push(
      entry({
        title,
        excerpt,
        path: `/${post.slug}`,
        category: t("search.categories.article"),
      })
    );
  }

  return items;
}

export function searchContent(query, limit = 8, t = i18n.t.bind(i18n), postList = posts) {
  const searchEntries = buildSearchIndex(t, postList);
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const terms = trimmed.split(/\s+/).filter(Boolean);

  const scored = searchEntries
    .map((item) => {
      const titleLower = item.title.toLowerCase();
      let score = 0;

      if (titleLower === trimmed) score += 100;
      else if (titleLower.startsWith(trimmed)) score += 50;
      else if (titleLower.includes(trimmed)) score += 25;

      const allTermsMatch = terms.every((term) => item.searchText.includes(term));
      if (!allTermsMatch) return null;

      for (const term of terms) {
        if (titleLower.includes(term)) score += 10;
        if (item.excerpt.toLowerCase().includes(term)) score += 3;
      }

      return { item, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));

  const seen = new Set();
  const results = [];

  for (const { item } of scored) {
    const key = `${item.path}::${item.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(item);
    if (results.length >= limit) break;
  }

  return results;
}

export const searchEntries = buildSearchIndex(i18n.t.bind(i18n));
