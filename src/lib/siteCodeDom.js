import { escapeStyleContent } from "../data/siteFiles.js";

const HEAD_MARK = "data-site-code-head";
const SCRIPT_MARK = "data-site-code-script";
const CUSTOM_SCRIPT_ID = "site-custom-js";

function cloneExecutableScript(source, markName) {
  const script = document.createElement("script");
  for (const attr of source.attributes) {
    script.setAttribute(attr.name, attr.value);
  }
  if (!source.getAttribute("src")) {
    script.textContent = source.textContent || "";
  }
  script.setAttribute(markName, "");
  return script;
}

export function clearHeadInjections() {
  document.head.querySelectorAll(`[${HEAD_MARK}]`).forEach((node) => node.remove());
}

/** Insert admin head markup without removing tags the app already owns. */
export function applyHeadHtml(html) {
  clearHeadInjections();
  const source = String(html || "").trim();
  if (!source) return;

  const template = document.createElement("template");
  template.innerHTML = source;
  for (const node of [...template.content.childNodes]) {
    if (node.nodeType !== Node.ELEMENT_NODE) continue;
    if (node.tagName === "SCRIPT") {
      document.head.append(cloneExecutableScript(node, HEAD_MARK));
    } else {
      node.setAttribute(HEAD_MARK, "");
      document.head.append(node);
    }
  }
}

export function removeCustomScript() {
  document.getElementById(CUSTOM_SCRIPT_ID)?.remove();
}

export function applyCustomScript(code) {
  removeCustomScript();
  const source = String(code || "");
  if (!source.trim()) return;
  try {
    const script = document.createElement("script");
    script.id = CUSTOM_SCRIPT_ID;
    script.textContent = source;
    document.body.append(script);
  } catch (error) {
    console.error("[site-files] custom.js failed.", error);
  }
}

export function appendHtmlScripts(root, html) {
  if (!root) return;
  root.querySelectorAll(`script[${SCRIPT_MARK}]`).forEach((node) => node.remove());
  const template = document.createElement("template");
  template.innerHTML = String(html || "");
  for (const source of template.content.querySelectorAll("script")) {
    root.append(cloneExecutableScript(source, SCRIPT_MARK));
  }
}

export function customStyleText(css) {
  return escapeStyleContent(css);
}
