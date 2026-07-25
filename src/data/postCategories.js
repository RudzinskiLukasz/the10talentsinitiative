/** Canonical post sections / “tabs” for public pages + admin. */
export const DEFAULT_POST_CATEGORY = "Homilies/Reflections";

export const POST_CATEGORIES = [
  {
    id: "daily-reflections",
    value: DEFAULT_POST_CATEGORY,
    href: "/daily-reflections",
    labelKey: "nav.dailyReflections",
    isDefault: true,
  },
  {
    id: "t-talents-records",
    value: "T-Talents Records",
    href: "/t-talents-records",
    labelKey: "secondaryNav.tTalentsRecords",
  },
  {
    id: "t-talents-studios",
    value: "T-Talents Studios",
    href: "/t-talents-studios",
    labelKey: "secondaryNav.tTalentsStudios",
  },
  {
    id: "t-talents-series",
    value: "T-Talents Series",
    href: "/t-talents-series",
    labelKey: "secondaryNav.tTalentsSeries",
  },
  {
    id: "t-talents-sports",
    value: "T-Talents Sports",
    href: "/t-talents-sports",
    labelKey: "secondaryNav.tTalentsSports",
  },
];

export function getCategoryById(id) {
  return POST_CATEGORIES.find((c) => c.id === id) || null;
}

export function getCategoryByValue(value) {
  return POST_CATEGORIES.find((c) => c.value === value) || null;
}

export function getCategoryByHref(href) {
  return POST_CATEGORIES.find((c) => c.href === href) || null;
}

export function isPostCategoryHref(href) {
  return POST_CATEGORIES.some((c) => c.href === href);
}
