/**
 * Builds ui-maps.json from per-language translation arrays.
 * Run: node scripts/translation-data/compose-ui-maps.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import de from "./tables/de.mjs";
import es from "./tables/es.mjs";
import fr from "./tables/fr.mjs";
import it from "./tables/it.mjs";
import pt from "./tables/pt.mjs";
import pl from "./tables/pl.mjs";
import zh from "./tables/zh.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(readFileSync(join(__dirname, "../en-strings.json"), "utf8"));
const SKIP = new Set([242, 270]);

const tables = { de, es, fr, it, pt, pl, zh };
const maps = {};

for (const [lang, table] of Object.entries(tables)) {
  if (table.length !== en.length) {
    throw new Error(`${lang}: expected ${en.length}, got ${table.length}`);
  }
  maps[lang] = {};
  en.forEach((english, index) => {
    if (SKIP.has(index)) return;
    maps[lang][english] = table[index];
  });
}

writeFileSync(
  join(__dirname, "ui-maps.json"),
  JSON.stringify(maps, null, 2) + "\n"
);
console.log("Wrote ui-maps.json");
