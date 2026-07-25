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
| **No secrets in client** | Public contact emails only; no API keys or tokens in the repo |
| **No `dangerouslySetInnerHTML`** | Content is static JSX; contact form does not echo user input as HTML |
| **Dependency audit** | `npm run audit` flags moderate+ vulnerabilities |

**CSP tradeoff:** Vite bundles application scripts under `/assets`, but `index.html` includes a small inline theme bootstrap script to prevent flash-of-wrong-theme. That script requires `'unsafe-inline'` in `script-src`. Tailwind/runtime styles similarly need `'unsafe-inline'` in `style-src`. Google Fonts are allowed via `fonts.googleapis.com` and `fonts.gstatic.com`. Supabase (`*.supabase.co`) is allowed in `connect-src` / `img-src` for the posts CMS. Tightening further would require moving the theme script to a hashed external file or using CSP nonces (not supported on Render static headers alone).

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
2. In **SQL Editor**, run [`supabase/migrations/001_posts.sql`](supabase/migrations/001_posts.sql).
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
7. Open `/admin`, sign in, create/edit/publish posts and upload images.

Without Supabase env vars the app still builds and serves the committed `posts.js` snapshot (CI-friendly).

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
3. Render reads `render.yaml` and creates a **Static Site** (`runtime: static`) with build command `npm ci --include=dev && npm run build` and publish directory `./build`. No start command is used.

### Alternative: Manual Static Site

1. **New → Static Site** → connect the repo.
2. **Build command:** `npm ci --include=dev && npm run build`
3. **Publish directory:** `build`
4. Add SPA rewrite `/*` → `/index.html` and cache headers for `/assets/*` if not inherited from the dashboard defaults.

### Web Service fallback (not preferred)

If you already have a **Web Service** instead of a Static Site, the `start` script serves the built files from `build` via `serve` (SPA fallback enabled). Set **Build command** to `npm ci --include=dev && npm run build` and **Start command** to `npm start`. A Static Site is simpler, cheaper, and better suited for this app.

### After config changes

Clear the build cache (**Settings → Clear build cache**) and trigger a **Manual Deploy** so Render picks up new build/start settings.

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
- `render.yaml` CSP allows `js.paystack.co`, `api.paystack.co`, `checkout.paystack.com`, and `*.supabase.co` (posts CMS).

