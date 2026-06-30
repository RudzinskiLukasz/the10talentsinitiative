import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { homePage } from "../data/content.js";
import { posts } from "../data/posts.js";

export default function HomePage() {
  const featuredPosts = posts.slice(0, 6);

  return (
    <>
      <PageHeader title={homePage.hero} />
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <Reveal className="flex justify-center">
          <Link
            to={homePage.discoverMoreHref}
            className="inline-flex items-center gap-2 rounded-full bg-cta px-7 py-3.5 text-sm font-bold text-on-cta shadow-xl shadow-cta/25 transition hover:bg-cta-hover"
          >
            Discover More
          </Link>
        </Reveal>

        <Reveal className="mt-16 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
            {homePage.introTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
            {homePage.introBody}
          </p>
        </Reveal>

        <div className="mt-20">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
              {homePage.announcementsTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-fg-muted">{homePage.announcementsIntro}</p>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {featuredPosts.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 2) * 80}>
                <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-accent/40 hover:bg-surface-hover">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                    Homilies/Reflections
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-fg">
                    <Link to={`/${post.slug}`} className="hover:text-accent">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs text-fg-subtle">
                    The Ten Talents initiative (Catholic Youths)
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted line-clamp-3">
                    {post.excerpt || post.content.slice(0, 180)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <Link
              to="/upcoming-programs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-soft transition hover:text-accent"
            >
              Explore All →
            </Link>
          </Reveal>
        </div>

        <div className="mt-20 border-t border-border-subtle pt-16">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
              {homePage.programsTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-fg-muted">{homePage.programsIntro}</p>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {homePage.programTeasers.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <h3 className="font-display text-lg font-semibold text-fg">{item.title}</h3>
                  <dl className="mt-3 space-y-1 text-sm text-fg-subtle">
                    <div>
                      <dt className="inline font-medium text-fg-muted">Date: </dt>
                      <dd className="inline">{item.date || "—"}</dd>
                    </div>
                    <div>
                      <dt className="inline font-medium text-fg-muted">Venue: </dt>
                      <dd className="inline">{item.venue || "—"}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm leading-relaxed text-fg-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-20 rounded-3xl border border-border bg-surface p-8 text-center sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-fg">{homePage.donateTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-fg-muted">{homePage.donateBody}</p>
          <Link
            to="/donations"
            className="mt-6 inline-flex rounded-full bg-cta px-7 py-3 text-sm font-bold text-on-cta transition hover:bg-cta-hover"
          >
            {homePage.donateCta}
          </Link>
          <p className="mt-6 text-sm text-fg-subtle">
            Bank details:
            <br />
            {homePage.bankDetails}
          </p>
        </Reveal>
      </section>
    </>
  );
}
