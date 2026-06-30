import { useTranslation } from "react-i18next";

const MAIN_NAV = [
  { key: "home", href: "/" },
  { key: "programs", href: "/programs" },
  { key: "dailyReflections", href: "/daily-reflections" },
  { key: "events", href: "/events" },
  { key: "songsBooks", href: "/songs-books" },
  { key: "contact", href: "/contact" },
];

const SECONDARY_NAV = [
  { key: "tTalentsRecords", href: "/t-talents-records" },
  { key: "tTalentsStudios", href: "/t-talents-studios" },
  { key: "tTalentsSeries", href: "/t-talents-series" },
  { key: "tTalentsSports", href: "/t-talents-sports" },
  { key: "catholicSinglesForum", href: "/catholic-singles-forum" },
  { key: "donations", href: "/donations" },
];

export function useMainNav() {
  const { t } = useTranslation();
  return MAIN_NAV.map((item) => ({
    label: t(`nav.${item.key}`),
    href: item.href,
  }));
}

export function useSecondaryNav() {
  const { t } = useTranslation();
  return SECONDARY_NAV.map((item) => ({
    label: t(`secondaryNav.${item.key}`),
    href: item.href,
  }));
}

export function usePlaceholderTitle(href) {
  const { t } = useTranslation();
  const item = SECONDARY_NAV.find((n) => n.href === href);
  return item ? t(`secondaryNav.${item.key}`) : "";
}

export { MAIN_NAV, SECONDARY_NAV };
