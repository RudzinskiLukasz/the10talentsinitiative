import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CodeEditor from "../../components/admin/CodeEditor.jsx";
import {
  getSiteFile,
  siteFilesByGroup,
} from "../../data/siteFiles.js";
import { isSupabaseConfigured } from "../../lib/supabase.js";
import {
  fetchSiteFiles,
  migrationHint,
  revertSiteFile,
  saveSiteFile,
} from "../../lib/siteFilesApi.js";

function formatUpdated(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
}

export default function AdminCodeEditorPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("file") || "";
  const selectedPath = getSiteFile(requested) ? requested : "custom.css";
  const file = getSiteFile(selectedPath);
  const groups = useMemo(() => siteFilesByGroup(), []);

  const [records, setRecords] = useState({});
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const pathRef = useRef(selectedPath);
  pathRef.current = selectedPath;

  const saved = records[selectedPath]?.content ?? "";
  const dirty = draft !== saved;
  const canRevert = records[selectedPath]?.previous_content != null;

  useEffect(() => {
    let active = true;
    fetchSiteFiles({ throwOnError: true })
      .then((map) => {
        if (!active) return;
        setRecords(map);
        setDraft(map[pathRef.current]?.content ?? "");
      })
      .catch((err) => {
        if (!active) return;
        setError(migrationHint(err.message || "Could not load theme files."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!dirty) return undefined;
    function onBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }
    function onClick(event) {
      const anchor = event.target.closest?.("a");
      if (!anchor || anchor.target === "_blank") return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (
        !window.confirm("This file has unsaved changes. Leave without updating?")
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);

  function selectFile(nextPath) {
    if (nextPath === selectedPath) return;
    if (
      dirty &&
      !window.confirm("This file has unsaved changes. Discard them?")
    ) {
      return;
    }
    setDraft(records[nextPath]?.content ?? "");
    setError("");
    setStatus("");
    setParams({ file: nextPath }, { replace: true });
  }

  async function handleSave() {
    if (!dirty || saving) return;
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const savedRow = await saveSiteFile(selectedPath, draft);
      setRecords((prev) => ({ ...prev, [selectedPath]: savedRow }));
      setStatus("File updated.");
    } catch (err) {
      setError(migrationHint(err.message || "Save failed."));
    } finally {
      setSaving(false);
    }
  }

  async function handleRevert() {
    if (!canRevert || saving) return;
    if (
      !window.confirm(
        "Restore the previous saved version of this file? The current saved copy becomes the one you can revert to next."
      )
    ) {
      return;
    }
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const savedRow = await revertSiteFile(selectedPath);
      setRecords((prev) => ({ ...prev, [selectedPath]: savedRow }));
      setDraft(savedRow?.content ?? "");
      setStatus("Previous version restored.");
    } catch (err) {
      setError(migrationHint(err.message || "Revert failed."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-fg-muted">Loading editor…</p>;
  }

  const updated = formatUpdated(records[selectedPath]?.updated_at);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-fg">
            Theme File Editor
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-fg-muted">
            Edit CSS, JavaScript, and HTML for the live site. Same idea as
            Appearance → Theme File Editor in WordPress. Changes show on the
            public pages after you update the file.
          </p>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <p className="mb-4 rounded-xl border border-border-subtle bg-bg/60 p-3 text-sm text-fg">
          Supabase is not configured, so files cannot be saved. Set
          VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then run
          supabase/migrations/004_site_files.sql.
        </p>
      )}

      <div className="mb-4 rounded-xl border border-gold-600/40 bg-gold-500/10 px-4 py-3 text-sm text-fg">
        This code runs for every visitor. A broken tag or script can mess up
        the layout. Update File publishes immediately. Revert restores the
        previous saved copy of the open file.
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-border-subtle bg-bg/60 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saving}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Update File"}
        </button>
        <button
          type="button"
          onClick={handleRevert}
          disabled={!canRevert || saving}
          className="rounded-full border border-border-strong px-5 py-2.5 text-sm font-semibold text-fg transition hover:bg-surface-hover disabled:opacity-50"
        >
          Revert
        </button>
        <span className="text-xs text-fg-subtle">
          {dirty ? "Unsaved changes" : status || "Ctrl+S to update"}
          {updated ? ` · Saved ${updated}` : ""}
        </span>
      </div>

      <label className="mb-4 block lg:hidden">
        <span className="text-sm font-medium text-fg">File</span>
        <select
          value={selectedPath}
          onChange={(event) => selectFile(event.target.value)}
          className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring focus:ring-2"
        >
          {groups.map((group) => (
            <optgroup key={group.name} label={group.name}>
              {group.files.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label}
                  {item.title !== item.label ? ` — ${item.title}` : ""}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <div className="mb-3">
            <h2 className="font-mono text-sm font-semibold text-fg">{file.label}</h2>
            <p className="mt-1 text-sm text-fg-muted">{file.description}</p>
            <p className="mt-2 font-mono text-xs text-fg-subtle">
              Example: {file.example}
            </p>
            {file.route && (
              <a
                href={file.route}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-primary-soft hover:text-accent"
              >
                View {file.title}
              </a>
            )}
          </div>
          <CodeEditor
            key={selectedPath}
            value={draft}
            language={file.language}
            onChange={setDraft}
            onSave={handleSave}
            aria-label={`Edit ${file.label}`}
          />
        </div>

        <aside className="hidden rounded-2xl border border-border bg-surface p-4 lg:block">
          {groups.map((group) => (
            <div key={group.name} className="mb-5 last:mb-0">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                {group.name === "Theme" ? "Theme files" : "Page HTML"}
              </h2>
              <ul className="space-y-1">
                {group.files.map((item) => {
                  const active = item.path === selectedPath;
                  return (
                    <li key={item.path}>
                      <button
                        type="button"
                        onClick={() => selectFile(item.path)}
                        aria-current={active ? "true" : undefined}
                        className={`w-full rounded-lg px-2.5 py-2 text-left transition ${
                          active
                            ? "bg-accent/15 text-accent"
                            : "text-fg-muted hover:bg-surface-hover hover:text-fg"
                        }`}
                      >
                        <span className="block font-mono text-xs">{item.label}</span>
                        <span className="mt-0.5 block text-[11px] text-fg-subtle">
                          {item.title}
                          {active && dirty ? " · unsaved" : ""}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <p className="border-t border-border-subtle pt-3 text-xs leading-relaxed text-fg-subtle">
            Articles are edited under Posts. Open a post and switch to the Code
            tab to edit its HTML. Page files here add a section under the
            existing page. They do not replace the built-in layout.
          </p>
        </aside>
      </div>
    </div>
  );
}
