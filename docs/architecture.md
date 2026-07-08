# Architecture

## Stack

- Vite 8 + React 19 + TypeScript (strict, project references).
- React Router 7 framework mode with `ssr: false` and build-time prerendering.
- Plain CSS with design tokens (custom properties); no CSS framework.
- Self-hosted fonts via Fontsource (Bricolage Grotesque, Public Sans, IBM Plex Mono).
- Vitest + Testing Library for unit tests; Playwright for e2e.
- pnpm (pinned via the `packageManager` field, managed by Corepack).

## Routing and Rendering

Routes are declared in `src/routes.ts` and implemented as route modules under
`src/routes/`:

| Route | Module | Notes |
| --- | --- | --- |
| `/` | `routes/home.tsx` | Full landing journey + JSON-LD blocks |
| `/about` | `routes/about.tsx` | Founder background (E-E-A-T) |
| `*` | `routes/not-found.tsx` | Branded 404, `noindex` |

`react-router.config.ts` sets `ssr: false` and `prerender: ['/', '/about', '/404']`. The
build emits static HTML for each route into `build/client/`; the client bundle hydrates
after load. There is no runtime server — Azure Static Web Apps serves the output as-is,
and `public/staticwebapp.config.json` maps unknown paths to `/404/index.html` with a real
404 status.

Each route module exports a `meta()` function built from `src/content/seo.ts`, so titles,
descriptions, canonical URLs, Open Graph tags, and JSON-LD are present in the prerendered
HTML without JavaScript.

## Document Shell

`src/root.tsx` owns the HTML document (`Layout` export with `<Meta/>`/`<Links/>`), renders
the fixed `Nav` and `Footer` around the route `Outlet`, imports the font CSS and
`src/design/base.css`, and provides the root `ErrorBoundary`.

## Content Ownership

All copy and business data live in typed modules under `src/content/` — components never
hardcode copy:

- `business-info.ts` — email, response time, availability, target segment, `mailto:` href.
- `site.ts` — site name, URL, tagline, Calendly URL, GitHub URL, location (San Diego, CA).
- `services.ts`, `process.ts`, `trust.ts`, `faq.ts`, `about.ts` — section content.
- `seo.ts` — per-route meta builder and JSON-LD builders (Organization + WebSite graph,
  ProfessionalService with offer catalog, FAQPage).

## Components and Styling

Presentational components live in `src/components/` with a co-located CSS file per
component (`nav.tsx` + `nav.css`). Every color, font, size, spacing step, z-index layer,
and motion token is a custom property in `src/design/tokens.css`; `src/design/base.css`
holds the reset, primitives (section labels, buttons, skip link), and the CSS-only
scroll-reveal (`animation-timeline: view()`, transform-only, reduced-motion gated).

The design direction ("Engineered Dark") is specified in
`docs/redesign/03-design-direction.md`. Do not introduce raw hex values in components or
unrelated visual systems.

## Static Assets

`public/` is copied verbatim into the build output: favicons, brand images (WebP variants
generated for page use; PNG originals kept for `og:image`), `robots.txt`, `llms.txt`, and
`staticwebapp.config.json`. `sitemap.xml` is generated at build time by
`scripts/generate-sitemap.mjs` — add new prerendered routes to both
`react-router.config.ts` and that script.
