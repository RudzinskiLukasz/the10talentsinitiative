import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import ProseContent from "../components/ProseContent.jsx";
import { getPostBySlug } from "../data/posts.js";

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-32 text-center sm:px-8">
        <h1 className="font-display text-3xl font-semibold text-fg">Page not found</h1>
        <Link to="/" className="mt-6 inline-flex text-primary-soft hover:text-accent">
          Return home
        </Link>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Homilies/Reflections"
        title={post.title}
        description={post.date}
      />
      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <ProseContent content={post.content.split("\n")} />
        <Link
          to="/upcoming-programs"
          className="mt-10 inline-flex text-sm font-semibold text-primary-soft hover:text-accent"
        >
          ← Back to announcements
        </Link>
      </section>
    </>
  );
}
