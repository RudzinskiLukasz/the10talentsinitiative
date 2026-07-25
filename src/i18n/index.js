import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import de from "./locales/de.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import pt from "./locales/pt.json";
import pl from "./locales/pl.json";
import zh from "./locales/zh.json";

export const STORAGE_KEY = "ttt-lang";

export const SUPPORTED_LANGUAGES = [
  { code: "en", labelKey: "languages.en" },
  { code: "de", labelKey: "languages.de" },
  { code: "es", labelKey: "languages.es" },
  { code: "fr", labelKey: "languages.fr" },
  { code: "it", labelKey: "languages.it" },
  { code: "pt", labelKey: "languages.pt" },
  { code: "pl", labelKey: "languages.pl" },
  { code: "zh", labelKey: "languages.zh" },
];

const SUPPORTED_CODES = new Set(SUPPORTED_LANGUAGES.map((l) => l.code));

function getStoredLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_CODES.has(stored)) return stored;
  } catch {
    /* ignore */
  }
  return null;
}

function resolveInitialLanguage() {
  return getStoredLanguage() ?? "en";
}

export function setDocumentLanguage(lng) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
}

export function persistLanguage(lng) {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* ignore */
  }
  setDocumentLanguage(lng);
}

const initialLng = resolveInitialLanguage();
setDocumentLanguage(initialLng);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    es: { translation: es },
    fr: { translation: fr },
    it: { translation: it },
    pt: { translation: pt },
    pl: { translation: pl },
    zh: { translation: zh },
  },
  lng: initialLng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  persistLanguage(lng);
});

export default i18n;
