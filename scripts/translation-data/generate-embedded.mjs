/**
 * Builds lang-data.json from embedded translation tables (offline).
 * Run: node scripts/translation-data/generate-embedded.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(readFileSync(join(__dirname, "../en-strings.json"), "utf8"));
const langs = ["de", "es", "fr", "it", "pt", "pl", "zh"];
const chunksDir = join(__dirname, "chunks");

export function generateEmbedded() {
  /** @type {Record<string, string[]>} */
  const langData = {};

  for (const lang of langs) {
    const chunkPath = join(chunksDir, `${lang}.json`);
    const table = JSON.parse(readFileSync(chunkPath, "utf8"));
    if (table.length !== en.length) {
      throw new Error(`${lang}: expected ${en.length}, got ${table.length}`);
    }
    langData[lang] = table;
  }

  writeFileSync(
    join(__dirname, "lang-data.json"),
    JSON.stringify(langData, null, 2) + "\n"
  );
  console.log("Wrote lang-data.json");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateEmbedded();
}
