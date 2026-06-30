/**
 * Professional translations for all locale strings (index-aligned with en-strings.json).
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { translateCookiePolicy, translatePrivacyPolicy } from "./policy-translate.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const enStrings = JSON.parse(
  readFileSync(join(__dirname, "../en-strings.json"), "utf8")
);

const LANG_ARRAYS = JSON.parse(
  readFileSync(join(__dirname, "lang-data.json"), "utf8")
);

const POLICY_INDICES = { cookie: 242, privacy: 270 };

/**
 * @param {string} lang
 * @returns {string[]}
 */
export function buildLanguageBundle(lang) {
  const table = LANG_ARRAYS[lang];
  if (!table) {
    throw new Error(`No lang-data for "${lang}"`);
  }
  if (table.length !== enStrings.length) {
    throw new Error(
      `${lang}: expected ${enStrings.length} strings, got ${table.length}`
    );
  }

  return enStrings.map((english, index) => {
    if (index === POLICY_INDICES.cookie) {
      return translateCookiePolicy(lang, english);
    }
    if (index === POLICY_INDICES.privacy) {
      return translatePrivacyPolicy(lang, english);
    }
    const translated = table[index];
    if (translated === undefined) {
      throw new Error(`Missing ${lang} translation at index ${index}`);
    }
    return translated;
  });
}
