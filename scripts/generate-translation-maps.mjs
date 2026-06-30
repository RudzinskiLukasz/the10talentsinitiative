/**
 * Generates per-language English→translation maps and writes locale map files.
 * Run: node scripts/generate-translation-maps.mjs
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const langDataPath = join(__dirname, "translation-data/lang-data.json");
const exactPath = join(__dirname, "translation-data/exact-by-string.json");

if (!existsSync(exactPath)) {
  console.log("Building exact translation tables…");
  await import("./translation-data/create-exact-translations.mjs");
  await import("./translation-data/build-exact.mjs");
  const { buildChunks } = await import("./translation-data/build-chunks.mjs");
  const { readFileSync: rf, writeFileSync: wf } = await import("fs");
  const en = JSON.parse(rf(join(__dirname, "en-strings.json"), "utf8"));
  const exact = JSON.parse(rf(exactPath, "utf8"));
  const langs = ["de", "es", "fr", "it", "pt", "pl", "zh"];
  const overrides = {};
  for (let i = 0; i < en.length; i++) {
    for (let li = 0; li < langs.length; li++) {
      overrides[`${langs[li]}:${i}`] = exact[en[i]][li];
    }
  }
  wf(
    join(__dirname, "translation-data/overrides.mjs"),
    "export const OVERRIDES = " + JSON.stringify(overrides, null, 2) + ";\n"
  );
  buildChunks();
  await import("./translation-data/generate-embedded.mjs");
}

if (!existsSync(langDataPath)) {
  console.log("Building translation data…");
  const { buildChunks } = await import("./translation-data/build-chunks.mjs");
  const { generateEmbedded } = await import(
    "./translation-data/generate-embedded.mjs"
  );
  buildChunks();
  generateEmbedded();
}

const { buildLanguageBundle } = await import("./translation-data/translate-all.mjs");

const enStrings = JSON.parse(
  readFileSync(join(__dirname, "en-strings.json"), "utf8")
);

const outDir = join(__dirname, "translations");
mkdirSync(outDir, { recursive: true });

const langs = ["de", "es", "fr", "it", "pt", "pl", "zh"];

for (const lang of langs) {
  const bundle = buildLanguageBundle(lang);
  if (bundle.length !== enStrings.length) {
    throw new Error(
      `${lang}: expected ${enStrings.length} strings, got ${bundle.length}`
    );
  }

  const map = Object.fromEntries(
    enStrings.map((english, index) => [english, bundle[index]])
  );

  const outPath = join(outDir, `${lang}.json`);
  writeFileSync(outPath, JSON.stringify(map, null, 2) + "\n");
  console.log(`Wrote ${outPath} (${Object.keys(map).length} keys)`);
}
