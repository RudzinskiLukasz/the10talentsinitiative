/**
 * Builds per-language chunk JSON files with complete professional translations.
 * Run: node scripts/translation-data/build-chunks.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { OVERRIDES } from "./overrides.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function buildChunks() {
  const en = JSON.parse(readFileSync(join(__dirname, "../en-strings.json"), "utf8"));
  const langs = ["de", "es", "fr", "it", "pt", "pl", "zh"];
  const chunksDir = join(__dirname, "chunks");
  mkdirSync(chunksDir, { recursive: true });

  for (const lang of langs) {
    const table = en.map((_, index) => {
      const key = `${lang}:${index}`;
      if (!Object.prototype.hasOwnProperty.call(OVERRIDES, key)) {
        throw new Error(`Missing override ${key}`);
      }
      return OVERRIDES[key];
    });
    writeFileSync(join(chunksDir, `${lang}.json`), JSON.stringify(table, null, 2) + "\n");
    console.log(`Wrote chunks/${lang}.json`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildChunks();
}
