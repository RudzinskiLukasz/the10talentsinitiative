/**
 * One-time generator: fetches professional translations and writes overrides.mjs.
 * Run: node scripts/translation-data/fetch-overrides.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(readFileSync(join(__dirname, "../en-strings.json"), "utf8"));
const langs = ["de", "es", "fr", "it", "pt", "pl", "zh"];
const GT = { de: "de", es: "es", fr: "fr", it: "it", pt: "pt", pl: "pl", zh: "zh-CN" };

function keep(s) {
  if (!s) return true;
  if (/^[\$]/.test(s) || s.startsWith("/") || s === "*" || s === "∞") return true;
  if (/^(Deutsch|Español|Français|Italiano|Português|Polski|English|中文|Facebook|TikTok|WhatsApp|Mail|Tp|Pro)$/.test(s))
    return true;
  if (s.includes("Dialnet-")) return true;
  if (/^\d{4}$/.test(s) || s === "8") return true;
  if (/^(Miss |Mr\. |Mrs\. |Rev\. Fr\.)/.test(s)) return true;
  return false;
}

async function translateChunk(text, tl) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data[0].map((part) => part[0]).join("");
}

async function translateText(text, tl) {
  if (!text.trim()) return text;
  const MAX = 1800;
  if (text.length <= MAX) return translateChunk(text, tl);
  const parts = text.split(/(\n\n+|\n)/);
  const out = [];
  let buffer = "";
  for (const part of parts) {
    if (!part) continue;
    if ((buffer + part).length > MAX && buffer) {
      out.push(await translateChunk(buffer, tl));
      await sleep(300);
      buffer = part;
    } else {
      buffer += part;
    }
  }
  if (buffer) out.push(await translateChunk(buffer, tl));
  return out.join("");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const overrides = {};

for (const lang of langs) {
  const tl = GT[lang];
  console.log(`Translating ${lang}…`);
  for (let i = 0; i < en.length; i++) {
    const english = en[i];
    if (keep(english) || i === 242 || i === 270) {
      overrides[`${lang}:${i}`] = i === 242 || i === 270 ? "" : english;
      continue;
    }
    overrides[`${lang}:${i}`] = await translateText(english, tl);
    await sleep(250);
    if ((i + 1) % 20 === 0) console.log(`  ${lang}: ${i + 1}/${en.length}`);
  }
}

writeFileSync(
  join(__dirname, "overrides.mjs"),
  "export const OVERRIDES = " + JSON.stringify(overrides, null, 2) + ";\n"
);
console.log("Wrote overrides.mjs");
