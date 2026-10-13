# Quality and Operations

## Required Checks

Before completing a code change:

```bash
pnpm lint
pnpm build   # tsc -b gates the build; regenerates the sitemap; externalizes inline scripts
pnpm test
```

Run `pnpm test:e2e` and `pnpm test:e2e:built` (after `pnpm build`) when the change affects
rendered pages, navigation, or interactive behavior. For documentation-only changes, verify that `mkdocs.yml` navigation matches the
files in `docs/`.

The pre-commit hooks run the same commands, so a passing commit implies passing CI.

## Testing Strategy

- Unit/component specs (Vitest + Testing Library) live beside their source. Query by
  role/label; test rendered content users depend on, content-module wiring, SEO builders,
  and UI state (nav scroll, mobile menu, FAQ accordion).
- E2e specs (Playwright, `e2e/`) cover the conversion journey: nav links, Calendly CTA
  attributes, section anchors, the about page, the 404 page, the skip link, and the
  mobile menu. The dev server is started automatically by `playwright.config.ts`.
- Built-output e2e (`e2e/built/`, `pnpm test:e2e:built`, `playwright.built.config.ts`)
  runs against `build/client/` served by `scripts/serve-built.mjs`, which applies the
  `staticwebapp.config.json` headers (CSP included), folder indexes, and the 404 rewrite
  with a real 404 status, like Azure Static Web Apps. It proves the page hydrates under
  the production CSP, the mobile menu works, client-side navigation works, and unknown
  paths return 404. The dev server sends none of those headers, which is how a CSP that
  blocked hydration once passed the dev-server suite. Preview the production behavior
  locally with `pnpm build && pnpm serve:built` (http://127.0.0.1:4173).
- Prerendered-output checks: the home/about/404 HTML in `build/client/` must contain
  title, meta description, canonical, Open Graph tags, and JSON-LD. When touching SEO
  surfaces, grep the build output before shipping.
- E2e interactions that depend on JavaScript must tolerate the hydration race — the DOM
  exists before React attaches handlers, so retry patterns (`expect(...).toPass()`) are
  used for clicks that mutate state.

## CI

`.github/workflows/ci.yaml` runs on push/PR to `main`: `pnpm lint`, `pnpm build`,
`pnpm test` in one job, and Playwright e2e (chromium) in a second: `pnpm test:e2e` against
the dev server, then `pnpm build` and `pnpm test:e2e:built` against the production build,
then `CONTENT_FIXTURES=1 pnpm build` and `pnpm test:e2e:built` again against a fixture
build (labeled development fixtures, never deployed; see `docs/website/CONTENT.md`).

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
  redeploy it. The job is skipped unless `ref` starts with `v`, the checkout resolves it as
  `refs/tags/<ref>` (so a branch or SHA fails instead of deploying), and the `prod`
  environment's required reviewers still gate every run.

Both build with pnpm and upload the static `build/client/` directory
(`skip_app_build: true`). Security headers, CSP, and the 404 mapping come from
`public/staticwebapp.config.json`.

## Security

- The CSP is `script-src 'self'` with no `'unsafe-inline'`. React Router's prerendered
  output embeds inline `<script>` blocks (scroll restoration, the
  `window.__reactRouterContext` bootstrap, the hydration entry module, Suspense-reveal
  helpers) that change on every build. That CSP blocks them, which stopped production from
  hydrating from 2026-08-04 (`ca1b28e`) until the build handled them. A `pnpm build` step,
  `scripts/externalize-inline-scripts.mjs`, moves every executable inline script into a
  same-origin file under `/assets/inline/` (content-hashed, same position, same
  `type`/`async`/`id`), so the strict policy holds. It fails the build if any executable
  inline script remains. JSON-LD blocks stay inline: CSP does not apply to data blocks.
  `pnpm test:e2e:built` guards this in CI. Do not add `'unsafe-inline'` back; if a React
  Router upgrade changes its output, fix the script. `style-src` is `'self'` only: the app
  has zero inline `style` attributes or `<style>` blocks (verified against the
  prerendered output), and content rendering must keep it that way.
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
