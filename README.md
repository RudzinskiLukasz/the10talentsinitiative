# The Ten Talents Initiative — Landing Page

A slick, modern landing page for **The Ten Talents Initiative**, a Catholic
youth empowerment organization that nurtures young people's God-given gifts
through faith, mentorship, media, and community.

> _My gifts are for Christ and His Church._

This is the starting point for a full revamp of
[the10talentsinitiative.com](https://the10talentsinitiative.com/).

## Tech stack

- **Vite 7** — fast dev server & build
- **React 19**
- **Tailwind CSS v4** — via the official `@tailwindcss/vite` plugin (no config file; theme tokens live in `src/index.css`)
- Lightweight, dependency-free scroll-reveal animations (`IntersectionObserver`)

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into /build
npm run preview  # preview the production build locally
npm run test     # run tests in watch mode
npm run test:run # one-shot test run (CI / pre-push)
npm run check    # test + production build
npm audit        # dependency vulnerability scan (moderate+)
```

### Pre-push checklist

Before pushing, run:

```bash
npm run test:run && npm run build && npm audit
```

Or use the combined shortcut:

```bash
npm run check && npm audit
```

GitHub Actions (`.github/workflows/test.yml`) runs tests, build, and audit on every push/PR to `main`.

## Security

This static SPA uses defense-in-depth measures suitable for a client-rendered site:

| Measure | Where |
|--------|--------|
| **Security headers** | `render.yaml` — `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy` |
| **Meta tags** | `index.html` — `X-Content-Type-Options`, `referrer` policy |
| **External links** | `rel="noopener noreferrer"` on all `target="_blank"` links (e.g. Contact social links) |
| **No secrets in client** | Public keys only (`VITE_PAYSTACK_PUBLIC_KEY`, `VITE_WEB3FORMS_ACCESS_KEY`, Supabase anon); never service-role / secret keys |
| **No `dangerouslySetInnerHTML`** | Content is static JSX; contact form does not echo user input as HTML |
| **Dependency audit** | `npm run audit` flags moderate+ vulnerabilities |

**CSP tradeoff:** Vite bundles application scripts under `/assets`, but `index.html` includes a small inline theme bootstrap script to prevent flash-of-wrong-theme. That script requires `'unsafe-inline'` in `script-src`. Tailwind/runtime styles similarly need `'unsafe-inline'` in `style-src`. Google Fonts are allowed via `fonts.googleapis.com` and `fonts.gstatic.com`. Supabase (`*.supabase.co`) is allowed in `connect-src` / `img-src` / `media-src` for the posts CMS and Records audio. YouTube/Vimeo embeds use `frame-src` (`youtube.com`, `youtube-nocookie.com`, `player.vimeo.com`). Web3Forms (`api.web3forms.com`) is allowed in `connect-src` for the Contact Us form. Tightening further would require moving the theme script to a hashed external file or using CSP nonces (not supported on Render static headers alone).

## Project structure

```
index.html                 # entry HTML, fonts & meta tags
public/                    # static assets (logos, post images fallback)
supabase/migrations/       # SQL schema for posts + storage RLS
scripts/                   # locale tooling, WP sync, Supabase seed
src/
  main.jsx                 # React entry
  App.jsx                  # routes (public + /admin)
  index.css                # Tailwind + design tokens
  lib/supabase.js          # Supabase client
  lib/postsApi.js          # posts CRUD / public fetch
  data/posts.js            # static fallback snapshot (used when env unset)
  data/site.js             # site metadata / social links
  i18n/                    # 8 locales
  pages/                   # public pages
  pages/admin/             # admin login + post editor
  components/              # UI components
```

## Customizing

- **UI copy:** edit locale JSON under `src/i18n/locales/` (English source of truth: `en.json`).
- **Posts:** use `/admin` once Supabase is configured (see below). Without env vars, the site falls back to `src/data/posts.js`.
- **Brand colors & fonts:** edit the `@theme` block in `src/index.css`.

## Posts CMS (Supabase)

The public site stays a **Render Static Site**. Content lives in **Supabase** (Postgres + Auth + Storage).

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run migrations in order:
   - [`supabase/migrations/001_posts.sql`](supabase/migrations/001_posts.sql)
   - [`supabase/migrations/002_tracks.sql`](supabase/migrations/002_tracks.sql) (T-Talents Records music)
   - [`supabase/migrations/003_post_scheduling_and_video.sql`](supabase/migrations/003_post_scheduling_and_video.sql) (scheduled posts + video uploads)
3. **Authentication → Users → Add user** — create 1–2 admin emails (password sign-in).
4. Copy **Project URL** and **anon public** key into `.env` (see `.env.example`):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. On Render → Environment, add the same two `VITE_*` variables and redeploy.
6. Optional one-time import of the existing static posts:
   ```bash
   # add SUPABASE_SERVICE_ROLE_KEY to .env (never commit; never put in Vite/Render client env)
   npm run seed:posts
   ```
7. Open `/admin`, sign in:
   - **Posts** — create/edit articles with a TipTap visual editor (images, uploaded video, YouTube/Vimeo embeds). Statuses: `draft`, `published`, or `scheduled` (with publish date/time). Scheduled posts appear on the public site once `publish_at` is reached (RLS + client filter; no Edge Function).
   - **Records** (`/admin/tracks`) — upload songs for T-Talents Records (visitors download on `/t-talents-records`)

Without Supabase env vars the app still builds and serves the committed `posts.js` snapshot (CI-friendly). Records stays empty until tracks are published in admin.

## Design notes

- Palette: deep "night" indigo/purple backgrounds with warm **gold** accents —
  evoking faith, royalty, and the "talents" (gold coins) of the parable.
- Typography: `Fraunces` (display serif) paired with `Plus Jakarta Sans` (UI).
- Built mobile-first, fully responsive, with reduced-motion support.

## Deploy on Render

This project is a **static Vite SPA** — deploy it as a **Static Site**, not a Node Web Service (no runtime server required). The admin UI is also static; it talks to Supabase from the browser.

### Recommended: Blueprint (uses `render.yaml`)

1. In the [Render Dashboard](https://dashboard.render.com/), choose **New → Blueprint**.
2. Connect the GitHub repo and grant Render access if the repo is private (**GitHub → Settings → Applications → Render → Configure → Repository access**).
3. Render reads `render.yaml` and creates a **Static Site** (`runtime: static`) with build command `npm ci --include=dev && npm run build` and publish directory `./build`. No start command is used. The Blueprint includes SPA rewrite rules so `/admin` and other deep links serve `index.html`.

### Alternative: Manual Static Site

1. **New → Static Site** → connect the repo.
2. **Build command:** `npm ci --include=dev && npm run build`
3. **Publish directory:** `build`
4. **Required:** add SPA rewrite `/*` → `/index.html` (**Redirects/Rewrites** tab) and cache headers for `/assets/*` if not inherited from the dashboard defaults.

> Manual Static Sites do **not** auto-apply `render.yaml` routes. If you created the service without a Blueprint, you must add the rewrite in the Dashboard (or convert the service to a Blueprint) — otherwise every deep link returns CDN `404 Not Found`.

### Web Service fallback (not preferred)

If you already have a **Web Service** instead of a Static Site, the `start` script serves the built files from `build` via `serve` (SPA fallback enabled). Set **Build command** to `npm ci --include=dev && npm run build` and **Start command** to `npm start`. A Static Site is simpler, cheaper, and better suited for this app.

### After config changes

Clear the build cache (**Settings → Clear build cache**) and trigger a **Manual Deploy** so Render picks up new build/start settings.

### Custom domain (Namecheap → Render) + `/admin`

`the10talentsinitiative.com` / `www` should be a **Render custom domain** (CNAME/ALIAS to the `*.onrender.com` service), not a naked HTTP “URL redirect” that drops paths. Both hosts serve the same Static Site; React Router paths are identical (`/admin`, `/admin/login`, …).

**Why only `/admin` looks broken:** public pages are usually opened via in-app links (client-side routing) or after the PWA service worker is installed (it can fall back to `index.html`). `/admin` is almost always typed or bookmarked as a **first request** to the CDN. Without the SPA rewrite, Render returns plain `404 Not Found` for that request on **both** the custom domain and `*.onrender.com`.

**Fix (do this once in Render):**

1. Open the Static Site → **Redirects/Rewrites**.
2. Add: Source `/*` · Destination `/index.html` · Action **Rewrite** (or sync Blueprint so `render.yaml` applies).
3. Redeploy if prompted.
4. Verify:
   ```bash
   npm run smoke:routes
   # or: npm run smoke:routes -- https://the10talentsinitiative.onrender.com
   ```
   `/admin` and `/programs` must return HTML (`200`), not plain `Not Found`.

**Supabase Auth URLs** (Authentication → URL Configuration), so sign-in works on every host:

| Field | Value |
|-------|--------|
| Site URL | `https://www.the10talentsinitiative.com` |
| Redirect URLs | `https://www.the10talentsinitiative.com/**` · `https://the10talentsinitiative.com/**` · `https://the10talentsinitiative.onrender.com/**` |

Until the rewrite is live, the build also emits file-based shells (`/admin.html`, `/admin/index.html`) that load the same app and normalize onto `/admin`. Prefer fixing the rewrite so the canonical URL stays `/admin`.

### Publishing content (no redeploy)

With Supabase env vars set on Render, **Save** with status **Published** writes straight to the database. Public pages and site search fetch that list live (merged with the static archive). New posts, images, and Records tracks appear on the next page load — typically **within seconds**. Open tabs also refetch when you return to them (focus / visibility), so you usually do not need a hard refresh after publishing in `/admin`.

Drafts stay private. Videos are not in the CMS yet.

## Contact form (Gmail)

The Contact Us form sends messages to **thetentalentsinitiative@gmail.com** via [Web3Forms](https://web3forms.com) (no backend required).

1. Open [web3forms.com](https://web3forms.com), enter `thetentalentsinitiative@gmail.com`, and create an access key.
2. Confirm the email if Web3Forms asks you to.
3. Add to `.env` (and Render → Environment):
   - `VITE_WEB3FORMS_ACCESS_KEY` = your access key
4. Redeploy so the production build picks up the key.

Replies go to the visitor’s address (`replyto`). Without this env var, submit shows an error instead of a fake success.

## Donations & payments

The `/donations` page supports **bank transfer** (always free) and optional **Paystack** online payments (no monthly fee; small per-transaction charge only).

### Bank transfer (zero cost)

Set these environment variables on Render (or in a local `.env` file copied from `.env.example`):

| Variable | Description |
|----------|-------------|
| `VITE_ZENITH_ACCOUNT_NAME` | Account holder (default: The Ten Talents Humanitarian Initiative) |
| `VITE_ZENITH_ACCOUNT_NUMBER` | Zenith Bank account number |
| `VITE_ZENITH_BANK_NAME` | Bank name (default: Zenith Bank) |
| `VITE_ZENITH_SORT_CODE` | Optional sort code / NIB |

If `VITE_ZENITH_ACCOUNT_NUMBER` is empty, the page prompts visitors to contact you for bank details.

**Source:** Account name comes from the legacy site content (`content.js` / i18n). The old WordPress `/donations` page did not publish a full account number, so the number must be set via env vars.

### Paystack (optional, client-side only)

1. Create a free account at [paystack.com](https://paystack.com).
2. Complete business verification and add your **Zenith Bank** account as the settlement account (payouts go there).
3. In Paystack Dashboard → **Settings → API Keys & Webhooks**, copy the **Public Key** (`pk_test_…` for testing, `pk_live_…` for production).
4. On Render → your Static Site → **Environment**, add:
   - `VITE_PAYSTACK_PUBLIC_KEY` = your public key

No backend or webhook is required for the MVP — successful payments appear in the Paystack dashboard. The site loads `@paystack/inline-js` only when a donor clicks **Donate now**.

**Costs:** Paystack has **no monthly fee** on the standard plan; you pay a small percentage per successful transaction (standard Nigerian merchant rates). Bank transfer has **no platform fee**.

### Security

- Never commit real account numbers or API keys — use `.env` locally and Render env vars in production.
- Only the Paystack **public** key is embedded in the client bundle; secret keys stay in Paystack Dashboard only.
- `render.yaml` CSP allows `js.paystack.co`, `api.paystack.co`, `checkout.paystack.com`, `api.web3forms.com` (contact form), and `*.supabase.co` (posts CMS).

