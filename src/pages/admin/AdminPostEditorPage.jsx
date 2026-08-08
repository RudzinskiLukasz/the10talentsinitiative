import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PostRichEditor from "../../components/admin/PostRichEditor.jsx";
import {
  blocksToPlainContent,
  createPost,
  fetchAdminPostById,
  normalizePublishFields,
  slugifyTitle,
  updatePost,
} from "../../lib/postsApi.js";
import {
  DEFAULT_POST_CATEGORY,
  POST_CATEGORIES,
  getCategoryByValue,
} from "../../data/postCategories.js";

function toDatetimeLocalValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocalValue(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

const emptyForm = {
  title: "",
  slug: "",
  date: new Date().toISOString().slice(0, 10),
  category: DEFAULT_POST_CATEGORY,
  excerpt: "",
  status: "draft",
  publish_at: "",
  blocks: [],
};

export default function AdminPostEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [editorReady, setEditorReady] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      setEditorReady(true);
      return undefined;
    }
    let active = true;
    setEditorReady(false);

    fetchAdminPostById(id)
      .then((post) => {
        if (!active) return;
        if (!post) {
          setError("Post not found.");
          return;
        }
        setForm({
          title: post.title || "",
          slug: post.slug || "",
          date: post.date || emptyForm.date,
          category:
            getCategoryByValue(post.category)?.value ||
            post.category ||
            emptyForm.category,
          excerpt: post.excerpt || "",
          status: post.status || "draft",
          publish_at: toDatetimeLocalValue(post.publish_at),
          blocks: Array.isArray(post.blocks) ? post.blocks : [],
        });
        setSlugTouched(true);
        setEditorReady(true);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load post.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, isNew]);

  function setField(key, value) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugTouched) {
        next.slug = slugifyTitle(value);
      }
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const publishFields = normalizePublishFields({
        status: form.status,
        publish_at:
          form.status === "scheduled"
            ? fromDatetimeLocalValue(form.publish_at)
            : form.publish_at
              ? fromDatetimeLocalValue(form.publish_at)
              : null,
      });

      const blocks = form.blocks?.length ? form.blocks : null;
      const plain = blocksToPlainContent(blocks);
      const hasMedia = (blocks || []).some((b) =>
        ["image", "video", "embed"].includes(b?.type)
      );
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugifyTitle(form.title),
        date: form.date,
        category: form.category.trim() || DEFAULT_POST_CATEGORY,
        excerpt: form.excerpt.trim(),
        content: plain || form.excerpt.trim(),
        status: publishFields.status,
        publish_at: publishFields.publish_at,
        blocks,
      };

      if (!plain.trim() && !hasMedia) {
        throw new Error("Post body cannot be empty.");
      }

      if (isNew) {
        const created = await createPost(payload);
        navigate(`/admin/posts/${created.id}`, { replace: true });
      } else {
        await updatePost(id, payload);
        navigate("/admin");
      }
    } catch (err) {
      setError(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-fg-muted">Loading post…</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-fg">
            {isNew ? "New post" : "Edit post"}
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            Visual editor with images, uploaded video, and YouTube/Vimeo embeds.
            Schedule publish date and time when ready.
          </p>
        </div>
        <Link to="/admin" className="text-sm text-primary-soft hover:text-accent">
          ← All posts
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-border-subtle bg-bg/60 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      >
        <label className="block">
          <span className="text-sm font-medium text-fg">Title</span>
          <input
            required
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring focus:ring-2"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-fg">Slug</span>
            <input
              required
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setField("slug", e.target.value);
              }}
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-fg">Display date</span>
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) => setField("date", e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring focus:ring-2"
            />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-fg">Section / tab</span>
            <select
              value={
                getCategoryByValue(form.category)?.value || DEFAULT_POST_CATEGORY
              }
              onChange={(e) => setField("category", e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring focus:ring-2"
            >
              {POST_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.value}>
                  {cat.value}
                  {cat.isDefault ? " (default)" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-fg">Status</span>
            <select
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring focus:ring-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </label>
        </div>

        {form.status === "scheduled" && (
          <label className="block">
            <span className="text-sm font-medium text-fg">Publish at</span>
            <span className="mt-1 block text-xs text-fg-subtle">
              The post becomes visible on the public site at this date and time
              (browser local timezone).
            </span>
            <input
              required
              type="datetime-local"
              value={form.publish_at}
              onChange={(e) => setField("publish_at", e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring focus:ring-2 sm:max-w-md"
            />
          </label>
        )}

        <label className="block">
          <span className="text-sm font-medium text-fg">Excerpt</span>
          <textarea
            rows={3}
            value={form.excerpt}
            onChange={(e) => setField("excerpt", e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring focus:ring-2"
          />
        </label>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-fg">Body</span>
            {uploading && (
              <span className="text-xs font-semibold text-accent">Uploading…</span>
            )}
          </div>
          {editorReady ? (
            <PostRichEditor
              key={isNew ? "new" : id}
              blocks={form.blocks}
              slug={form.slug}
              onChange={(blocks) => setField("blocks", blocks || [])}
              onUploadingChange={setUploading}
              onError={setError}
            />
          ) : (
            <p className="text-sm text-fg-muted">Loading editor…</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : isNew ? "Create post" : "Save changes"}
          </button>
          <Link
            to="/admin"
            className="rounded-full border border-border-strong px-6 py-3 text-sm font-semibold text-fg transition hover:bg-surface-hover"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
