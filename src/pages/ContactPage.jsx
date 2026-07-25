import { useState } from "react";
import { useTranslation } from "react-i18next";
import Hero from "../components/Hero.jsx";
import Mission from "../components/Mission.jsx";
import Goals from "../components/Goals.jsx";
import Team from "../components/Team.jsx";
import Join from "../components/Join.jsx";
import Reveal from "../components/Reveal.jsx";
import SocialIcon from "../components/SocialIcon.jsx";
import { site, contactSocial } from "../data/site.js";
import { submitContactMessage } from "../lib/contact.js";

export default function ContactPage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSending(true);

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      await submitContactMessage({
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        subject: String(data.get("subject") || "").trim(),
        message: String(data.get("message") || "").trim(),
      });
      setSubmitted(true);
    } catch {
      setError(t("common.sendError"));
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Hero />
      <Mission />
      <Goals />
      <Team />

      <section id="contact" className="scroll-mt-20 border-t border-border-subtle py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-fg sm:text-4xl">
              {t("contactPage.title")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
              {t("contactPage.intro")}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <div className="grid gap-3 sm:grid-cols-2">
                {contactSocial.map((item, index) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface px-5 py-4 text-center text-sm font-semibold text-fg transition hover:border-accent/40 hover:bg-surface-hover"
                  >
                    <SocialIcon name={item.key} className="h-5 w-5 shrink-0 text-fg-muted" />
                    {t(`contactPage.social.${index}`)}
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
                  <p className="text-fg-muted">{t("common.thankYouMessage")}</p>
                ) : (
                  <>
                    <div className="space-y-5">
                      <label className="block">
                        <span className="text-sm font-medium text-fg">
                          {t("common.name")}{" "}
                          <span className="text-accent">{t("common.required")}</span>
                        </span>
                        <input
                          required
                          type="text"
                          name="name"
                          autoComplete="name"
                          disabled={sending}
                          className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2 disabled:opacity-60"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-fg">
                          {t("common.emailLabel")}{" "}
                          <span className="text-accent">{t("common.required")}</span>
                        </span>
                        <input
                          required
                          type="email"
                          name="email"
                          autoComplete="email"
                          disabled={sending}
                          className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2 disabled:opacity-60"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-fg">{t("common.subject")}</span>
                        <input
                          type="text"
                          name="subject"
                          disabled={sending}
                          className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2 disabled:opacity-60"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-fg">
                          {t("common.message")}{" "}
                          <span className="text-accent">{t("common.required")}</span>
                        </span>
                        <textarea
                          required
                          name="message"
                          rows={5}
                          disabled={sending}
                          className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2 disabled:opacity-60"
                        />
                      </label>
                    </div>
                    {error ? (
                      <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
                        {error}
                      </p>
                    ) : null}
                    <button
                      type="submit"
                      disabled={sending}
                      className="mt-6 rounded-full bg-cta px-7 py-3 text-sm font-bold text-on-cta transition hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sending ? t("common.sending") : t("common.submit")}
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
        </div>
      </section>

      <Join />
    </>
  );
}
