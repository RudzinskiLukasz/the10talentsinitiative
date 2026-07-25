import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  blocksToContent,
  contentToTextBlocks,
  createPost,
  fetchAdminPostById,
  slugifyTitle,
  updatePost,
  uploadPostImage,
} from "../../lib/postsApi.js";
import {
  DEFAULT_POST_CATEGORY,
  POST_CATEGORIES,
  getCategoryByValue,
} from "../../data/postCategories.js";

const emptyForm = {
  title: "",
  slug: "",
  date: new Date().toISOString().slice(0, 10),
  category: DEFAULT_POST_CATEGORY,
  excerpt: "",
  content: "",
  status: "draft",
  blocks: [],
};

function imageBlocksFrom(blocks) {
  return Array.isArray(blocks) ? blocks.filter((b) => b?.type === "image") : [];
}

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

  useEffect(() => {
    if (isNew) return undefined;
    let active = true;

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
          category: getCategoryByValue(post.category)?.value || post.category || emptyForm.category,
          excerpt: post.excerpt || "",
          content: post.content || blocksToContent(post.blocks) || "",
          status: post.status || "draft",
          blocks: Array.isArray(post.blocks) ? post.blocks : [],
        });
        setSlugTouched(true);
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

  const images = useMemo(() => imageBlocksFrom(form.blocks), [form.blocks]);

  function setField(key, value) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugTouched) {
        next.slug = slugifyTitle(value);
      }
      return next;
    });
  }

  function buildBlocks() {
    const textBlocks = contentToTextBlocks(form.content);
    const existingImages = imageBlocksFrom(form.blocks);
    if (!existingImages.length) {
      return textBlocks.length ? textBlocks : null;
    }
    // Preserve interleaving when possible: keep existing block order but
    // replace text blocks with the current content paragraphs in order.
    const next = [];
    let textIndex = 0;
    for (const block of form.blocks) {
      if (block.type === "image") {
        next.push(block);
      } else if (block.type === "text") {
        if (textIndex < textBlocks.length) {
          next.push(textBlocks[textIndex]);
          textIndex += 1;
        }
      }
    }
    while (textIndex < textBlocks.length) {
      next.push(textBlocks[textIndex]);
      textIndex += 1;
    }
    return next;
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const url = await uploadPostImage(file, { slug: form.slug || "uploads" });
      setForm((prev) => ({
        ...prev,
        blocks: [...(prev.blocks || []), { type: "image", src: url, alt: "" }],
      }));
    } catch (err) {
      setError(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(src) {
    setForm((prev) => ({
      ...prev,
      blocks: (prev.blocks || []).filter(
        (b) => !(b.type === "image" && b.src === src)
      ),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugifyTitle(form.title),
      date: form.date,
      category: form.category.trim() || DEFAULT_POST_CATEGORY,
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      status: form.status,
      blocks: buildBlocks(),
    };

    try {
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
            Plain-text body with optional images (same format as the public site).
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

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8">
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
            <span className="text-sm font-medium text-fg">Date</span>
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
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-fg">Excerpt</span>
          <textarea
            rows={3}
            value={form.excerpt}
            onChange={(e) => setField("excerpt", e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring focus:ring-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-fg">Body</span>
          <span className="mt-1 block text-xs text-fg-subtle">
            Separate paragraphs with a blank line.
          </span>
          <textarea
            required
            rows={14}
            value={form.content}
            onChange={(e) => setField("content", e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring focus:ring-2"
          />
        </label>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-medium text-fg">Images</span>
            <label className="cursor-pointer rounded-full border border-border-strong bg-surface px-4 py-2 text-xs font-semibold text-fg transition hover:bg-surface-hover">
              {uploading ? "Uploading…" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={handleUpload}
              />
            </label>
          </div>
          {images.length === 0 ? (
            <p className="mt-3 text-sm text-fg-subtle">No images yet.</p>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {images.map((img) => (
                <li
                  key={img.src}
                  className="overflow-hidden rounded-xl border border-border bg-bg"
                >
                  <img
                    src={img.src}
                    alt={img.alt || ""}
                    className="h-36 w-full object-cover"
                  />
                  <div className="flex justify-end p-2">
                    <button
                      type="button"
                      onClick={() => removeImage(img.src)}
                      className="text-xs font-semibold text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
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
