# Development

## Prerequisites

- Node.js 24.x.
- pnpm via Corepack — run `corepack enable pnpm` once; the exact version comes from the
  `packageManager` field in `package.json`.
- `pre-commit` (Python tool) for the git hooks.

Install dependencies and hooks:

```bash
pnpm install
pre-commit install --hook-type pre-commit --hook-type commit-msg
```

## Common Commands

```bash
pnpm dev           # React Router dev server at http://localhost:5173
pnpm build         # tsc -b (gating) + react-router build + sitemap generation
pnpm lint          # ESLint flat config across the repo
pnpm typecheck     # tsc -b only
pnpm test          # Vitest unit suite (once)
pnpm test:watch    # Vitest watch mode
pnpm test:e2e      # Playwright e2e (starts the dev server itself)
pnpm preview       # Serve the built output locally
```

These scripts are the single source of truth: pre-commit hooks and CI invoke the same
commands, so a green commit and a green CI run cannot disagree. Change behavior by editing
the script in `package.json`, not by duplicating flags in a hook or workflow.

## TypeScript Layout

Project references: the root `tsconfig.json` is a solution file pointing at
`tsconfig.app.json` (everything under `src/`) and `tsconfig.node.json` (Vite, React
Router, and Playwright config files). Strictness flags to know about:

- `verbatimModuleSyntax` — type-only imports must use `import type`.
- `noUnusedLocals` / `noUnusedParameters` — unused symbols fail the build.
- `erasableSyntaxOnly` — no `enum` or `namespace`; use plain unions and objects.

## Conventions

- Function components and hooks only; co-locate `*.test.tsx` next to the source.
- Query the DOM by role/label in tests, not by class name.
- Copy belongs in `src/content/` modules, never inline in components.
- Component styles go in a co-located CSS file consuming tokens from
  `src/design/tokens.css`; no raw hex values in components.
- Route modules may export `meta`/`links` alongside the component — the ESLint
  react-refresh rule is configured to allow this for `src/routes/**` and `src/root.tsx`.

## Commit Hygiene

Conventional Commits are enforced by commitlint (`commit-msg` stage) — note that
sentence-case subjects are rejected; keep subjects lowercase. The `pre-commit` stage runs
`eslint --fix` on staged files, then `pnpm typecheck` and `pnpm test` for the whole repo,
plus OpenTofu fmt/validate when Terraform files change. Do not bypass with `--no-verify`;
a Claude Code hook blocks it, and CI would catch the failure anyway.
