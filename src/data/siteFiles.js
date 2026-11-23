/** Editable theme files. Keep paths in sync with supabase/migrations/004_site_files.sql */

export const MAX_SITE_FILE_CHARS = 200_000;

const PAGES = [
  ["/", "home.html", "Home"],
  ["/programs", "programs.html", "Programs"],
  ["/daily-reflections", "daily-reflections.html", "Daily Reflections"],
  ["/events", "events.html", "Events"],
  ["/songs-books", "songs-books.html", "Songs & Books"],
  ["/contact", "contact.html", "Contact"],
  ["/t-talents-records", "t-talents-records.html", "T-Talents Records"],
  ["/t-talents-studios", "t-talents-studios.html", "T-Talents Studios"],
  ["/t-talents-series", "t-talents-series.html", "T-Talents Series"],
  ["/t-talents-sports", "t-talents-sports.html", "T-Talents Sports"],
  ["/catholic-singles-forum", "catholic-singles-forum.html", "Catholic Singles Forum"],
  ["/catholic-poets-collective", "catholic-poets-collective.html", "Catholic Poets Collective"],
  ["/catholic-composers", "catholic-composers.html", "Catholic Composers"],
  ["/tti-spirituality-unit", "tti-spirituality-unit.html", "TTI Spirituality Unit"],
  ["/donations", "donations.html", "Donations"],
  ["/upcoming-programs", "upcoming-programs.html", "Upcoming Programs"],
  ["/privacy-policy", "privacy-policy.html", "Privacy Policy"],
  ["/cookie-policy-eu", "cookie-policy.html", "Cookie Policy"],
];

export const SITE_FILES = [
  {
    path: "custom.css",
    label: "custom.css",
    group: "Theme",
    language: "css",
    title: "Additional CSS",
    description:
      "CSS added on every public page, after the built-in stylesheet. Same role as Additional CSS in the WordPress customizer.",
    example: ".site-code-html h2 { letter-spacing: 0.02em; }",
  },
  {
    path: "custom.js",
    label: "custom.js",
    group: "Theme",
    language: "javascript",
    title: "Site script",
    description:
      "JavaScript that runs on every public page after load. It does not run in the admin panel. A syntax error here can break other scripts on the page.",
    example: 'document.documentElement.dataset.customCode = "on";',
  },
  {
    path: "head.html",
    label: "head.html",
    group: "Theme",
    language: "html",
    title: "Document head",
    description:
      "Markup inserted into the document head on public pages: meta tags, font or analytics snippets.",
    example: '<meta name="author" content="The Ten Talents Initiative" />',
  },
  {
    path: "header.html",
    label: "header.html",
    group: "Theme",
    language: "html",
    title: "Header",
    description:
      "HTML shown on every public page, directly under the navigation. Use a fragment, not a full document.",
    example: "<aside><p>Announcement for every page.</p></aside>",
  },
  {
    path: "footer.html",
    label: "footer.html",
    group: "Theme",
    language: "html",
    title: "Footer",
    description:
      "HTML shown on every public page, below the page content and above the site footer.",
    example: "<p>Extra note above the footer.</p>",
  },
  ...PAGES.map(([route, filename, title]) => ({
    path: `pages/${filename}`,
    label: filename,
    group: "Pages",
    language: "html",
    title,
    route,
    description: `HTML added on the ${title} page, after the existing page content. The built-in layout stays in place.`,
    example: `<section><h2>${title}</h2><p>Extra section from the theme editor.</p></section>`,
  })),
];

const BY_PATH = new Map(SITE_FILES.map((file) => [file.path, file]));

export function getSiteFile(path) {
  return BY_PATH.get(path) || null;
}

export function assertSiteFilePath(path) {
  if (!getSiteFile(path)) {
    throw new Error("That file cannot be edited from the admin panel.");
  }
}

export function siteFilesByGroup() {
  const groups = [];
  for (const file of SITE_FILES) {
    let group = groups.find((item) => item.name === file.group);
    if (!group) {
      group = { name: file.group, files: [] };
      groups.push(group);
    }
    group.files.push(file);
  }
  return groups;
}

export function normalizePathname(pathname) {
  if (!pathname) return "/";
  const path = String(pathname).split("?")[0].split("#")[0];
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path || "/";
}

export function siteFileForRoute(pathname) {
  const path = normalizePathname(pathname);
  return SITE_FILES.find((file) => file.route === path) || null;
}

/** Stop a CSS file from closing the style tag early. */
export function escapeStyleContent(css) {
  return String(css ?? "").replace(/<\/style/gi, "<\\/style");
}

export function hasVisibleMarkup(html) {
  const stripped = String(html || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
  return stripped.length > 0;
}

export function markupWithoutScripts(html) {
  return String(html || "").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}
