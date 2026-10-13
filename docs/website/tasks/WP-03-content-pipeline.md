# WP-03: Content models, validation, and authoring pipeline

## Purpose and scope

Build the shared, UI-free content layer both collections use: schemas, frontmatter
parsing, validation, build-mode filtering, Markdown → sanitized hast rendering, derived
data (TOC, reading time, related), vocabularies, labeled fixtures, `pnpm content:check`,
and the post-build guard against drafts and fixtures. No routes or pages yet.

## Prerequisites

WP-01 done. Independent of WP-02.

## Read first

- `docs/website/CONTENT.md` (the schemas are the contract), `docs/website/ARCHITECTURE.md`
  ("Content pipeline", "Build modes", "Validation", "Markdown rendering", "Security",
  "Dependencies to add")
- `docs/website/DECISIONS.md` D-005 to D-009, D-020 to D-022
- `src/content/seo.ts`, `src/content/services.ts`, `src/content/about.ts` (existing
  conventions), `vite.config.ts` (test config), `tsconfig.app.json`, `eslint.config.js`,
  `package.json`, `pnpm-workspace.yaml`

## Relevant decisions

D-005, D-006, D-007, D-008, D-009, D-016, D-020, D-021, D-022.

## Implementation areas

| Path | Deliverable |
| --- | --- |
| `package.json` | Dev deps: `zod`, `yaml`, `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-sanitize`, `rehype-highlight`, `github-slugger`, `mdast-util-to-string`. Runtime dep: `hast-util-to-jsx-runtime`. Script `content:check` → `node scripts/content-check.mjs` (or a `.ts` run with Node 24 type stripping; record the choice). `build` gains the post-build guard |
| `src/content/collections/schema.ts` | zod schemas for project and article frontmatter per CONTENT.md, with exported inferred types |
| `src/content/collections/frontmatter.ts` | Split and parse the YAML block; reject a missing or duplicate block |
| `src/content/collections/filter.ts` | Pure `isIncluded(entry, { mode, today, fixtures })` and mode detection (`NODE_ENV`, `CONTENT_FIXTURES`) |
| `src/content/collections/markdown.server.ts` | unified pipeline → `{ hast, toc, readingMinutes, headings }`; class-based highlighting with registered languages (`ts`, `tsx`, `js`, `go`, `bash`, `json`, `yaml`, `http`, `sql`, `css`, `hcl`, `dockerfile`) |
| `src/content/collections/body-rules.ts` | Body checks: no H1, no skipped levels, no raw HTML, image alt, fence language, link protocols, required case-study sections, no `TODO` when published |
| `src/content/collections/load.server.ts` | `import.meta.glob` (`?raw`, eager) over `src/content/{work,blog}/*/index.md` and fixtures → validated, filtered entries; collection checks (duplicate slugs, folder = slug, unique `featured`, known author and tags, image files exist); throws an aggregated error |
| `src/content/collections/paths.ts` | `listContentPaths()` with `node:fs` for `react-router.config.ts` (not wired into `prerender` until WP-05/WP-06, because the routes don't exist yet) |
| `src/content/collections/{reading-time,toc,related}.ts` | Pure helpers |
| `src/content/{authors,blog-tags,work-taxonomy}.ts` | Vocabularies per CONTENT.md |
| `src/content/fixtures/work/*` | ≥ 3 projects: one each of `client` (anonymized), `internal`, `concept`; at least one with `outcomes`; one `status: draft`. Titles start with `[Fixture]`, `fixture: true`, clearly fake industries |
| `src/content/fixtures/blog/*` | ≥ 4 articles: one long (≥ 3 H2, code in two languages, a table, an image), one short, overlapping tags for related, one `status: draft` |
| `scripts/content-fixture-images.mjs` | Generates fixture placeholder PNGs with Playwright: a flat panel reading "DEVELOPMENT FIXTURE: not a real project" at 2880×1800 and 1170×2532. Never resembles a real site |
| `scripts/verify-build-content.mjs` | Post-build: fails if any draft or fixture slug, `[Fixture]` title, or `data-content-status` marker is in `build/client/**` (HTML, `.data`, XML), unless `CONTENT_FIXTURES=1` (then prints "FIXTURE BUILD: do not deploy") |
| `src/content/collections/*.test.ts` | Unit tests (below) |
| `docs/website/CONTENT.md` | Update if any field or rule changes; record any deviation in DECISIONS |

Implementation notes:

- Markdown, YAML, zod, and unified imports stay in `.server.ts` modules or files only
  imported by them. Shared types use `import type`.
- `rehype-sanitize`: start from `defaultSchema`, allow `className` on `code` and `span`
  (highlight classes) and `id` on `h2`/`h3`, set `clobberPrefix: ''`, and keep the
  protocol allow-list.
- Error messages: `src/content/blog/foo/index.md: tags[1] "reactjs" is not in
  src/content/blog-tags.ts`.

## Acceptance criteria

- **AC-1** `pnpm content:check` exits 0 for the repository (fixtures plus any real
  entries) and prints counts per collection and mode.
- **AC-2** Each rule has a failing-case unit test with the expected message: missing
  required field, bad slug, slug ≠ folder, duplicate slug (including across fixtures),
  unknown tag, unknown author, duplicate `featured`, raw HTML, H1 in body, skipped
  heading level, image without alt, fence without language, `javascript:` link,
  published without `review`, published client without `publicApproval`, outcome
  without `evidence`, concept with outcomes, `liveUrl` without `live-link` scope,
  `fixture: true` outside `fixtures/`, missing or misordered case-study section, `TODO`
  in a published entry, `updatedOn` before `publishedOn`.
- **AC-3** Filter tests: production excludes drafts, fixtures, missing approvals, and
  future dates; development includes drafts and fixtures; `CONTENT_FIXTURES=1` adds
  fixtures but never drafts.
- **AC-4** Sanitizer tests (validator bypassed): `<script>`, `<iframe>`, `onerror=`,
  `style=`, and `javascript:`/`data:` link URLs never survive into the hast.
- **AC-5** Derived data tests: stable heading ids (including duplicate headings),
  TOC from H2/H3, reading time per D-020, related ranking per D-021.
- **AC-6** `pnpm build` runs `verify-build-content.mjs` and passes. A test or recorded
  manual check proves it fails when a fixture marker is planted in `build/client`.
- **AC-7** `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm test:e2e` pass. No
  existing test changed except to add.
- **AC-8** `pnpm audit --prod` and `pnpm audit` results recorded in `VALIDATION.md`
  (high or critical findings in new packages block the package).

## Verification

```bash
pnpm install
pnpm content:check
pnpm test
pnpm lint && pnpm typecheck
pnpm build
CONTENT_FIXTURES=1 pnpm build   # prints the fixture warning, still passes
pnpm build                      # restore a production build afterwards
pnpm test:e2e
pnpm audit
graphify update .
```

## Exclusions

No routes, pages, components, or styles (WP-05/WP-06). No image variants or manifest
(WP-04); in this package images are only checked for existence. No sitemap or RSS
(WP-07). No real content. No changes to existing content modules beyond adding
imports where needed.

## Prompt

```text
Continue the Bit & Byte Ideas website extension. Read CLAUDE.md, then
docs/website/README.md, docs/website/MANIFEST.yaml, and docs/website/HANDOFF.md; check
git branch/status and reconcile the docs with the repository. Then complete WP-03 using
docs/website/tasks/WP-03-content-pipeline.md. The schemas in docs/website/CONTENT.md
are the contract; if you must deviate, update CONTENT.md and add a decision. Set WP-03
to in_progress before editing code, checkpoint the manifest, VALIDATION.md, and
HANDOFF.md after each milestone, and mark it done only when every acceptance criterion
passes. Fixtures must be obviously fake and labeled. Do not commit, push, or deploy
unless I ask.
```
