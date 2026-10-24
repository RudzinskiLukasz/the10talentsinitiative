import { createContext, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  hasVisibleMarkup,
  markupWithoutScripts,
  siteFileForRoute,
} from "../data/siteFiles.js";
import { useSiteFiles } from "../hooks/useSiteFiles.js";
import {
  appendHtmlScripts,
  applyCustomScript,
  applyHeadHtml,
  customStyleText,
  removeCustomScript,
} from "../lib/siteCodeDom.js";

const SiteCodeContext = createContext({});

const SLOT_CLASS = {
  header: "site-code-html mx-auto w-full max-w-6xl px-5 pt-6 sm:px-8",
  page: "site-code-html mx-auto w-full max-w-6xl px-5 py-10 sm:px-8",
  footer: "site-code-html mx-auto w-full max-w-6xl px-5 pb-10 sm:px-8",
};

/**
 * Live theme code from the admin editor.
 * Post bodies stay on the whitelist renderer. This slot is only for files
 * an admin saved in the theme editor, the same trust model as WordPress.
 */
export function SiteCodeProvider({ children }) {
  const files = useSiteFiles();
  const css = files["custom.css"]?.content || "";
  const js = files["custom.js"]?.content || "";
  const head = files["head.html"]?.content || "";

  useEffect(() => {
    applyHeadHtml(head);
    return () => applyHeadHtml("");
  }, [head]);

  useEffect(() => {
    applyCustomScript(js);
    return () => removeCustomScript();
  }, [js]);

  return (
    <SiteCodeContext.Provider value={files}>
      {css.trim() ? (
        <style id="site-custom-css">{customStyleText(css)}</style>
      ) : null}
      {children}
    </SiteCodeContext.Provider>
  );
}

function slotHtml(files, name, pathname) {
  if (name === "header") return files["header.html"]?.content || "";
  if (name === "footer") return files["footer.html"]?.content || "";
  if (name === "page") {
    const file = siteFileForRoute(pathname);
    return file ? files[file.path]?.content || "" : "";
  }
  return "";
}

export function SiteCodeSlot({ name }) {
  const files = useContext(SiteCodeContext);
  const { pathname } = useLocation();
  const ref = useRef(null);
  const html = slotHtml(files, name, pathname);
  const source = String(html || "");

  useEffect(() => {
    appendHtmlScripts(ref.current, source);
    return () => {
      ref.current
        ?.querySelectorAll("script[data-site-code-script]")
        .forEach((node) => node.remove());
    };
  }, [source]);

  if (!source.trim()) return null;

  const visible = hasVisibleMarkup(source);
  return (
    <div
      ref={ref}
      className={visible ? SLOT_CLASS[name] || "site-code-html" : "site-code-html"}
      data-site-code={name}
      dangerouslySetInnerHTML={{ __html: markupWithoutScripts(source) }}
    />
  );
}
