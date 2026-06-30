/**
 * Generates src/i18n/locales/en.json from content.js and UI strings.
 * Run: node scripts/extract-en-locale.mjs
 */
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join as pathJoin } from "path";
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
  join as joinSection,
  homePage,
  programsPage,
  dailyReflectionsPage,
  eventsPage,
  songsBooksPage,
  contactPage,
  donationsPage,
  donationFailedPage,
  stats,
} from "../src/data/content.js";
import { posts } from "../src/data/posts.js";
import { privacyPolicy, cookiePolicy } from "../src/data/policies.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const navKeys = [
  "home",
  "programs",
  "dailyReflections",
  "events",
  "songsBooks",
  "contact",
];
const secondaryKeys = [
  "tTalentsRecords",
  "tTalentsStudios",
  "tTalentsSeries",
  "tTalentsSports",
  "catholicSinglesForum",
  "donations",
];

const nav = Object.fromEntries(
  mainNav.map((item, i) => [navKeys[i], item.label])
);
const secondaryNavLabels = Object.fromEntries(
  secondaryNav.map((item, i) => [secondaryKeys[i], item.label])
);

const postsBySlug = Object.fromEntries(
  posts.map((p) => [
    p.slug,
    { title: p.title, excerpt: p.excerpt || p.content.slice(0, 200) },
  ])
);

const locale = {
  site: { name: site.name },
  nav,
  secondaryNav: secondaryNavLabels,
  common: {
    readMore: "Read more →",
    comingSoon: "Coming soon",
    discoverMore: "Discover More",
    exploreAll: "Explore All",
    aboutUsContact: "About Us & Contact →",
    discoverPrograms: "Discover Our Programs",
    discoverProgramsArrow: "Discover Our Programs →",
    seeOurGoals: "See our goals",
    meetTheTeam: "Meet the team →",
    contactUs: "Contact Us",
    aim: "Aim:",
    email: "Email:",
    submit: "Submit",
    tryAgain: "Try again",
    returnHome: "Return home",
    pageNotFound: "Page not found",
    backToAnnouncements: "← Back to announcements",
    download: "Download",
    exploreMore: "Explore More",
    faithGiftsCommunity: "Faith • Gifts • Community",
    homiliesCategory: "Homilies/Reflections",
    menu: "Menu",
    more: "More",
    toggleMenu: "Toggle menu",
    searching: "Searching…",
    noResults: "No results found",
    openSearch: "Open search",
    closeSearch: "Close search",
    searchSite: "Search site content",
    searchResults: "Search results",
    searchPlaceholder: "Search…",
    themeStyle: "Theme style",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    language: "Language",
    contentComingSoon: "Content for this section is coming soon.",
    thankYouMessage:
      "Thank you for your message. We will come back to you as soon as possible.",
    name: "Name",
    emailLabel: "Email",
    subject: "Subject",
    message: "Message",
    required: "*",
  },
  footer: {
    tagline:
      "Nurturing the God-given gifts of Catholic youth — for Christ and His Church.",
    explore: "Explore",
    getInTouch: "Get In Touch",
    privacyPolicy: "Privacy Policy",
    cookiePolicy: "Cookie Policy (EU)",
    region: "Nigeria • Africa • Beyond",
    copyright: "© {{year}} The Ten Talents Initiative. All rights reserved.",
    quote: '"To each according to his ability." — Matthew 25:15',
  },
  languages: {
    en: "English",
    de: "Deutsch",
    es: "Español",
    fr: "Français",
    it: "Italiano",
    pt: "Português",
    pl: "Polski",
    zh: "中文",
  },
  themes: {
    extendable: "Extendable theme",
    paperGlass: "Paper glass theme",
    ona: "Ona theme",
  },
  search: {
    categories: {
      navigation: "Navigation",
      more: "More",
      about: "About",
      home: "Home",
      team: "Team",
      goals: "Goals",
      programs: "Programs",
      events: "Events",
      reflections: "Reflections",
      resources: "Resources",
      contact: "Contact",
      donations: "Donations",
      legal: "Legal",
      article: "Article",
    },
    sections: {
      hero: "Hero",
      mission: "Mission",
      goals: "Goals",
      team: "Team",
      join: "Join",
      about: "About",
      home: "Home",
      programs: "Programs",
      upcomingEvents: "Upcoming events",
      dailyReflectionsExcerpt: "Daily faith reflections and homilies",
      upcomingProgramsTitle: "Upcoming Programs",
      upcomingProgramsExcerpt:
        "Discover upcoming workshops and mentorship sessions",
      privacyExcerpt: "How we handle your data",
      cookieExcerpt: "Cookie usage and preferences",
    },
  },
  hero,
  mission,
  teamSection,
  team: team.map(({ name, role }) => ({ name, role })),
  goalsSection,
  goals,
  join: joinSection,
  homePage,
  programsPage,
  dailyReflectionsPage,
  eventsPage,
  songsBooksPage,
  contactPage: {
    title: contactPage.title,
    intro: contactPage.intro,
    social: contactPage.social.map((s) => s.label),
  },
  donationsPage,
  donationFailedPage,
  stats,
  pages: {
    upcomingPrograms: {
      title: "Announcements and Upcoming programs",
    },
    donationConfirmation: { title: "Donation Confirmation" },
    donorDashboard: { title: "Donor Dashboard" },
    privacyPolicy: { title: "Privacy Policy" },
    cookiePolicy: { title: "Cookie Policy" },
    tp: { title: "Tp" },
  },
  posts: {
    category: "Homilies/Reflections",
    bySlug: postsBySlug,
  },
  policies: {
    privacy: privacyPolicy,
    cookie: cookiePolicy,
  },
};

const outPath = pathJoin(__dirname, "../src/i18n/locales/en.json");
writeFileSync(outPath, JSON.stringify(locale, null, 2) + "\n");
console.log(`Wrote ${outPath} (${Object.keys(locale).length} top-level keys)`);
