import {
  site,
  mainNav,
  secondaryNav,
  hero,
  mission,
  teamSection,
  team,
  goalsSection,
  goals,
  join,
  homePage,
  programsPage,
  dailyReflectionsPage,
  eventsPage,
  songsBooksPage,
  contactPage,
  donationsPage,
} from "./content.js";
import { posts } from "./posts.js";

const PLACEHOLDER_PATHS = new Set([
  "/t-talents-records",
  "/t-talents-studios",
  "/t-talents-series",
  "/t-talents-sports",
  "/catholic-singles-forum",
  "/donations",
]);

function entry({ title, excerpt = "", path, section, category = "Page" }) {
  const comingSoon = PLACEHOLDER_PATHS.has(path.split("#")[0]);
  return {
    title,
    excerpt: comingSoon ? "Coming soon" : excerpt,
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

function buildSearchIndex() {
  const items = [];

  for (const { label, href } of mainNav) {
    items.push(
      entry({
        title: label,
        excerpt: site.name,
        path: href,
        category: "Navigation",
      })
    );
  }

  for (const { label, href } of secondaryNav) {
    items.push(
      entry({
        title: label,
        excerpt: PLACEHOLDER_PATHS.has(href) ? "Coming soon" : site.name,
        path: href,
        category: "More",
      })
    );
  }

  items.push(
    entry({
      title: hero.title,
      excerpt: hero.description,
      path: "/contact",
      section: "Hero",
      category: "About",
    }),
    entry({
      title: mission.eyebrow,
      excerpt: mission.body,
      path: "/contact#mission",
      section: "Mission",
      category: "About",
    }),
    entry({
      title: goalsSection.title,
      excerpt: goals.map((g) => g.title).join(". "),
      path: "/contact#goals",
      section: "Goals",
      category: "About",
    }),
    entry({
      title: teamSection.title,
      excerpt: teamSection.description,
      path: "/contact#team",
      section: "Team",
      category: "About",
    }),
    entry({
      title: join.title,
      excerpt: join.body,
      path: "/contact#join",
      section: "Join",
      category: "About",
    }),
    entry({
      title: homePage.hero,
      excerpt: homePage.introBody,
      path: "/",
      section: "Home",
      category: "Home",
    }),
    entry({
      title: homePage.introTitle,
      excerpt: homePage.introBody,
      path: "/",
      section: "About",
      category: "Home",
    })
  );

  for (const member of team) {
    items.push(
      entry({
        title: member.name,
        excerpt: member.role,
        path: "/contact#team",
        section: "Team",
        category: "Team",
      })
    );
  }

  for (const goal of goals) {
    items.push(
      entry({
        title: goal.title,
        excerpt: goal.points.join(" "),
        path: "/contact#goals",
        section: "Goals",
        category: "Goals",
      })
    );
  }

  items.push(
    entry({
      title: programsPage.title,
      excerpt: programsPage.intro,
      path: "/programs",
      category: "Programs",
    })
  );

  for (const pillar of programsPage.pillars) {
    items.push(
      entry({
        title: pillar.name,
        excerpt: pillar.intro,
        path: "/programs",
        section: "Programs",
        category: "Programs",
      })
    );
    for (const program of pillar.programs) {
      items.push(
        entry({
          title: program.title,
          excerpt: truncate(program.body || program.aim || ""),
          path: "/programs",
          section: pillar.name,
          category: "Programs",
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
        section: "Upcoming events",
        category: "Events",
      })
    );
  }

  items.push(
    entry({
      title: dailyReflectionsPage.title,
      excerpt: "Daily faith reflections and homilies",
      path: "/daily-reflections",
      category: "Reflections",
    }),
    entry({
      title: eventsPage.title,
      excerpt: eventsPage.intro,
      path: "/events",
      category: "Events",
    }),
    entry({
      title: songsBooksPage.title,
      excerpt: songsBooksPage.intro,
      path: "/songs-books",
      category: "Resources",
    })
  );

  for (const item of songsBooksPage.items) {
    items.push(
      entry({
        title: item.title,
        excerpt: truncate(item.description || item.subtitle || ""),
        path: "/songs-books",
        section: songsBooksPage.releasesTitle,
        category: "Resources",
      })
    );
  }

  items.push(
    entry({
      title: contactPage.title,
      excerpt: contactPage.intro,
      path: "/contact",
      category: "Contact",
    }),
    entry({
      title: donationsPage.title,
      excerpt: donationsPage.intro,
      path: "/donations",
      category: "Donations",
    }),
    entry({
      title: "Upcoming Programs",
      excerpt: "Discover upcoming workshops and mentorship sessions",
      path: "/upcoming-programs",
      category: "Programs",
    }),
    entry({
      title: "Privacy Policy",
      excerpt: "How we handle your data",
      path: "/privacy-policy",
      category: "Legal",
    }),
    entry({
      title: "Cookie Policy",
      excerpt: "Cookie usage and preferences",
      path: "/cookie-policy-eu",
      category: "Legal",
    })
  );

  for (const post of posts) {
    items.push(
      entry({
        title: post.title,
        excerpt: truncate(post.excerpt || post.content),
        path: `/${post.slug}`,
        category: "Article",
      })
    );
  }

  return items;
}

export const searchEntries = buildSearchIndex();

export function searchContent(query, limit = 8) {
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
