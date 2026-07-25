import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createTrack,
  fetchAdminTrackById,
  updateTrack,
  uploadTrackAudio,
  uploadTrackCover,
} from "../../lib/tracksApi.js";

const emptyForm = {
  title: "",
  artist: "",
  description: "",
  cover_url: "",
  audio_url: "",
  file_name: "",
  mime_type: "",
  date: new Date().toISOString().slice(0, 10),
  status: "draft",
};

export default function AdminTrackEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return undefined;
    let active = true;

    fetchAdminTrackById(id)
      .then((track) => {
        if (!active) return;
        if (!track) {
          setError("Track not found.");
          return;
        }
        setForm({
          title: track.title || "",
          artist: track.artist || "",
          description: track.description || "",
          cover_url: track.cover_url || "",
          audio_url: track.audio_url || "",
          file_name: track.file_name || "",
          mime_type: track.mime_type || "",
          date: track.date || emptyForm.date,
          status: track.status || "draft",
        });
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load track.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, isNew]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleAudioChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploadingAudio(true);
    setError("");
    try {
      const uploaded = await uploadTrackAudio(file);
      setForm((prev) => ({ ...prev, ...uploaded }));
    } catch (err) {
      setError(err.message || "Audio upload failed.");
    } finally {
      setUploadingAudio(false);
    }
  }

  async function handleCoverChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploadingCover(true);
    setError("");
    try {
      const uploaded = await uploadTrackCover(file);
      setForm((prev) => ({ ...prev, ...uploaded }));
    } catch (err) {
      setError(err.message || "Cover upload failed.");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.audio_url) {
      setError("Upload an audio file before saving.");
      return;
    }

    setSaving(true);
    setError("");
    const payload = {
      title: form.title.trim(),
      artist: form.artist.trim(),
      description: form.description.trim(),
      cover_url: form.cover_url || null,
      audio_url: form.audio_url,
      file_name: form.file_name || "",
      mime_type: form.mime_type || "",
      date: form.date,
      status: form.status,
    };

    try {
      if (isNew) {
        await createTrack(payload);
      } else {
        await updateTrack(id, payload);
      }
      navigate("/admin/tracks");
    } catch (err) {
      setError(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-fg-muted">Loading track…</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-subtle">
            <Link to="/admin/tracks" className="hover:text-accent">
              ← Tracks
            </Link>
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-fg">
            {isNew ? "New track" : "Edit track"}
          </h1>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-border-subtle bg-bg/60 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
            Title
          </span>
          <input
            required
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-fg outline-none focus:border-accent"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
            Artist
          </span>
          <input
            value={form.artist}
            onChange={(e) => setField("artist", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-fg outline-none focus:border-accent"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
            Description
          </span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-fg outline-none focus:border-accent"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
              Release date
            </span>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setField("date", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-fg outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
              Status
            </span>
            <select
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-fg outline-none focus:border-accent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
            Audio file
          </p>
          <p className="mt-1 text-xs text-fg-muted">
            MP3, WAV, M4A, AAC, or OGG — max 80 MB.
          </p>
          {form.audio_url ? (
            <div className="mt-3 space-y-2">
              <p className="truncate text-sm text-fg">
                {form.file_name || "Audio uploaded"}
              </p>
              <audio controls src={form.audio_url} className="w-full max-w-md">
                <track kind="captions" />
              </audio>
            </div>
          ) : (
            <p className="mt-3 text-sm text-fg-muted">No audio uploaded yet.</p>
          )}
          <label className="mt-4 inline-flex cursor-pointer rounded-full border border-border-strong bg-bg px-4 py-2 text-xs font-semibold text-fg hover:bg-surface-hover">
            {uploadingAudio ? "Uploading…" : form.audio_url ? "Replace audio" : "Upload audio"}
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              disabled={uploadingAudio}
              onChange={handleAudioChange}
            />
          </label>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
            Cover art (optional)
          </p>
          {form.cover_url ? (
            <img
              src={form.cover_url}
              alt=""
              className="mt-3 h-32 w-32 rounded-xl object-cover"
            />
          ) : (
            <p className="mt-3 text-sm text-fg-muted">No cover yet.</p>
          )}
          <label className="mt-4 inline-flex cursor-pointer rounded-full border border-border-strong bg-bg px-4 py-2 text-xs font-semibold text-fg hover:bg-surface-hover">
            {uploadingCover ? "Uploading…" : form.cover_url ? "Replace cover" : "Upload cover"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingCover}
              onChange={handleCoverChange}
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploadingAudio || uploadingCover}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : isNew ? "Create track" : "Save changes"}
          </button>
          <Link
            to="/admin/tracks"
            className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-fg-muted hover:text-fg"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
