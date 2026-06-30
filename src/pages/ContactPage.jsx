import { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { contactPage, site } from "../data/content.js";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <PageHeader title={contactPage.title} description={contactPage.intro} />
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="grid gap-3 sm:grid-cols-2">
              {contactPage.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-border bg-surface px-5 py-4 text-center text-sm font-semibold text-fg transition hover:border-accent/40 hover:bg-surface-hover"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8"
            >
              {submitted ? (
                <p className="text-fg-muted">
                  Thank you for your message. We will come back to you as soon as possible.
                </p>
              ) : (
                <>
                  <div className="space-y-5">
                    <label className="block">
                      <span className="text-sm font-medium text-fg">
                        Name <span className="text-accent">*</span>
                      </span>
                      <input
                        required
                        type="text"
                        name="name"
                        className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-fg">
                        Email <span className="text-accent">*</span>
                      </span>
                      <input
                        required
                        type="email"
                        name="email"
                        className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-fg">Subject</span>
                      <input
                        type="text"
                        name="subject"
                        className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-fg">
                        Message <span className="text-accent">*</span>
                      </span>
                      <textarea
                        required
                        name="message"
                        rows={5}
                        className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="mt-6 rounded-full bg-cta px-7 py-3 text-sm font-bold text-on-cta transition hover:bg-cta-hover"
                  >
                    Submit
                  </button>
                </>
              )}
            </form>
          </Reveal>
        </div>

        <Reveal className="mt-8 text-center text-sm text-fg-subtle">
          <a href={`mailto:${site.email}`} className="text-primary-soft hover:text-accent">
            {site.email}
          </a>
        </Reveal>
      </section>
    </>
  );
}
