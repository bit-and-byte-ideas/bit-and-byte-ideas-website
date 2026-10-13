# Audit

Audited 2026-10-12 (WP-01) at `site-improvements` = `main` = `4074b5e`. Evidence:
[`evidence/2026-10-12-wp01-baseline/`](evidence/2026-10-12-wp01-baseline/) (screenshots at
375 / 768 / 1440, `baseline-report.json`, and the re-runnable `capture-baseline.mjs`).

## Method

- Read `CLAUDE.md`, `AGENTS.md`, `PRODUCT.md`, `README.md`, `docs/*.md`, `mkdocs.yml`,
  every file in `src/`, `public/`, `scripts/`, `e2e/`, CI workflows, and tool configs.
- Recovered deleted decision records from git (`git show a804ef4^:docs/redesign/…`).
- Ran every package script (results in [VALIDATION.md](VALIDATION.md)).
- Inspected the prerendered output in `build/client/`.
- Fetched the live site with `curl` and loaded it in Chrome to test hydration.
- Captured responsive screenshots and layout probes with the repo's Playwright against
  the built output served locally, with and without the production CSP header.

## Repository and stack

| Area | Observed |
| --- | --- |
| Framework | React 19.2 + React Router **8.3** framework mode (docs say v7; see K4), Vite 8, TypeScript 6 (strict, project references, `erasableSyntaxOnly`) |
| Rendering | `ssr: false` + `prerender: ['/', '/about', '/connect', '/404']` in `react-router.config.ts`; SPA fallback emitted |
| Styling | Plain CSS per component + `src/design/tokens.css` / `base.css`; no CSS framework; fonts self-hosted via Fontsource |
| Content | Typed TS modules in `src/content/` (`site`, `business-info`, `services`, `process`, `trust`, `faq`, `about`, `card`, `seo`); no Markdown, no CMS |
| Direct dependencies | Only React, React Router, Fontsource, `isbot`. No Markdown, validation, or image libraries (zod/valibot exist only transitively) |
| Tests | Vitest + Testing Library (7 files, 27 tests); Playwright e2e (3 specs, 20 tests) against `pnpm dev` only |
| Hosting | Azure Static Web Apps; `public/staticwebapp.config.json` sets security headers, strict CSP, 404 rewrite with status 404 |
| CI/CD | `ci.yaml` (lint, build, test, e2e) on push/PR to `main`; `deploy-app-dev.yaml` on push to `main`; `deploy-app-prod.yaml` on GitHub release |
| Infra | OpenTofu under `deploy/infra/{dev,prod}`; DNS moved to platform-foundation (9843014) |
| Package manager | pnpm 11.6 via Corepack; Node 24. pnpm 11 re-syncs `node_modules` before running scripts |
| Agent tooling | Claude hooks: block `--no-verify`, graphify hint, `pre-commit run` before commits. Codex hooks run prettier and the impeccable detector. graphify indexes `src/` only |

## Commands

All verified this session; exact results in [VALIDATION.md](VALIDATION.md).

| Command | What it does | Baseline |
| --- | --- | --- |
| `pnpm dev` | Dev server at http://localhost:5173 (no production headers) | Works (used by e2e) |
| `pnpm lint` | `eslint .` | Pass |
| `pnpm typecheck` | `tsc -b` | Pass |
| `pnpm test` | Vitest once | Pass, 27/27 |
| `pnpm build` | `tsc -b` → `react-router build` → `node scripts/generate-sitemap.mjs` | Pass; prerenders 4 routes + SPA fallback; sitemap with 3 URLs |
| `pnpm test:e2e` | Playwright against `pnpm dev` | Pass, 20/20 |
| `pnpm preview` | `vite preview` | Not run |
| Built output, local | `python3 -m http.server 4173 --directory build/client` (no headers) | Used for screenshots |

## Route inventory

### Existing (preserve)

| URL | Module | Prerendered | Notes |
| --- | --- | --- | --- |
| `/` | `src/routes/home.tsx` | Yes | Anchors `#services`, `#process`, `#faq`, `#contact`; JSON-LD Organization+WebSite, ProfessionalService, FAQPage |
| `/about` | `src/routes/about.tsx` | Yes | Founder bio, tech range, best fit, CTA band, mobile sticky CTA |
| `/connect` | `src/routes/connect.tsx` | Yes | QR business card: call, text, email, vCard (`/assets/carlos-barajas.vcf`), Calendly |
| `/404` + `*` | `src/routes/not-found.tsx` | Yes (`/404/index.html`) | `noindex`; SWA rewrites unknown paths here with status 404 |
| `/sitemap.xml` | `scripts/generate-sitemap.mjs` | Post-build file | `/`, `/about`, `/connect`; `lastmod` = build date (UTC) |
| `/robots.txt`, `/llms.txt` | `public/` | Static | AI crawlers allowed; `llms.txt` hand-maintained |
| `/assets/carlos-barajas.vcf` | `public/assets/` | Static | Download link on `/connect` |

External destinations to preserve: Calendly
`https://calendly.com/carlos-barajas-bitandbyteideas/30min`, email
`info@bitandbyteideas.com`, phone `(619) 431-1733`, GitHub
`https://github.com/bit-and-byte-ideas`. All are defined once in `src/content/site.ts`
and `src/content/business-info.ts`.

Live check (2026-10-12): `/blog`, `/work`, `/portfolio`, `/projects` all return 404, so no
existing URL conflicts with the proposed routes.

### Proposed (this project)

`/work`, `/work/<slug>`, `/blog`, `/blog/<slug>`, `/blog/rss.xml`. Rationale: D-004.
Existing routes, anchors, and labels are unchanged; nav and footer gain "Work" and "Blog"
links (D-013).

## Live site vs repository

The live site serves the same build as `main`: visible text on `/`, `/about`, and
`/connect` is identical to the local build, and the asset hashes match
(`manifest-7856cf22.js`). Live `sitemap.xml` shows `lastmod` 2026-08-04, which matches the
CSP change in `ca1b28e`. The only difference found is behavioral, and it comes from the
headers (K1).

## Design baseline

Full rules live in [DESIGN.md](DESIGN.md). Observed facts:

- **Direction:** "Engineered Dark", accepted 2026-07-07 (originally
  `docs/redesign/03-design-direction.md`, now only in git history), refined by an
  impeccable critique pass on 2026-07-25 (`a804ef4`, critiques in `.impeccable/critique/`,
  scored 28/32).
- **Color:** navy `--bg #0f172a`, surfaces `#111827` / `#1a2440`, green accent
  `#22c55e` / `#4ade80`, blue `#3b82f6`, blue→green `--gradient`; `--text-muted #94a3b8`
  passes 4.5:1, while `--text-faint` is reserved for decoration.
- **Type:** Bricolage Grotesque (display, 700–800, tight tracking), Public Sans (body,
  16px, 1.6), IBM Plex Mono (labels, buttons, nav, `//` system labels in lowercase).
  Scale tokens `--text-xs` … `--text-display`.
- **Spacing:** 4/8 rhythm tokens `--space-1` … `--space-9`; sections pad `--space-8`;
  container 1200px max with 24px / 48px gutters.
- **Shape and texture:** 4px radius, hairline borders, single ambient gradient glow + one
  corner registration mark per hero, faint grain on the home hero.
- **Components:** `.btn .btn-primary` (green fill, mono) and `.btn-ghost`;
  `.section-label` (`// label`); `.section-title` with green `<em>`; numbered cards
  (`01`…) with hover lift; FAQ `<details>`; contact detail list; footer with mono links.
- **Imagery:** brand mark and icon only (WebP with PNG originals for `og:image`). No
  photography, screenshots, or client imagery anywhere.
- **Motion:** one staggered hero load, CSS scroll-driven section rise (transform only),
  pulse dot, caret blink, all gated by `prefers-reduced-motion`.
- **Responsive:** mobile-first; desktop nav at ≥ 900px; grids switch at 768 / 900 / 1024.
  No real horizontal scrolling at 375 / 768 / 1440 (one masked overflow, K7).
- **Navigation:** fixed 72px nav: Services (`/#services`), About, Get in Touch
  (`/#contact`), Book a Call (Calendly, new tab, screen-reader cue). Mobile: full-screen
  dialog menu (Escape closes, focus returns). Footer: Services, About, Process, Contact,
  Book a Call, GitHub.
- **Conversion paths:** two labels only (SEO item M5): "Book a Call" (primary, Calendly,
  new tab) on nav, hero, contact, about CTA band, about mobile sticky bar, footer, and
  connect ("Book a Free Call"); "Get in Touch" (secondary, `/#contact`) on nav, service
  cards, and the about CTA band.
- **Accessibility present:** skip link, landmarks, sequential headings (one `h1` per
  page), focus ring `2px var(--accent)`, 44px targets (probe found none smaller),
  `aria-hidden` decoration, explicit image dimensions everywhere.

## Installed design skills

Inventory and the decision about which to use are in
[DESIGN.md → Skills](DESIGN.md#design-skills-used-and-not-used). Facts:

- `.agents/skills/` (mirrored into `.claude/skills/` by symlink): brandkit, commitlint,
  design-taste-frontend (v2), design-taste-frontend-v1, emil-design-eng,
  frontend-design, full-output-enforcement, gpt-taste, high-end-visual-design,
  image-to-code, imagegen-frontend-mobile, imagegen-frontend-web, impeccable,
  industrial-brutalist-ui, minimalist-ui, pick-ui-library, redesign-existing-projects,
  stitch-design-taste.
- The Leonxlnx/taste-skill entries were added on 2026-10-12 and are **staged, not
  committed** (with `skills-lock.json`). Impeccable, emil-design-eng, and pick-ui-library
  were committed on 2026-07-25.
- `ui-ux-pro-max` (named in `CLAUDE.md`) is not in the repo. It is available as a
  user-level skill in this environment.

## Known issues

Severity: High = user-facing defect in production; Medium = risk to this project or
correctness of docs; Low = cosmetic or debt. "Owner" is the work package that addresses
it, or "logged" if out of scope.

| ID | Sev | Issue | Evidence | Owner |
| --- | --- | --- | --- | --- |
| K1 | High | **Production CSP blocks hydration.** `script-src 'self'` (since `ca1b28e`, 2026-08-04) blocks React Router's 8 inline bootstrap scripts. Production never hydrates: the mobile menu button does nothing below 900px, the nav never gets its scrolled state, and every link does a full page load. Content is still visible because it is prerendered. | Live: no `__reactRouterContext`, hamburger has no React props, click does not toggle. Repro: `csp-enforced-mobile-menu.png` vs `csp-absent-mobile-menu.png`, `baseline-report.json` → `csp` (8 violations) | WP-02 (fixed in repo 2026-10-12, not yet deployed) |
| K2 | Medium | E2E runs only against `pnpm dev`, which serves no production headers, so K1 passed CI (`mobile menu opens…` is green locally and red in production). | `playwright.config.ts` `webServer: pnpm dev` | WP-02 (fixed: `pnpm test:e2e:built` in CI) |
| K3 | Medium | `docs/redesign/*` and `docs/SEO/*` were deleted in `a804ef4` but are still referenced by `CLAUDE.md`, `AGENTS.md`, `README.md`, `PRODUCT.md`, `docs/index.md`, `docs/architecture.md`, `docs/ux-content.md`, `docs/quality-operations.md`, a `tokens.css` comment, and a `react-router.config.ts` comment. `mkdocs.yml` nav lists 6 missing files (TechDocs). Content is recoverable with `git show a804ef4^:<path>`. | `git log --diff-filter=D` | WP-11 |
| K4 | Low | Docs say React Router v7 and list prerendered routes as `/`, `/about`, `/404`. Actual: v8.3.0, and `/connect` is prerendered too. `docs/architecture.md`'s route table omits `/connect`. | `package.json`, `react-router.config.ts` | WP-11 |
| K5 | Medium | `docs/quality-operations.md` says `'unsafe-inline'` is required and present. The config removed it, so doc and config disagree. The doc's warning was correct (K1). | `ca1b28e` | WP-02 (fixed) |
| K6 | Low | Sitemap `lastmod` is the build date (UTC) for every URL, not the content's modification date. Articles need real per-URL dates. | `scripts/generate-sitemap.mjs` | WP-07 |
| K7 | Low | At 375px, trust-strip items are 5px wider than the viewport. `body { overflow-x: hidden }` hides the scroll, so the items are slightly clipped. | `baseline-report.json` probe, overflow script output in VALIDATION.md | logged |
| K8 | Low | At mobile width, the home hero's decorative corner mark overlaps the "Explore Services" button area. | `home-mobile.png` | logged |
| K9 | Low | 20 raw color literals (mostly `rgba()` tints of tokens) in 6 CSS files, despite the "no raw hex in components" rule. | `grep` count in VALIDATION.md | New work adds alpha tokens instead (DESIGN.md) |
| K10 | Low | Organization/WebSite JSON-LD descriptions in `src/content/seo.ts` still use the pre-July service names ("static website development…"). | `seo.ts` | logged (WP-07 must not copy them) |
| K11 | Info | `PRODUCT.md` says "No blog currently" and "No client testimonials, case studies…". It becomes stale when content ships. | `PRODUCT.md` | WP-10 |
| K12 | Info | `llms.txt` is maintained by hand and will need `/work` and `/blog` links. | `public/llms.txt` | WP-07 |
| K13 | Info | The prompt says taste-skills were "already applied to retexture the website", but no source file changed after 2026-07-25. Only the skill install (staged today) is present. Other worktrees (`~/.codex/worktrees/*`) hold only May-era doc edits. | `git log`, `git status`, `git worktree list` | Resolved 2026-10-12: no outside work exists (BRIEF Q1, D-023) |
| K14 | Medium | Risk for new dynamic routes: under `ssr: false`, client navigation to an unprerendered slug requests `/<path>.data`, and SWA answers with the 404 HTML. This must end in the branded not-found UI, not a generic error. | React Router `vite.js` prerender logic | Resolved in WP-05: static per-entry routes (D-034); verified in the built fixture site and in dev |
| K15 | Low | `pnpm audit` reports 18 advisories (6 high) in dev-only tooling: brace-expansion via eslint, js-yaml and fast-uri via commitlint, source-map-js via vite, undici via jsdom, vitest/@vitest/mocker. `pnpm audit --prod` is clean. Identical at `HEAD`, so not introduced by this project. | `docs/website/evidence/2026-10-12-wp03-content/e2e-and-audit.txt` | logged (dependency update, outside this project) |
| K16 | Low | Footer "Book a Call↗" renders without the intended space: the footer links are `inline-flex`, and flex items drop leading/trailing whitespace. New components use `gap` instead. | `fixtures-work-1440.png` footer | logged |

## Documentation drift (summary)

Accurate today: `docs/architecture.md` (except K4), `docs/development.md`,
`docs/ux-content.md` (except references in K3), `docs/services-strategy.md` (historical
record). Inaccurate: `docs/quality-operations.md` CSP section (K5), and every reference in
K3. These are fixed in WP-11 so this project does not rewrite unrelated instructions
mid-flight.
