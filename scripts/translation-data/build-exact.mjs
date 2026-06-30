/**
 * Builds exact-by-string.json with full-string professional translations.
 * Run: node scripts/translation-data/build-exact.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { EXACT_BY_STRING } from "./exact-translations.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(readFileSync(join(__dirname, "../en-strings.json"), "utf8"));

const exact = {};
for (const english of en) {
  if (!EXACT_BY_STRING[english]) {
    throw new Error(`Missing exact translation for: ${english.slice(0, 80)}`);
  }
  exact[english] = EXACT_BY_STRING[english];
}

writeFileSync(
  join(__dirname, "exact-by-string.json"),
  JSON.stringify(exact, null, 2) + "\n"
);
console.log(`Wrote exact-by-string.json (${Object.keys(exact).length} strings)`);
