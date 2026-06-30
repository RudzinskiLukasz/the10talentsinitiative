/**
 * Embedded professional translations for all 275 strings × 7 languages.
 * Run: node scripts/translation-data/seed-overrides.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { ROWS } from "./rows.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(readFileSync(join(__dirname, "../en-strings.json"), "utf8"));
const langs = ["de", "es", "fr", "it", "pt", "pl", "zh"];

if (ROWS.length !== en.length) {
  throw new Error(`Expected ${en.length} rows, got ${ROWS.length}`);
}

const overrides = {};
for (let i = 0; i < en.length; i++) {
  const row = ROWS[i];
  if (row.length !== langs.length) {
    throw new Error(`Row ${i}: expected ${langs.length} translations`);
  }
  for (let li = 0; li < langs.length; li++) {
    overrides[`${langs[li]}:${i}`] = row[li];
  }
}

writeFileSync(
  join(__dirname, "overrides.mjs"),
  "export const OVERRIDES = " + JSON.stringify(overrides, null, 2) + ";\n"
);
console.log(`Wrote overrides.mjs (${Object.keys(overrides).length} entries)`);
