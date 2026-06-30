import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const langs = ["de", "es", "fr", "it", "pt", "pl", "zh"];

export const translationBundles = Object.fromEntries(
  langs.map((lang) => [
    lang,
    JSON.parse(
      readFileSync(join(__dirname, `${lang}.bundle.json`), "utf8")
    ),
  ])
);
