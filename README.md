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
npm run build    # production build into /dist
npm run preview  # preview the production build locally
```

## Project structure

```
index.html              # entry HTML, fonts & meta tags
public/favicon.svg      # brand mark
src/
  main.jsx              # React entry
  App.jsx               # page composition
  index.css            # Tailwind import + design tokens (@theme) + animations
  data/content.js      # all copy: nav, goals, team, stats (easy to edit)
  components/
    Navbar.jsx          # sticky nav with mobile menu
    Hero.jsx            # headline + stats
    Mission.jsx         # mission + value pillars
    Goals.jsx           # the 8 goals, grouped into 4 themes
    Team.jsx            # founder spotlight + team grid
    Join.jsx            # call-to-action
    Footer.jsx
    Reveal.jsx          # scroll-reveal wrapper
    Logo.jsx
```

## Customizing

- **Copy / content:** edit `src/data/content.js`.
- **Brand colors & fonts:** edit the `@theme` block in `src/index.css`.
- **Sections:** each lives in its own file under `src/components/`.

## Design notes

- Palette: deep "night" indigo/purple backgrounds with warm **gold** accents —
  evoking faith, royalty, and the "talents" (gold coins) of the parable.
- Typography: `Fraunces` (display serif) paired with `Plus Jakarta Sans` (UI).
- Built mobile-first, fully responsive, with reduced-motion support.

## Deploy on Render

This project is a **static Vite SPA** — deploy it as a **Static Site**, not a Node Web Service (no runtime server required).

### Recommended: Blueprint (uses `render.yaml`)

1. In the [Render Dashboard](https://dashboard.render.com/), choose **New → Blueprint**.
2. Connect the GitHub repo and grant Render access if the repo is private (**GitHub → Settings → Applications → Render → Configure → Repository access**).
3. Render reads `render.yaml` and creates a **Static Site** (`runtime: static`) with build command `npm ci --include=dev && npm run build` and publish directory `./dist`. No start command is used.

### Alternative: Manual Static Site

1. **New → Static Site** → connect the repo.
2. **Build command:** `npm ci --include=dev && npm run build`
3. **Publish directory:** `dist`
4. Add SPA rewrite `/*` → `/index.html` and cache headers for `/assets/*` if not inherited from the dashboard defaults.

### Web Service fallback (not preferred)

If you already have a **Web Service** instead of a Static Site, the `start` script serves the built files from `dist` via `serve` (SPA fallback enabled). Set **Build command** to `npm ci --include=dev && npm run build` and **Start command** to `npm start`. A Static Site is simpler, cheaper, and better suited for this app.

### After config changes

Clear the build cache (**Settings → Clear build cache**) and trigger a **Manual Deploy** so Render picks up new build/start settings.
