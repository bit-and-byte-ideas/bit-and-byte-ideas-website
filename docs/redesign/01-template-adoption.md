# 01 — Template Adoption

**Status:** Accepted 2026-07-07 — no Prettier; ci.yaml follows the template shape plus an e2e job

Everything in this doc is driven by one rule from the brief: **adopt all the tools from
`frontend-react-teamplate`, as-is.** The template's CLAUDE.md philosophy — pre-commit hooks
and CI invoke the exact same `pnpm` scripts, so a green commit and a green CI run cannot
disagree — becomes this repo's philosophy.

## Inventory: what comes from the template

### Runtime & build

| Tool             | Version / config                                                                     | Notes                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| React            | 19.x                                                                                 | Function components + hooks only                                                        |
| Vite             | 8.x with `@vitejs/plugin-react`                                                      | `pnpm dev`, `pnpm build` (gated by `tsc -b`), `pnpm preview`                            |
| TypeScript       | ~6.0, project references                                                             | `tsconfig.json` (solution) → `tsconfig.app.json` (src) + `tsconfig.node.json` (tooling) |
| Strictness flags | `verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` | Type-only imports must use `import type`; no `enum`/`namespace` — plain unions/objects  |
| pnpm             | pinned via `packageManager` field, managed by Corepack                               | `corepack enable pnpm` once per machine                                                 |

### Testing

| Tool                                          | Config                                                                                        |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Vitest 4 + jsdom                              | `test` key in `vite.config.ts`; `globals: true`                                               |
| Testing Library (react, user-event, jest-dom) | `src/setupTests.ts` registers jest-dom matchers                                               |
| Convention                                    | Co-located `*.test.tsx` next to source; type-checked by `tsc -b`, tree-shaken from the bundle |
| Coverage                                      | `@vitest/coverage-v8`                                                                         |

### Quality gates

| Gate                  | Mechanism                                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| ESLint                | Flat config: `@eslint/js` + `typescript-eslint` recommended + `react-hooks` + `react-refresh/vite`                   |
| Conventional Commits  | commitlint (`@commitlint/config-conventional`) at `commit-msg` stage                                                 |
| pre-commit framework  | eslint `--fix` on staged files → `pnpm typecheck` → `pnpm test` (whole repo, matching CI)                            |
| No-bypass enforcement | `.claude/hooks/block-no-verify.sh` + `.claude/settings.json` PreToolUse hook rejects `git commit --no-verify` / `-n` |
| CI                    | Template's `ci.yml` pattern: `pnpm lint`, `pnpm build`, `pnpm test` on push/PR to `main`                             |

### Skills & agent config

| Item                                                    | Action                                                                                                                                                       |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.claude/skills/frontend-design`                        | Already present in this repo — keep (identical to template's)                                                                                                |
| `.claude/skills/commitlint` + `.agents/skills/` mirrors | Copy from template                                                                                                                                           |
| `skills-lock.json`                                      | Merge template entries into the existing lock file                                                                                                           |
| `CLAUDE.md`                                             | Rewrite: replace Angular guidance with the template's React/Vite guidance, keep the graphify section and design-direction rules (updated for the new skills) |

## What carries over from this repo (untouched or lightly adapted)

| Asset                                                                                       | Disposition                                                                                                                              |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `deploy/infra/` (Terraform: DNS, SWA custom domain, DMARC/DKIM)                             | Untouched                                                                                                                                |
| `.github/workflows/deploy-infra-*.yaml`, `policy-checks.yaml`                               | Untouched                                                                                                                                |
| `.github/workflows/deploy-app-*.yaml`                                                       | Adapted: pnpm setup + Vite build; `app_location` → Vite output; `skip_app_build: true` stays                                             |
| `docs/` + `mkdocs.yml` (TechDocs)                                                           | Kept; architecture/development/ux docs rewritten during Phase 6 (see 05)                                                                 |
| `docs/SEO/`                                                                                 | Kept verbatim — it is the parity checklist for 04                                                                                        |
| `public/` (favicons, robots.txt, sitemap.xml, assets incl. llms.txt & schema-bearing pages) | Carried into the new app's `public/`; regenerated where build-path-dependent                                                             |
| `e2e/` + `playwright.config.ts`                                                             | Kept — Playwright is framework-agnostic; specs updated to the new DOM. **Addition to template tooling**, wired into CI as a separate job |
| `catalog-info.yaml`, `LICENSE`, `AGENTS.md`                                                 | Kept (AGENTS.md updated alongside CLAUDE.md)                                                                                             |
| graphify (`graphify-out/`)                                                                  | Kept; `graphify update .` after each phase                                                                                               |

## What gets deleted

- All Angular sources: `src/app/**`, `src/main.ts`, `src/main.server.ts`, `src/server.ts`,
  `angular.json`, `tsconfig.spec.json`, Angular deps in `package.json`, `routes.txt`.
- Angular-specific skills references in `CLAUDE.md` (`angular-developer`, `angular-architect`,
  `angular-testing` rows) — the skills remain installed globally but the project doc stops
  prescribing them.
- `package-lock.json` (replaced by `pnpm-lock.yaml`).

Content is **extracted before deletion**: service copy, process copy, business contact
details, Calendly configuration, FAQ/pricing copy, and all meta/schema strings move into
typed content modules (see 02).

## Open questions

1. The template has no Prettier — formatting rides on `eslint --fix`. Keep that, or add
   Prettier? **Recommendation: keep template behavior; add nothing.**
2. Existing `ci.yaml` also runs policy checks and e2e. Merge template CI into it, or
   replace and re-add jobs? **Recommendation: replace with template `ci.yml` shape, then
   add `e2e` as an additional job — smallest diff from template.**
