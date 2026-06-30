import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { homePage } from "../data/content.js";
import { posts } from "../data/posts.js";

export default function UpcomingProgramsPage() {
  return (
    <>
      <PageHeader
        title="Announcements and Upcoming programs"
        description={homePage.announcementsIntro}
      />
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 2) * 70}>
              <article className="h-full rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-accent/40 hover:bg-surface-hover">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                  Homilies/Reflections
                </span>
                <h2 className="mt-2 font-display text-xl font-semibold leading-snug text-fg">
                  <Link to={`/${post.slug}`} className="hover:text-accent">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-xs text-fg-subtle">{post.date}</p>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted line-clamp-4">
                  {post.excerpt || post.content.slice(0, 220)}
                </p>
                <Link
                  to={`/${post.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-primary-soft hover:text-accent"
                >
                  Read more →
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
