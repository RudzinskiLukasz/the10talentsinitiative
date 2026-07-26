import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { usePublishedPosts } from "../hooks/usePosts.js";
import { getCategoryById } from "../data/postCategories.js";

export default function CategoryPostsPage({ categoryId }) {
  const { t } = useTranslation();
  const category = getCategoryById(categoryId);

  const title = category
    ? t(category.labelKey)
    : t("common.pageNotFound");
  const intro =
    categoryId === "daily-reflections"
      ? t("dailyReflectionsPage.intro")
      : "";

  const { posts, loading } = usePublishedPosts({
    category: category?.value,
  });

  if (!category) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-32 text-center sm:px-8">
        <h1 className="font-display text-3xl font-semibold text-fg">
          {t("common.pageNotFound")}
        </h1>
      </section>
    );
  }

  const categoryLabel = t(category.labelKey);

  return (
    <>
      <PageHeader title={title} description={intro || undefined} />
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        {loading ? (
          <p className="text-sm text-fg-muted">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-fg-muted">
            {t("categoryPosts.empty", { category: categoryLabel })}
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {posts.map((post, i) => {
              const translated = t(`posts.bySlug.${post.slug}`, {
                returnObjects: true,
                defaultValue: {},
              });
              const postTitle = translated.title || post.title;
              const excerpt =
                translated.excerpt ||
                post.excerpt ||
                String(post.content || "").slice(0, 220);
              return (
                <Reveal key={post.slug} delay={(i % 2) * 70}>
                  <article className="h-full rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-accent/40 hover:bg-surface-hover">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                      {categoryLabel}
                    </span>
                    <h2 className="mt-2 font-display text-xl font-semibold leading-snug text-fg">
                      <Link to={`/${post.slug}`} className="hover:text-accent">
                        {postTitle}
                      </Link>
                    </h2>
                    <p className="mt-2 text-xs text-fg-subtle">{post.date}</p>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted line-clamp-4">
                      {excerpt}
                    </p>
                    <Link
                      to={`/${post.slug}`}
                      className="mt-4 inline-flex text-sm font-semibold text-primary-soft hover:text-accent"
                    >
                      {t("common.readMore")}
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
