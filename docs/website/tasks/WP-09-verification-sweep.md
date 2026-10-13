# WP-09: Accessibility, performance, and regression verification

## Purpose and scope

Prove the integrated result against the brief with evidence. Fix defects that fall
inside the project's scope, and log the rest. This package also runs the end-to-end
authoring dry run: add one project and one article using only `CONTENT.md`, without
touching presentation components.

## Prerequisites

WP-07 and WP-08 done.

## Read first

- `docs/website/BRIEF.md` (all requirements), `docs/website/VALIDATION.md` (history),
  `docs/website/ARCHITECTURE.md` "Performance budgets" and "Testing",
  `docs/website/CONTENT.md` "Workflow"
- `e2e/**`, `playwright.config.ts`, `playwright.built.config.ts`,
  `scripts/verify-build-content.mjs`
- Skills: `impeccable` (`audit`, then `critique` on `/work`, a project page, `/blog`, an
  article, and the homepage section), `ui-ux-pro-max` QC gates

## Relevant decisions

All. In particular D-008 (draft exclusion), D-009 (approvals), D-013 (nav gating).

## Implementation areas

| Area | Work |
| --- | --- |
| `package.json` | Dev dep `@axe-core/playwright` |
| `e2e/built/a11y.spec.ts` | axe (WCAG 2.1 A/AA rules) on `/`, `/about`, `/connect`, `/404`, `/work`, one project per kind, `/blog`, the long and short articles, and both empty states (production build) |
| `e2e/built/keyboard.spec.ts` | Tab order through nav → content → CTA band → footer on each new page type; skip link; visible focus (computed outline) |
| `e2e/built/perf.spec.ts` | Lab CLS and LCP via `PerformanceObserver` on article, project, and index pages at 375 and 1440 (simulated mid-range network); JS bytes per route from the build manifest |
| `docs/website/evidence/<date>-wp09-verification/` | Screenshots at 375/768/1024/1440 for every page type, reduced-motion runs, axe JSON, perf JSON, internal link crawl results, impeccable reports |
| Link check | Small script (evidence folder) crawling `build/client` HTML: every internal `href` resolves to a file or anchor; list external hosts |
| Dry run | Add `src/content/fixtures/work/dry-run-project/` and `src/content/fixtures/blog/dry-run-article/` by following `CONTENT.md` step by step (fixtures, so nothing real is published). Record every doc gap found and fix `CONTENT.md`. `git diff --stat -- src/components src/routes` must be empty for the dry-run step |

## Acceptance criteria

- **AC-1** axe: zero serious or critical violations on every listed page. Any moderate
  or minor finding is fixed or justified in `VALIDATION.md`.
- **AC-2** Keyboard and focus checks pass. Each page has one H1 and no skipped heading
  levels. Contrast of all new text styles ≥ 4.5:1 (axe plus computed token pairs).
- **AC-3** With `prefers-reduced-motion: reduce`, no transform or opacity animations run
  on new components (checked via `getAnimations()`).
- **AC-4** Lab CLS ≤ 0.05 on every measured page. Images have dimensions. The LCP element
  on project pages is the cover image with `fetchpriority="high"`. Budgets from
  ARCHITECTURE met or documented.
- **AC-5** No horizontal overflow (real or masked) at 375/768/1024/1440 on new pages
  (`scrollWidth` probe).
- **AC-6** Draft exclusion proven in a production build: a temporary draft entry with a
  unique marker string never appears in `build/client/**` (HTML, `.data`, XML). Remove
  the draft afterwards.
- **AC-7** Regression: every pre-existing e2e test passes unchanged. Calendly URL, email,
  phone, vCard link, anchors, and CTA labels verified on built output.
- **AC-8** Dry run completed with zero edits to `src/components/**` and
  `src/routes/**`. `CONTENT.md` updated for any gaps found.
- **AC-9** Results in `VALIDATION.md` say passed, failed, or not run for every check,
  with evidence paths. No compliance or performance claim without a check behind it.

## Verification

```bash
pnpm install
pnpm lint && pnpm typecheck && pnpm test
pnpm test:e2e
pnpm build && pnpm test:e2e:built
CONTENT_FIXTURES=1 pnpm build && pnpm test:e2e:built
pnpm build   # leave a production build in place
```

## Exclusions

No new features. Fixes are limited to defects in this project's scope; issues in
untouched areas (AUDIT K7, K8, K9) are logged, not fixed, unless Carlos asks. No
production deploy or real-device testing claims (lab only).

## Prompt

```text
Continue the Bit & Byte Ideas website extension. Read CLAUDE.md, then
docs/website/README.md, docs/website/MANIFEST.yaml, and docs/website/HANDOFF.md; check
git branch/status and reconcile the docs with the repository. Then complete WP-09 using
docs/website/tasks/WP-09-verification-sweep.md. Record every check as passed, failed, or
not run in docs/website/VALIDATION.md with evidence paths; do not claim accessibility
compliance or performance you have not measured. Set WP-09 to in_progress before
starting, checkpoint after each milestone, and mark it done only when every acceptance
criterion passes. Do not commit, push, or deploy unless I ask.
```
