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
`pnpm test` in one job, and Playwright e2e (chromium) in a second. Policy checks and infra
workflows run separately.

## Deployment

Hosting is Azure Static Web Apps; DNS and the custom domain are managed by
OpenTofu/Terraform under `deploy/infra/` (dev and prod), deployed via the
`deploy-infra-*` workflows.

- **Dev**: `deploy-app-dev.yaml` runs on push to `main` and via manual
  `workflow_dispatch` (used to audit feature branches on a real URL before cutover).
- **Prod**: `deploy-app-prod.yaml` runs when a GitHub release is published.

Both build with pnpm and upload the static `build/client/` directory
(`skip_app_build: true`). Security headers, CSP, and the 404 mapping come from
`public/staticwebapp.config.json`.

## Security

- `script-src 'self' 'unsafe-inline'` in the CSP is a deliberate, verified-necessary
  trade-off, not an oversight: React Router's streaming/hydration output embeds several
  inline `<script>` blocks with no `src` (history restoration, `window.__reactRouterContext`
  bootstrap, Suspense-reveal helpers) that change on every build and cannot be pinned by
  nonce or hash in a purely static `staticwebapp.config.json`. Removing `'unsafe-inline'`
  from `script-src` breaks hydration. `style-src` has no such requirement — the app has
  zero inline `style` attributes or `<style>` blocks (verified against the prerendered
  output), so it is `'self'` only.
- JSON-LD is injected via `dangerouslySetInnerHTML`; `src/content/seo.ts`'s
  `toJsonLdScript()` escapes `<` before serialization so a schema value containing
  `</script>` cannot break out of the script element. Current schema content is fully
  static (never user-supplied), so this is defense in depth, not a response to a known
  exploit path.
- GitHub Actions: every `actions/checkout` step sets `persist-credentials: false` (the
  default token isn't needed after checkout in any workflow here), and third-party actions
  (`pnpm/action-setup`, `Azure/static-web-apps-deploy`, `open-policy-agent/setup-opa`) are
  pinned to a commit SHA rather than a floating tag — bump these deliberately, not via a
  blind tag update.

## Rollback

Prod deploys are release-driven and the artifact is fully static: to roll back, re-publish
the previous release. No infrastructure changes are involved in app deploys.

## SEO Operations

- `sitemap.xml` is generated at build time with the build date as `lastmod`.
- `robots.txt` explicitly allows the major AI crawlers; `llms.txt` describes the business
  for AI search engines. Keep both factually accurate when the business changes.
- Structured data (Organization, WebSite, ProfessionalService, FAQPage) is emitted from
  `src/content/seo.ts` — update it there, never in raw HTML.
- After significant releases: re-submit the sitemap (Bing IndexNow / GSC), spot-check
  `site:` and rich-result eligibility, and monitor Core Web Vitals field data.
- The SEO backlog and its status board live in `docs/SEO/README.md`.
