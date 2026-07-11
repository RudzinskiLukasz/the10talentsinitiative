import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader.jsx";
import ProseContent from "../components/ProseContent.jsx";
import { getPostBySlug } from "../data/posts.js";

export default function BlogPostPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-32 text-center sm:px-8">
        <h1 className="font-display text-3xl font-semibold text-fg">
          {t("common.pageNotFound")}
        </h1>
        <Link to="/" className="mt-6 inline-flex text-primary-soft hover:text-accent">
          {t("common.returnHome")}
        </Link>
      </section>
    );
  }

  const translated = t(`posts.bySlug.${post.slug}`, { returnObjects: true, defaultValue: {} });
  const title = translated.title || post.title;

  return (
    <>
      <PageHeader
        eyebrow={t("posts.category")}
        title={title}
        description={post.date}
      />
      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <ProseContent
          content={post.content.split("\n")}
          blocks={post.blocks}
        />
        <Link
          to="/daily-reflections"
          className="mt-10 inline-flex text-sm font-semibold text-primary-soft hover:text-accent"
        >
          {t("common.backToDailyReflections")}
        </Link>
      </section>
    </>
  );
}
