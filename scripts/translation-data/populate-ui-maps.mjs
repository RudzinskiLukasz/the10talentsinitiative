/**
 * Generates lang-data.json with professional translations for all locale strings.
 * Run: node scripts/translation-data/populate-ui-maps.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(readFileSync(join(__dirname, "../en-strings.json"), "utf8"));

const LANG_CODES = ["de", "es", "fr", "it", "pt", "pl", "zh"];
const MYMEMORY = {
  de: "de",
  es: "es",
  fr: "fr",
  it: "it",
  pt: "pt",
  pl: "pl",
  zh: "zh-CN",
};

function shouldKeepOriginal(text) {
  if (!text) return true;
  if (/^[\$€£]?\d/.test(text)) return true;
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

async function translateChunk(text, target) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${target}`);
  const data = await res.json();
  if (data.responseStatus !== 200) {
    throw new Error(`Translation failed (${target}): ${data.responseDetails || "unknown"}`);
  }
  return data.responseData.translatedText;
}

async function translateText(text, target) {
  if (!text.trim()) return text;
  const MAX = 180;
  if (text.length <= MAX) {
    return translateChunk(text, target);
  }
  const parts = text.split(/(\n\n+|\n|(?<=[.!?])\s+)/);
  const out = [];
  let buffer = "";
  for (const part of parts) {
    if (!part) continue;
    if ((buffer + part).length > MAX && buffer) {
      out.push(await translateChunk(buffer, target));
      await sleep(400);
      buffer = part;
    } else {
      buffer += part;
    }
  }
  if (buffer) {
    out.push(await translateChunk(buffer, target));
  }
  return out.join("");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  /** @type {Record<string, string[]>} */
  const langData = Object.fromEntries(LANG_CODES.map((l) => [l, []]));

  for (const lang of LANG_CODES) {
    const target = MYMEMORY[lang];
    console.log(`Translating to ${lang}…`);
    for (let i = 0; i < en.length; i++) {
      const english = en[i];
      if (shouldKeepOriginal(english)) {
        langData[lang][i] = english;
        continue;
      }
      try {
        langData[lang][i] = await translateText(english, target);
        await sleep(400);
      } catch (err) {
        console.error(`Failed index ${i} (${lang}):`, err.message);
        throw err;
      }
      if ((i + 1) % 20 === 0) {
        console.log(`  ${lang}: ${i + 1}/${en.length}`);
      }
    }
  }

  const out = join(__dirname, "lang-data.json");
  writeFileSync(out, JSON.stringify(langData, null, 2) + "\n");
  console.log(`Wrote ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
