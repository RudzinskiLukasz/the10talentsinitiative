/**
 * Applies per-language string maps to en.json and writes locale files.
 * Run: node scripts/build-locales.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(
  readFileSync(join(__dirname, "../src/i18n/locales/en.json"), "utf8")
);

function translateValue(value, map) {
  if (typeof value === "string") {
    return Object.prototype.hasOwnProperty.call(map, value) ? map[value] : value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => translateValue(item, map));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, translateValue(v, map)])
    );
  }
  return value;
}

const langs = ["de", "es", "fr", "it", "pt", "pl", "zh"];

for (const lang of langs) {
  const mapPath = join(__dirname, "translations", `${lang}.json`);
  const map = JSON.parse(readFileSync(mapPath, "utf8"));
  const translated = translateValue(en, map);
  const outPath = join(__dirname, "../src/i18n/locales", `${lang}.json`);
  writeFileSync(outPath, JSON.stringify(translated, null, 2) + "\n");
  console.log(`Wrote ${outPath}`);
}
