import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HERO_BACKGROUNDS } from "../../data/heroBackgrounds.js";
import {
  EMPTY_HOMEPAGE_CONTENT,
  normalizeHomepageContent,
} from "../../data/homepageContent.js";
import { homePage as staticHome, hero as staticHero } from "../../data/content.js";
import {
  fetchAdminHomepageContent,
  saveHomepageContent,
  uploadHomepageImage,
} from "../../lib/homepageApi.js";

function defaultsFromStatic() {
  return normalizeHomepageContent({
    hero: {
      quote: staticHero.quote,
      quoteAttribution: staticHero.quoteAttribution,
      title: staticHero.title,
      description: staticHero.description,
    },
    discoverMoreHref: staticHome.discoverMoreHref,
    introTitle: staticHome.introTitle,
    introBody: staticHome.introBody,
    announcementsTitle: staticHome.announcementsTitle,
    announcementsIntro: staticHome.announcementsIntro,
    programsTitle: staticHome.programsTitle,
    programsIntro: staticHome.programsIntro,
    programTeasers: staticHome.programTeasers,
    donateTitle: staticHome.donateTitle,
    donateBody: staticHome.donateBody,
    donateCta: staticHome.donateCta,
    bankDetails: staticHome.bankDetails,
    heroImages: HERO_BACKGROUNDS,
  });
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-fg">{label}</span>
      {hint ? <span className="mt-0.5 block text-xs text-fg-subtle">{hint}</span> : null}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-bg px-3 py-2 text-sm text-fg outline-none transition focus:border-accent";
const textareaClass = `${inputClass} min-h-[6rem] resize-y`;

export default function AdminHomepagePage() {
  const [form, setForm] = useState(() => defaultsFromStatic());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetchAdminHomepageContent()
      .then((row) => {
        if (!active) return;
        const cms = row.content;
        const hasAny =
          Object.values(cms.hero).some((v) => String(v).trim()) ||
          cms.introTitle ||
          cms.introBody ||
          cms.announcementsTitle ||
          cms.programsTitle ||
          cms.donateTitle ||
          cms.programTeasers.length ||
          cms.heroImages.length;
        setForm(hasAny ? cms : defaultsFromStatic());
        setSavedAt(row.updated_at);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load homepage content.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setHeroField(key, value) {
    setForm((prev) => ({
      ...prev,
      hero: { ...prev.hero, [key]: value },
    }));
  }

  function setTeaser(index, key, value) {
    setForm((prev) => {
      const next = prev.programTeasers.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      );
      return { ...prev, programTeasers: next };
    });
  }

  function addTeaser() {
    setForm((prev) => ({
      ...prev,
      programTeasers: [...prev.programTeasers, { title: "", description: "" }],
    }));
  }

  function removeTeaser(index) {
    setForm((prev) => ({
      ...prev,
      programTeasers: prev.programTeasers.filter((_, i) => i !== index),
    }));
  }

  function setHeroImage(index, key, value) {
    setForm((prev) => {
      const next = prev.heroImages.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      );
      return { ...prev, heroImages: next };
    });
  }

  function addHeroImage() {
    setForm((prev) => ({
      ...prev,
      heroImages: [...prev.heroImages, { src: "", alt: "" }],
    }));
  }

  function removeHeroImage(index) {
    setForm((prev) => ({
      ...prev,
      heroImages: prev.heroImages.filter((_, i) => i !== index),
    }));
  }

  function moveHeroImage(index, direction) {
    setForm((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.heroImages.length) return prev;
      const next = [...prev.heroImages];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return { ...prev, heroImages: next };
    });
  }

  async function handleImageUpload(index, event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploadingIndex(index);
    setError("");
    try {
      const url = await uploadHomepageImage(file);
      setHeroImage(index, "src", url);
    } catch (err) {
      setError(err.message || "Image upload failed.");
    } finally {
      setUploadingIndex(null);
    }
  }

  function resetToDefaults() {
    if (
      !window.confirm(
        "Replace the form with the built-in default homepage copy and images?"
      )
    ) {
      return;
    }
    setForm(defaultsFromStatic());
    setMessage("Form reset to site defaults. Save to publish.");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const saved = await saveHomepageContent(form);
      setForm(saved.content);
      setSavedAt(saved.updated_at);
      setMessage("Homepage content saved. View the live site to confirm.");
    } catch (err) {
      setError(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-fg-muted">Loading homepage content…</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-fg">Homepage</h1>
          <p className="mt-1 max-w-2xl text-sm text-fg-muted">
            Edit the main page hero text, section copy, program teasers, and slideshow
            images. Leave a field blank to keep the translated default for that field.
          </p>
          {savedAt ? (
            <p className="mt-2 text-xs text-fg-subtle">
              Last saved {new Date(savedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-fg transition hover:bg-surface-hover"
          >
            Preview site
          </Link>
          <button
            type="button"
            onClick={resetToDefaults}
            className="rounded-full border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-fg transition hover:bg-surface-hover"
          >
            Load defaults
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-border-subtle bg-bg/60 p-3 text-sm text-red-400">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-4 rounded-xl border border-border-subtle bg-bg/60 p-3 text-sm text-accent">
          {message}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-10">
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-fg">Hero</h2>
          <Field label="Quote">
            <textarea
              className={textareaClass}
              value={form.hero.quote}
              onChange={(e) => setHeroField("quote", e.target.value)}
            />
          </Field>
          <Field label="Quote attribution">
            <input
              className={inputClass}
              value={form.hero.quoteAttribution}
              onChange={(e) => setHeroField("quoteAttribution", e.target.value)}
            />
          </Field>
          <Field label="Subtitle (under the brand name)">
            <input
              className={inputClass}
              value={form.hero.title}
              onChange={(e) => setHeroField("title", e.target.value)}
            />
          </Field>
          <Field label="Description">
            <textarea
              className={`${textareaClass} min-h-[10rem]`}
              value={form.hero.description}
              onChange={(e) => setHeroField("description", e.target.value)}
            />
          </Field>
          <Field label="Discover more link" hint="Path or URL for the secondary hero button">
            <input
              className={inputClass}
              value={form.discoverMoreHref}
              onChange={(e) => setField("discoverMoreHref", e.target.value)}
              placeholder="/programs"
            />
          </Field>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-fg">
              Hero slideshow images
            </h2>
            <button
              type="button"
              onClick={addHeroImage}
              className="rounded-full border border-border-strong bg-surface px-4 py-2 text-xs font-semibold text-fg transition hover:bg-surface-hover"
            >
              Add image
            </button>
          </div>
          <p className="text-xs text-fg-subtle">
            Order is the play sequence. Upload a file or paste a public image URL. If the
            list is empty when saved, the built-in photos are used.
          </p>
          {form.heroImages.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-fg-muted">
              No custom images yet. Add one, or leave empty to use site defaults.
            </p>
          ) : (
            <ul className="space-y-4">
              {form.heroImages.map((image, index) => (
                <li
                  key={`hero-image-${index}`}
                  className="rounded-2xl border border-border bg-surface p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-bg sm:w-40">
                      {image.src ? (
                        <img
                          src={image.src}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-fg-subtle">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-3">
                      <Field label="Image URL">
                        <input
                          className={inputClass}
                          value={image.src}
                          onChange={(e) => setHeroImage(index, "src", e.target.value)}
                          placeholder="https://… or /images/…"
                        />
                      </Field>
                      <Field label="Alt text">
                        <input
                          className={inputClass}
                          value={image.alt}
                          onChange={(e) => setHeroImage(index, "alt", e.target.value)}
                        />
                      </Field>
                      <div className="flex flex-wrap gap-2">
                        <label className="cursor-pointer rounded-full border border-border-strong bg-bg px-3 py-1.5 text-xs font-semibold text-fg transition hover:bg-surface-hover">
                          {uploadingIndex === index ? "Uploading…" : "Upload"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingIndex !== null}
                            onChange={(e) => handleImageUpload(index, e)}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => moveHeroImage(index, -1)}
                          disabled={index === 0}
                          className="rounded-full border border-border-strong bg-bg px-3 py-1.5 text-xs font-semibold text-fg disabled:opacity-40"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          onClick={() => moveHeroImage(index, 1)}
                          disabled={index === form.heroImages.length - 1}
                          className="rounded-full border border-border-strong bg-bg px-3 py-1.5 text-xs font-semibold text-fg disabled:opacity-40"
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          onClick={() => removeHeroImage(index)}
                          className="rounded-full border border-border-strong bg-bg px-3 py-1.5 text-xs font-semibold text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-fg">Intro</h2>
          <Field label="Title">
            <input
              className={inputClass}
              value={form.introTitle}
              onChange={(e) => setField("introTitle", e.target.value)}
            />
          </Field>
          <Field label="Body">
            <textarea
              className={`${textareaClass} min-h-[8rem]`}
              value={form.introBody}
              onChange={(e) => setField("introBody", e.target.value)}
            />
          </Field>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-fg">Announcements</h2>
          <Field label="Title">
            <input
              className={inputClass}
              value={form.announcementsTitle}
              onChange={(e) => setField("announcementsTitle", e.target.value)}
            />
          </Field>
          <Field label="Intro">
            <textarea
              className={textareaClass}
              value={form.announcementsIntro}
              onChange={(e) => setField("announcementsIntro", e.target.value)}
            />
          </Field>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-fg">Programs</h2>
            <button
              type="button"
              onClick={addTeaser}
              className="rounded-full border border-border-strong bg-surface px-4 py-2 text-xs font-semibold text-fg transition hover:bg-surface-hover"
            >
              Add teaser
            </button>
          </div>
          <Field label="Section title">
            <input
              className={inputClass}
              value={form.programsTitle}
              onChange={(e) => setField("programsTitle", e.target.value)}
            />
          </Field>
          <Field label="Section intro">
            <textarea
              className={textareaClass}
              value={form.programsIntro}
              onChange={(e) => setField("programsIntro", e.target.value)}
            />
          </Field>
          {form.programTeasers.map((teaser, index) => (
            <div
              key={`teaser-${index}`}
              className="space-y-3 rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-fg">Teaser {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeTeaser(index)}
                  className="text-xs font-semibold text-red-400"
                >
                  Remove
                </button>
              </div>
              <Field label="Title">
                <input
                  className={inputClass}
                  value={teaser.title}
                  onChange={(e) => setTeaser(index, "title", e.target.value)}
                />
              </Field>
              <Field label="Description">
                <textarea
                  className={textareaClass}
                  value={teaser.description}
                  onChange={(e) => setTeaser(index, "description", e.target.value)}
                />
              </Field>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-fg">Donate</h2>
          <Field label="Title">
            <input
              className={inputClass}
              value={form.donateTitle}
              onChange={(e) => setField("donateTitle", e.target.value)}
            />
          </Field>
          <Field label="Body">
            <textarea
              className={textareaClass}
              value={form.donateBody}
              onChange={(e) => setField("donateBody", e.target.value)}
            />
          </Field>
          <Field label="Button label">
            <input
              className={inputClass}
              value={form.donateCta}
              onChange={(e) => setField("donateCta", e.target.value)}
            />
          </Field>
          <Field label="Bank details line">
            <input
              className={inputClass}
              value={form.bankDetails}
              onChange={(e) => setField("bankDetails", e.target.value)}
            />
          </Field>
        </section>

        <div className="flex flex-wrap items-center gap-3 border-t border-border-subtle pt-6">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save homepage"}
          </button>
          <button
            type="button"
            onClick={() => setForm(EMPTY_HOMEPAGE_CONTENT)}
            className="rounded-full border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-fg transition hover:bg-surface-hover"
          >
            Clear all fields
          </button>
        </div>
      </form>
    </div>
  );
}
