# Quality and Operations

## Required Checks

Before completing a code change:

```bash
pnpm lint
pnpm build   # tsc -b gates the build; also regenerates the sitemap
pnpm test
```

Run `pnpm test:e2e` when the change affects rendered pages, navigation, or interactive
behavior. For documentation-only changes, verify that `mkdocs.yml` navigation matches the
files in `docs/`.

The pre-commit hooks run the same commands, so a passing commit implies passing CI.

## Testing Strategy

- Unit/component specs (Vitest + Testing Library) live beside their source. Query by
  role/label; test rendered content users depend on, content-module wiring, SEO builders,
  and UI state (nav scroll, mobile menu, FAQ accordion).
- E2e specs (Playwright, `e2e/`) cover the conversion journey: nav links, Calendly CTA
  attributes, section anchors, the about page, the 404 page, the skip link, and the
  mobile menu. The dev server is started automatically by `playwright.config.ts`.
- Prerendered-output checks: the home/about/404 HTML in `build/client/` must contain
  title, meta description, canonical, Open Graph tags, and JSON-LD. When touching SEO
  surfaces, grep the build output before shipping.
- E2e interactions that depend on JavaScript must tolerate the hydration race — the DOM
  exists before React attaches handlers, so retry patterns (`expect(...).toPass()`) are
  used for clicks that mutate state.

## CI

`.github/workflows/ci.yaml` runs on push/PR to `main`: `pnpm lint`, `pnpm build`,
`pnpm test` in one job, and Playwright e2e (chromium) in a second.

## Deployment

Hosting is Azure Static Web Apps. The hosting resources, DNS and custom domains are
managed in `bit-and-byte-ideas/platform-foundation`
(`stacks/azure/customers/bit-and-byte-ideas`), not in this repository. This repo only
builds the site and uploads `build/client/` to the existing Static Web App using the
deployment token (`AZURE_STATIC_WEB_APPS_API_TOKEN`, stored per GitHub environment).

- **Dev**: `deploy-app-dev.yaml` runs on push to `main` and via manual
  `workflow_dispatch` (used to audit feature branches on a real URL before cutover).
- **Prod**: `deploy-app-prod.yaml` runs when a GitHub release is published, or via manual
  `workflow_dispatch` with a `ref` input naming an existing release tag (e.g. `v0.2.2`) to
  redeploy it. The job is skipped unless `ref` starts with `v`, and the `prod` environment's
  required reviewers still gate every run.

Both build with pnpm and upload the static `build/client/` directory
(`skip_app_build: true`). Security headers, CSP, and the 404 mapping come from
`public/staticwebapp.config.json`.

## Security

- `script-src` has no `'unsafe-inline'`. React Router's streaming/hydration output embeds
  several inline `<script>` blocks with no `src` (history restoration,
  `window.__reactRouterContext` bootstrap, Suspense-reveal helpers, the module entry
  `import`). Their contents change on every build, so `scripts/csp-hashes.mjs` runs as
  the last step of `pnpm build`, hashes every executable inline script in the prerendered
  HTML, and appends the `'sha256-…'` sources to `script-src` in
  `build/client/staticwebapp.config.json` (the deployed copy — the source config in
  `public/` stays hash-free). A bare `script-src 'self'` without those hashes blocks
  hydration entirely (no mobile menu, no client-side navigation); note that `pnpm dev`
  and the e2e suite do not apply SWA headers, so only a built deploy exercises the CSP.
  `style-src` has no such requirement — the app has zero inline `style` attributes or
  `<style>` blocks (verified against the prerendered output), so it is `'self'` only.
- Caching: Vite-hashed bundles and fonts (`/assets/*.{js,css,woff2,woff}`) are served
  `Cache-Control: public, max-age=31536000, immutable` via a `routes` entry in
  `staticwebapp.config.json`. Unhashed files in `public/assets/` are images/vCards only,
  so they keep the SWA default (revalidate) and never go stale. Do not add JS/CSS/fonts
  under `public/assets/` — they would inherit the immutable header without a content hash.
- JSON-LD is injected via `dangerouslySetInnerHTML`; `src/content/seo.ts`'s
  `toJsonLdScript()` escapes `<` before serialization so a schema value containing
  `</script>` cannot break out of the script element. Current schema content is fully
  static (never user-supplied), so this is defense in depth, not a response to a known
  exploit path.
- GitHub Actions: every `actions/checkout` step sets `persist-credentials: false` (the
  default token isn't needed after checkout in any workflow here), and third-party actions
  (`pnpm/action-setup`, `Azure/static-web-apps-deploy`) are
  pinned to a commit SHA rather than a floating tag — bump these deliberately, not via a
  blind tag update.

## Rollback

Prod deploys are release-driven and the artifact is fully static: to roll back, re-publish
the previous release or dispatch the prod workflow with the previous tag. No
infrastructure changes are involved in app deploys (infrastructure lives in
platform-foundation).

## SEO Operations

- `sitemap.xml` is generated at build time with the build date as `lastmod`.
- `robots.txt` explicitly allows the major AI crawlers; `llms.txt` describes the business
  for AI search engines. Keep both factually accurate when the business changes.
- Structured data (Organization, WebSite, ProfessionalService, FAQPage) is emitted from
  `src/content/seo.ts` — update it there, never in raw HTML.
- After significant releases: re-submit the sitemap (Bing IndexNow / GSC), spot-check
  `site:` and rich-result eligibility, and monitor Core Web Vitals field data.
- The SEO backlog and its status board live in `docs/SEO/README.md`.
