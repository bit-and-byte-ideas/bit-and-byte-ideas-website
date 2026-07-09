# 05 — Migration Roadmap

**Status:** Accepted 2026-07-07 — in flight

Work happens on the existing `site-redesign` branch (decision D1, amended). Each phase is
one reviewable PR; the final cutover is a single PR to `main` followed by a release.
`main` remains deployable with the Angular site until cutover.

Amendment: `ci.yaml` is switched to the template shape in **Phase 1** (not Phase 5),
because removing Angular breaks the existing CI immediately. Deploy workflows still
switch in Phase 5.

## Phase 0 — Approvals & branch setup ✅ (2026-07-07)

- Decisions D1–D4 confirmed; open questions in docs 01–04 answered.
- Working on the existing `site-redesign` branch.

## Phase 1 — Scaffold & content extraction (PR 1)

- Extract all copy, contact details, Calendly config, and meta strings from the Angular
  components into `src/content/*.ts` modules (staged in a temp folder in the PR).
- Remove Angular sources and config; bring in the template wholesale: Vite/React/TS
  configs, ESLint flat config, commitlint, `.pre-commit-config.yaml`, `.claude/hooks` +
  settings, skills, `pnpm-lock.yaml` bootstrap.
- Rewrite `CLAUDE.md`/`AGENTS.md` for the React stack (template text + graphify section).
- Wire React Router v7 framework mode with `prerender` for `/`, `/about`, 404 (D3).
- **Gate:** `pnpm lint && pnpm build && pnpm test` green; `pre-commit` installed and
  passing; prerendered HTML exists for all three routes (placeholder content).

## Phase 2 — Design system & shell (PR 2) ✅ (2026-07-07)

- `design/tokens.css`: full token set from 03 (color, type scale, spacing, motion,
  z-index) with light-mode values stubbed for future use.
- Self-hosted fonts; nav, footer, section primitives, skip link.
- Hero built first as the design-direction proof — reviewed against 03 before the rest of
  the site inherits the language (includes the two hero typography variants if still
  undecided).
- **Gate:** ui-ux-pro-max CRITICAL checks pass on the shell (contrast, focus, touch
  targets, reduced-motion); component tests for nav/footer.

## Phase 3 — Home sections (PR 3) ✅ (2026-07-07)

- Trust strip, services, process, contact — all fed from content modules; "Book a call"
  as an external Calendly link (embed dropped, see 02).
- Playwright e2e specs updated to the new DOM (journey: land → services → book/contact).
- **Gate:** e2e green locally; CLS < 0.1 and LCP sane in a Lighthouse run against
  `pnpm preview`.

## Phase 4 — New content & remaining routes (PR 4) ✅ (2026-07-07)

- `/about` rebuilt (C1 depth), FAQ (M2 — draft in 04, pending your edit), 404 page (M8).
  No pricing anchors (M1 won't-do).
- `content/seo.ts` completed: meta, OG, canonical, JSON-LD (Organization, FAQPage,
  ProfessionalService) per route; sitemap generation script.
- **Gate:** prerender smoke tests assert every item in 04's "re-implemented" list.

## Phase 5 — CI/CD switchover (PR 5) ✅ (2026-07-07)

Outcome notes:

- Dev deployment of `site-redesign` is live at
  https://red-grass-0d5881a1e.7.azurestaticapps.net — audit passed 14/14
  (security headers + CSP active, real 404 status, prerendered HTML with all
  schema, llms/robots/sitemap served, hydration verified with zero console
  errors).
- The `dev` GitHub environment was switched from protected-branches-only to
  custom branch policies (`main`, `site-redesign`) to allow the branch deploy.
  **Post-cutover cleanup:** remove the `site-redesign` policy (or restore
  protected-branches-only).

- `ci.yaml` → template shape (pnpm lint/build/test) + e2e job + existing policy checks.
- `deploy-app-*.yaml`: pnpm setup, `pnpm build`, `app_location: dist` (framework-mode
  client output dir confirmed here), `skip_app_build: true`.
- Deploy `rebuild/react` to the **dev** SWA environment via `deploy-app-dev.yaml`; run
  `/seo-page` + Lighthouse against dev; fix regressions.
- **Gate:** dev environment audit clean vs. Phase 0 baseline.

## Phase 6 — Docs & cutover (PR 6 → main) ✅ (2026-07-08)

- Rewrite `docs/architecture.md`, `development.md`, `ux-content.md`,
  `quality-operations.md`, `docs/index.md` for the React app; add `docs/redesign/` to
  `mkdocs.yml` nav as a decision record.
- `graphify update .`; merge to `main`; publish release → prod deploy.

Cutover outcome (PR #33 merged, release v0.1.3, 2026-07-08):

- Production audit **12/12**: new site served with keyword title, San Diego targeting,
  three JSON-LD blocks, 7-item FAQ, canonical www, security headers + CSP, real 404
  status with the branded page, prerendered `/about`, and llms.txt / robots.txt /
  sitemap.xml all live.
- Performance on production: **CLS 0, LCP ~1.6s**, zero console errors.
- Dev environment restored to protected-branches-only (Phase 5 cleanup done).
- Known item: `https://` apex serves the site (200) instead of 301 → www. Azure SWA
  cannot host-redirect via `staticwebapp.config.json`; canonical tags point at www, so
  duplicate-content risk is mitigated. Fixing properly needs an infra-level redirect
  (e.g. Front Door) — tracked as a nice-to-have, not a blocker.

Remaining owner actions (need Search Console access):

- Submit sitemap + URL inspection for `/` and `/about` in GSC; optional Bing IndexNow
  (H6 automation still deferred).
- Watch CWV field data over the next 28 days.

## Rollback

Prod deploys are release-driven and `dist/` is fully static: rollback = re-publish the
previous release (Angular build) — no infra changes anywhere in this plan, so DNS/SWA are
never at risk.

## Estimated shape

Six PRs, each independently reviewable in one sitting. Phases 1–2 are the risk
concentrators (tooling swap, design language); 3–6 are mechanical once those land.
