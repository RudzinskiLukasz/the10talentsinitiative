/**
 * Builds lang-data.json from embedded professional translation tables.
 * Run: node scripts/translation-data/create-lang-data.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(readFileSync(join(__dirname, "../en-strings.json"), "utf8"));
const langs = ["de", "es", "fr", "it", "pt", "pl", "zh"];

/** @type {Record<string, Record<string, string>>} */
const BY_ENGLISH = JSON.parse(
  readFileSync(join(__dirname, "by-english.json"), "utf8")
);

/** @type {Record<string, Record<number, string>>} */
const BY_INDEX = JSON.parse(
  readFileSync(join(__dirname, "by-index.json"), "utf8")
);

function keepOriginal(text) {
  if (!text) return true;
  if (/^[\$]?\d/.test(text)) return true;
  if (text.startsWith("/")) return true;
  if (text === "*" || text === "∞") return true;
  if (/^(Deutsch|Español|Français|Italiano|Português|Polski|English|中文)$/.test(text))
    return true;
  if (/^(Facebook|TikTok|WhatsApp|Mail|Tp|Pro)$/.test(text)) return true;
  if (/^(Miss |Mr\. |Mrs\. |Rev\.)/.test(text)) return true;
  if (text.includes("Dialnet-")) return true;
  if (/^\d{4}$/.test(text) || text === "8") return true;
  return false;
}

/** @type {Record<string, string[]>} */
const langData = {};

for (const lang of langs) {
  langData[lang] = en.map((english, index) => {
    if (BY_INDEX[lang]?.[String(index)]) {
      return BY_INDEX[lang][String(index)];
    }
    if (BY_ENGLISH[english]?.[lang]) {
      return BY_ENGLISH[english][lang];
    }
    if (keepOriginal(english)) {
      return english;
    }
    throw new Error(`Missing ${lang} translation for index ${index}: ${english.slice(0, 60)}…`);
  });
}

writeFileSync(
  join(__dirname, "lang-data.json"),
  JSON.stringify(langData, null, 2) + "\n"
);
console.log("Wrote lang-data.json");
