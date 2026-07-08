# 02 — Application Architecture

**Status:** Accepted 2026-07-07 — Option A (React Router v7 framework mode) chosen; no blog; `/about` stays

## Shape of the app

A small, mostly-static marketing site: two content routes plus a 404. No global state
manager, no data fetching layer — the only runtime integrations are the Calendly embed and
a `mailto:` path.

```
src/
  main.tsx                  # entry; router + prerender wiring
  routes/
    home/                   # / — hero, trust, services, process, pricing, faq, booking, contact
    about/                  # /about
    not-found/              # 404 (SEO item M8)
  components/               # shared presentational components (nav, footer, section primitives)
  content/                  # typed content modules — single source of truth for copy
    business-info.ts        # replaces Angular BusinessInfoService (email, hours, links)
    services.ts             # service line copy
    seo.ts                  # per-route title/description/OG/schema builders
  design/
    tokens.css              # CSS custom properties: color, type scale, spacing, motion
  assets/
```

Conventions (from the template + React norms):

- Function components, hooks, `import type` for types, no enums.
- Co-located `*.test.tsx` per component; Testing Library queries by role/label.
- Styling via plain CSS modules/files consuming `design/tokens.css` custom properties —
  no CSS framework, keeping the template's dependency surface minimal. (If we later want
  utilities, Tailwind is a separate decision; not proposed here.)

## Routing & rendering (decision D3)

Today Angular SSR prerenders `/` and `/about`, and crawlers receive complete HTML. A plain
Vite SPA would regress this — unacceptable given the SEO investment. Options:

| Option                                                               | How                                                                                                                                         | Trade-offs                                                                                                  |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **A. React Router v7 framework mode with `prerender` (recommended)** | Swap `@vitejs/plugin-react` for `@react-router/dev`; declare routes in `routes.ts`; `prerender: ['/', '/about']` emits static HTML at build | First-party SSG, typed routes, clean 404 handling; one deliberate deviation from the template's Vite plugin |
| B. `vite-react-ssg`                                                  | Keep template's plugin; library walks react-router routes and prerenders                                                                    | Zero template deviation, but a smaller community project on the critical path                               |
| C. SPA + meta-only head management                                   | No prerender                                                                                                                                | Rejected: crawler-visible HTML regression                                                                   |

**Recommendation: A.** It is the maintained, first-party path to exactly what the site
needs (static HTML per route, hydrated after load), and the output stays a purely static
`dist/` that Azure SWA serves unchanged.

Head management (titles, meta, OG, JSON-LD) is emitted per-route at prerender time from
`content/seo.ts`, so parity checks in 04 are testable with a plain `grep` of `dist/`.

## Third-party integrations

- **Calendly**: the inline embed in the Angular app is dead code (the booking component
  is not mounted on any route) and the live behavior is an external link. The rebuild
  drops the embed, `widget.js`, and the render-blocking `widget.css` entirely; "Book a
  call" opens Calendly in a new tab. SEO items H4 (async CSS) and M7 (noscript) are
  closed as moot.
- **No analytics change** — whatever exists in `index.html` today carries over as-is.

## Testing strategy

| Layer           | Tool                      | What it covers                                                                                                                 |
| --------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Unit/component  | Vitest + Testing Library  | Rendering of each section from content modules; a11y-oriented queries (roles, labels); SEO builders return correct meta/schema |
| Prerender smoke | Vitest (node env)         | After `pnpm build`, assert `dist/index.html` and `dist/about/index.html` contain title, description, JSON-LD, and H1           |
| E2E             | Playwright (carried over) | Page journey: nav anchors, booking section reachable, contact mailto, 404 route; axe or role-based a11y assertions             |

## Build & deploy flow

```
pnpm build  →  tsc -b  →  vite build (+ prerender)  →  dist/  (fully static)
release published  →  deploy-app-prod.yaml  →  SWA upload of dist/ (skip_app_build: true)
```

`staticwebapp.config.json` (SEO item H1) is authored in `public/` so it lands at the root
of `dist/` automatically.

## Open questions

1. Any appetite for a blog now (SEO item L5)? Framework-mode prerendering makes MD-driven
   routes cheap later; **recommendation: out of scope for the rebuild, design the routes
   folder so it slots in.**
2. Keep `/about` as a separate route (current behavior) — assumed yes.
