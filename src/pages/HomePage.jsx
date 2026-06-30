import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import { homePage } from "../data/content.js";
import { posts } from "../data/posts.js";

const announcementPosts = posts
  .filter((post) => post.category === "Homilies/Reflections")
  .slice(0, 6);

export default function HomePage() {
  return (
    <>
      <section id="top" className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28 lg:pt-48">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="glow-primary absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-[120px] animate-float-slow" />
          <div className="glow-accent absolute right-[8%] top-[20%] h-[340px] w-[340px] rounded-full blur-[110px] animate-float-slower" />
          <div className="bg-grid absolute inset-0" />
        </div>

        <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
          <Reveal
            as="h1"
            className="mx-auto max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            {homePage.hero}
          </Reveal>
          <Reveal delay={120} className="mt-9">
            <Link
              to={homePage.discoverMoreHref}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-cta px-7 py-3.5 text-sm font-bold text-on-cta shadow-xl shadow-cta/25 transition hover:bg-cta-hover"
            >
              Discover More
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border-subtle bg-bg-band py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal
              as="h2"
              className="font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl"
            >
              {homePage.introTitle}
            </Reveal>
            <Reveal as="p" delay={120} className="mt-6 text-base leading-relaxed text-fg-muted sm:text-lg">
              {homePage.introBody}
            </Reveal>
            <Reveal delay={180} className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-5 py-2.5 text-sm font-semibold text-fg transition hover:bg-surface-hover"
              >
                About Us & Contact →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-fg sm:text-4xl">
              {homePage.announcementsTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-fg-muted">{homePage.announcementsIntro}</p>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {announcementPosts.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 70}>
                <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-accent/40 hover:bg-surface-hover">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                    Homilies/Reflections
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-fg">
                    <Link to={`/${post.slug}`} className="hover:text-accent">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs text-fg-subtle">{post.date}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted line-clamp-3">
                    {post.excerpt || post.content.slice(0, 160)}
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

          <Reveal className="mt-10 text-center">
            <Link
              to="/daily-reflections"
              className="inline-flex items-center gap-2 rounded-full bg-cta px-6 py-3 text-sm font-bold text-on-cta transition hover:bg-cta-hover"
            >
              Explore All
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border-subtle bg-bg-band py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-fg sm:text-4xl">
              {homePage.programsTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-fg-muted">{homePage.programsIntro}</p>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {homePage.programTeasers.map((program, i) => (
              <Reveal key={program.title} delay={i * 70}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6 shadow-sm">
                  <h3 className="font-display text-lg font-semibold text-fg">{program.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">{program.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 text-center">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-6 py-3 text-sm font-semibold text-fg transition hover:bg-surface-hover"
            >
              Discover Our Programs →
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-fg sm:text-4xl">
              {homePage.donateTitle}
            </h2>
            <p className="mt-4 text-fg-muted">{homePage.donateBody}</p>
            <p className="mt-2 text-sm font-semibold text-fg">{homePage.bankDetails}</p>
          </Reveal>
          <Reveal delay={100} className="mt-8">
            <Link
              to="/donations"
              className="inline-flex items-center gap-2 rounded-full bg-cta px-7 py-3.5 text-sm font-bold text-on-cta transition hover:bg-cta-hover"
            >
              {homePage.donateCta}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
