import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteTrack, fetchAdminTracks } from "../../lib/tracksApi.js";

export default function AdminTracksPage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await fetchAdminTracks();
      setTracks(list);
    } catch (err) {
      setError(err.message || "Failed to load tracks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(track) {
    if (!window.confirm(`Delete “${track.title}”? This cannot be undone.`)) return;
    setDeletingId(track.id);
    try {
      await deleteTrack(track.id);
      setTracks((prev) => prev.filter((t) => t.id !== track.id));
    } catch (err) {
      setError(err.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-fg">
            T-Talents Records
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            Upload songs for visitors to download on the Records page.
          </p>
        </div>
        <Link
          to="/admin/tracks/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90"
        >
          New track
        </Link>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-border-subtle bg-bg/60 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-fg-muted">Loading tracks…</p>
      ) : tracks.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-fg-muted">
          No tracks yet. Upload your first song.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-border-subtle rounded-2xl border border-border bg-surface">
          {tracks.map((track) => (
            <li
              key={track.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-medium text-fg">{track.title}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      track.status === "published"
                        ? "bg-accent/15 text-accent"
                        : "bg-fg-subtle/15 text-fg-subtle"
                    }`}
                  >
                    {track.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-fg-subtle">
                  {track.artist || "Unknown artist"} · {track.date}
                  {track.file_name ? ` · ${track.file_name}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {track.status === "published" && (
                  <Link
                    to="/t-talents-records"
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg"
                  >
                    View
                  </Link>
                )}
                <Link
                  to={`/admin/tracks/${track.id}`}
                  className="rounded-full border border-border-strong bg-surface px-3 py-1.5 text-xs font-semibold text-fg hover:bg-surface-hover"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={deletingId === track.id}
                  onClick={() => handleDelete(track)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-surface-hover disabled:opacity-50"
                >
                  {deletingId === track.id ? "…" : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
