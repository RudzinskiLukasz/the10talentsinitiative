import { useMemo, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { keymap } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "../../hooks/useTheme.js";

function languageExtension(language) {
  if (language === "css") return css();
  if (language === "javascript") return javascript();
  return html();
}

export default function CodeEditor({
  value,
  onChange,
  language = "html",
  onSave,
  "aria-label": ariaLabel = "Code editor",
}) {
  const { theme } = useTheme();
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const extensions = useMemo(
    () => [
      languageExtension(language),
      keymap.of([
        {
          key: "Mod-s",
          run() {
            onSaveRef.current?.();
            return true;
          },
        },
      ]),
    ],
    [language]
  );

  return (
    <div className="admin-code-editor overflow-hidden rounded-xl border border-border bg-bg">
      <CodeMirror
        value={value}
        height="70vh"
        theme={theme === "dark" ? oneDark : "light"}
        extensions={extensions}
        indentWithTab
        onChange={(next) => onChange?.(next)}
        aria-label={ariaLabel}
      />
    </div>
  );
}
