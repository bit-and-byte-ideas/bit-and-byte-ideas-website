# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

This is the public website for Bit and Byte Ideas, a software consulting studio. It is a
Vite + React 19 + TypeScript app using React Router v7 framework mode with **static
prerendering** (`ssr: false` + `prerender` in `react-router.config.ts`): every route is
emitted as real HTML at build time and served from Azure Static Web Apps. Package manager
is **pnpm** (managed via Corepack — `corepack enable pnpm` if missing).

The ground-up rebuild is tracked in `docs/redesign/` (00–05) — read those before making
structural or design decisions; they are the decision record.

## Commands

- `pnpm dev` — React Router dev server with HMR (http://localhost:5173).
- `pnpm build` — type-check (`tsc -b`, gating) then `react-router build`; static output
  lands in `build/client/` with prerendered HTML for `/`, `/about`, and `/404`.
- `pnpm lint` — ESLint flat config (`eslint.config.js`) across the repo.
- `pnpm typecheck` — `tsc -b` only (the type-check half of the build).
- `pnpm test` — Vitest unit suite once; `pnpm test:watch` for watch mode.
- `pnpm test:e2e` — Playwright e2e against the dev server (`pnpm test:e2e:ui` for UI mode).
- `pnpm preview` — serve the built output locally.

These scripts are the single source of truth: the local pre-commit hooks and the CI
workflow both invoke them, so a green commit and a green CI run can't disagree. Change
behavior by editing the script in `package.json`, not by duplicating flags in a hook or
workflow.

## Architecture

- `src/routes.ts` declares routes; route modules live in `src/routes/` and export a
  default component plus a `meta()` function built from `src/content/seo.ts`.
- `src/content/` holds all copy and business data as typed modules — the single source of
  truth for text, contact details, and structured data. Never hardcode copy in components.
- `src/components/` holds presentational components; `src/design/tokens.css` owns every
  color/type/spacing/motion token. No raw hex values in components.
- `public/` assets (robots.txt, sitemap.xml, favicons, images) are copied verbatim into
  the build output.

## Testing

Vitest with the jsdom environment and Testing Library. Config lives in `vite.config.ts`
under the `test` key (`globals: true`, `setupFiles: ['./src/setupTests.ts']`). Co-locate
tests as `*.test.ts(x)` next to the code. Query by role/label, not by class name.

## TypeScript layout

TS project references — root `tsconfig.json` is a solution file referencing
`tsconfig.app.json` (src) and `tsconfig.node.json` (vite/react-router/playwright configs).
`verbatimModuleSyntax`, `noUnusedLocals`/`noUnusedParameters`, and `erasableSyntaxOnly`
are on: type-only imports must use `import type`, unused symbols fail the build, and
enums/namespaces are rejected — prefer plain unions/objects.

## Commit hygiene

- **Conventional Commits** enforced via commitlint (`commitlint.config.js`).
- **pre-commit framework** (`.pre-commit-config.yaml`): commitlint on `commit-msg`;
  `eslint --fix` on staged files, `pnpm typecheck`, and `pnpm test` on `pre-commit`;
  OpenTofu fmt/validate for `deploy/**.tf`.
- New clones: run `pre-commit install --hook-type pre-commit --hook-type commit-msg` once.
- **Do not bypass with `--no-verify`.** A Claude PreToolUse hook
  (`.claude/hooks/block-no-verify.sh`) rejects it; fix the underlying failure instead.

## CI & deployment

`.github/workflows/ci.yaml` runs `pnpm lint`, `pnpm build`, `pnpm test` on push/PR to
`main` — the same scripts as the pre-commit hooks. Production deploys are release-driven
(`deploy-app-prod.yaml`) and upload the static build to Azure Static Web Apps; infra is
Terraform under `deploy/infra/`.

## Design Direction

When building UI, use the `frontend-design` skill together with `ui-ux-pro-max`. The
accepted aesthetic is "Engineered Dark" (docs/redesign/03): today's palette (tokens in
`src/design/tokens.css`), Bricolage Grotesque / Public Sans / IBM Plex Mono, monospace
system labels, one primary CTA ("Book a call"). Avoid generic AI aesthetics: no
Inter/Roboto/Arial, no purple gradients, no cookie-cutter layouts.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
