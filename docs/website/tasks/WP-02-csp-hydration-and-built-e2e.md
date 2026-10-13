# WP-02: Restore production hydration under a strict CSP, plus a build-output test harness

## Purpose and scope

Production never hydrates because `script-src 'self'` blocks React Router's inline
bootstrap scripts (AUDIT K1). The mobile menu is dead below 900px, and every later
package (nav integration, client navigation to content pages, 404 handling) depends on
hydration working. CI missed this because e2e only runs against `pnpm dev` (K2).

This package:

1. Adds a local server that serves `build/client/` the way Azure Static Web Apps does
   (headers from `staticwebapp.config.json`, folder indexes, 404 rewrite with status 404).
2. Adds an e2e suite that runs against that server.
3. Makes the build output compatible with `script-src 'self'` by externalizing inline
   scripts (D-003).
4. Corrects the CSP paragraph in `docs/quality-operations.md` (K5).

## Prerequisites

WP-01 done. No content work is needed.

## Read first

- `docs/website/AUDIT.md` (K1, K2, K5), `docs/website/DECISIONS.md` (D-003),
  `docs/website/ARCHITECTURE.md` "Constraints" and "Testing"
- `public/staticwebapp.config.json`, `react-router.config.ts`, `package.json`,
  `playwright.config.ts`, `tsconfig.node.json`, `e2e/journey.spec.ts`,
  `.github/workflows/ci.yaml`, `docs/quality-operations.md` (Security section)
- `docs/website/evidence/2026-10-12-wp01-baseline/capture-baseline.mjs` (the
  `hydrationCheck` function already reproduces K1 with Playwright route interception)
- One prerendered file, to see the inline scripts: `pnpm build` then
  `build/client/index.html`

## Relevant decisions

D-003 (approach and fallback), D-018 (this package fixes the CSP docs), D-019.

## Implementation areas

| Path | Change |
| --- | --- |
| `scripts/serve-built.mjs` (new) | Dependency-free Node HTTP server for `build/client/` on `127.0.0.1:4173`. Applies `globalHeaders`. Resolves `/x` → `x/index.html`, serves `.data`, `.xml`, `.webp`, and other files with correct MIME types. Unmatched paths → `responseOverrides["404"].rewrite` with status 404 |
| `scripts/externalize-inline-scripts.mjs` (new) | Post-build. For every `build/client/**/*.html`, replace each executable inline `<script>` (no `src`; type absent, `text/javascript`, or `module`) with `<script src="/assets/inline/<sha256-16>.js">`, keeping `type`, `async`, and `id`, and write the body to that file (deduplicated by hash). Leave `type="application/ld+json"` untouched. Exit non-zero if any executable inline script remains |
| `package.json` | `build` appends `&& node scripts/externalize-inline-scripts.mjs`. New scripts: `serve:built` → `node scripts/serve-built.mjs`; `test:e2e:built` → `playwright test --config playwright.built.config.ts` |
| `playwright.built.config.ts` (new) | `testDir: './e2e/built'`, `webServer` = `pnpm serve:built` on port 4173 (requires an existing build), chromium. Add the file to `tsconfig.node.json` `include` |
| `e2e/built/hydration.spec.ts` (new) | Tests listed under acceptance criteria |
| `.github/workflows/ci.yaml` | e2e job: after installing browsers, run `pnpm build` then `pnpm test:e2e:built` (keep the existing `pnpm test:e2e` step) |
| `docs/quality-operations.md` | Replace the `'unsafe-inline'` paragraph with the externalization approach and the new test command |
| `docs/website/*` | Manifest, validation, handoff; DECISIONS only if the approach changes |

Notes:

- Parser-inserted external classic scripts without `async`/`defer` execute in document
  order and block parsing, the same as inline ones, so React's streaming helpers (`$RC`,
  `$RB`) and `window.__reactRouterContext` keep their order. Confirm this by test, not by
  argument.
- `.gitignore` already ignores `build/`. Nothing generated is committed.
- Do not edit the CSP string in `staticwebapp.config.json`.

## Acceptance criteria

- **AC-1** After `pnpm build`, no `build/client/**/*.html` contains an executable inline
  `<script>`. The externalize script enforces this and fails the build otherwise.
- **AC-2** `pnpm test:e2e:built` passes, covering, with the exact production CSP header
  served:
  - zero `Content Security Policy` console violations on `/`, `/about`, `/connect`, and
    `/404`;
  - `window.__reactRouterContext` is defined (hydrated);
  - at 375×812 the "Toggle navigation menu" button sets `aria-expanded="true"`, and
    choosing About navigates to `/about`;
  - after scrolling, the nav has the `scrolled` class;
  - a client-side navigation from `/` to `/about` keeps a `window` marker (no full
    reload);
  - `GET /does-not-exist` returns status 404 with the "This page took a wrong turn." H1;
  - responses carry the `Content-Security-Policy` header from
    `staticwebapp.config.json`, unchanged.
- **AC-3** `public/staticwebapp.config.json` is unchanged (`git diff` empty).
- **AC-4** `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm test:e2e`
  pass.
- **AC-5** `ci.yaml` runs `pnpm test:e2e:built`; `docs/quality-operations.md` describes
  the real CSP approach.
- **AC-6** Evidence in `docs/website/evidence/<date>-wp02-csp/`: mobile-menu screenshots
  under the CSP before and after, and the test output.

## Verification

```bash
pnpm lint && pnpm typecheck && pnpm test
pnpm build   # fails if the externalize step finds a leftover inline script (AC-1)
node -e "const fs=require('fs');const h=fs.readFileSync('build/client/index.html','utf8');const m=[...h.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/g)];console.log('executable inline scripts:',m.length)"
pnpm test:e2e
pnpm test:e2e:built
git diff --exit-code -- public/staticwebapp.config.json
```

Then re-run the K1 experiment for before/after evidence:
`node docs/website/evidence/2026-10-12-wp01-baseline/capture-baseline.mjs "$PWD" http://127.0.0.1:4173 docs/website/evidence/<date>-wp02-csp`
while `pnpm serve:built` is running.

## Exclusions

- No change to CSP directives. If externalization cannot be made reliable, **stop**:
  set this package to `blocked`, record the findings in `VALIDATION.md`, and ask Carlos
  whether to apply the D-003 fallback (restore `'unsafe-inline'`). Do not apply it
  unasked.
- No content routes, nav changes, or other doc fixes (WP-11).
- No deploy. Do not run the deploy workflows.

## Prompt

```text
Continue the Bit & Byte Ideas website extension. Read CLAUDE.md, then
docs/website/README.md, docs/website/MANIFEST.yaml, and docs/website/HANDOFF.md; check
git branch/status and reconcile the docs with the repository. Then complete WP-02 using
docs/website/tasks/WP-02-csp-hydration-and-built-e2e.md. Set WP-02 to in_progress in
the manifest before editing code. Keep the CSP string unchanged; if externalizing
inline scripts can't be made reliable, stop and ask me before relaxing the CSP.
Checkpoint MANIFEST.yaml, VALIDATION.md, and HANDOFF.md after each milestone. Mark
WP-02 done only if every acceptance criterion passes. Do not commit, push, or deploy
unless I ask.
```
