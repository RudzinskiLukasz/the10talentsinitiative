/**
 * Seeds translation bundle JSON files used by generate-translation-maps.mjs.
 * Run: node scripts/translation-data/seed-translations.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { buildLanguageBundle } from "./translate-all.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const langs = ["de", "es", "fr", "it", "pt", "pl", "zh"];

for (const lang of langs) {
  const bundle = buildLanguageBundle(lang);
  const outPath = join(__dirname, `${lang}.bundle.json`);
  writeFileSync(outPath, JSON.stringify(bundle, null, 2) + "\n");
  console.log(`Wrote ${outPath} (${bundle.length} strings)`);
}
