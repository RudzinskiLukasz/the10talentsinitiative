import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deletePost, fetchAdminPosts } from "../../lib/postsApi.js";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await fetchAdminPosts();
      setPosts(list);
    } catch (err) {
      setError(err.message || "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(post) {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    setDeletingId(post.id);
    try {
      await deletePost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
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
          <h1 className="font-display text-3xl font-semibold text-fg">Posts</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Create and publish reflections, spotlights, and articles.
          </p>
        </div>
        <Link
          to="/admin/posts/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90"
        >
          New post
        </Link>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-border-subtle bg-bg/60 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-fg-muted">Loading posts…</p>
      ) : posts.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-fg-muted">
          No posts yet. Create your first one.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-border-subtle rounded-2xl border border-border bg-surface">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-medium text-fg">{post.title}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      post.status === "published"
                        ? "bg-accent/15 text-accent"
                        : "bg-fg-subtle/15 text-fg-subtle"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-fg-subtle">
                  {post.category} · {post.date} · /{post.slug}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {post.status === "published" && (
                  <Link
                    to={`/${post.slug}`}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg"
                  >
                    View
                  </Link>
                )}
                <Link
                  to={`/admin/posts/${post.id}`}
                  className="rounded-full border border-border-strong bg-surface px-3 py-1.5 text-xs font-semibold text-fg hover:bg-surface-hover"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={deletingId === post.id}
                  onClick={() => handleDelete(post)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-surface-hover disabled:opacity-50"
                >
                  {deletingId === post.id ? "…" : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
