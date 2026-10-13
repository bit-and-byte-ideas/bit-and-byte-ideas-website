# Handoff

Updated: 2026-10-12, end of the WP-06 session.

## State

- **Branch:** `site-improvements` at `4074b5e` (same as `main`). Nothing committed.
- **Done:** WP-01 to WP-06. The work gallery and the blog are built: `/work` and `/blog`
  show empty states in production until real entries exist; one prerendered page per
  included project or article.
- **Ready:** WP-07 (recommended next), WP-08, WP-11. Status is authoritative in
  [MANIFEST.yaml](MANIFEST.yaml).
- **Content:** no real projects or articles; 8 labeled fixtures. All
  `content_readiness` items `missing`.

## What WP-06 added

- Routes: `src/routes/blog-index.tsx` and `blog-article.tsx` (+ CSS). `src/routes.ts`
  adds `route('blog', …)` and `blogRoutes`, one static route per included article
  (D-034). `slugFromRequest` moved to `src/content/collections/request-slug.ts` (work
  uses it too).
- Components: `article-card`, `article-meta`, `code-block`, `table-of-contents`,
  `related-articles`, `author-box`. `content-body` now maps `pre` → `CodeBlock`, `table`
  → focusable scroll container, image title → `figcaption` (D-035), and, with
  `headingAnchors`, H2/H3 → heading plus sibling permalink. `PageHeader` gained a
  `children` slot (the byline strip). The TOC is one `nav` with a collapsed disclosure
  below 1100px and a sticky rail above (D-036).
- Content: `blog-page.ts` (copy), `content-labels.ts` (code/table/permalink labels and
  language names), `collections/blog-view.ts` (ordering, summaries, details, related),
  `collections/hast-text.ts`, `bio` in `authors.ts` (facts from `/about` only). The long
  fixture's image has a caption.
- Tokens: `--surface-code`, `--syntax-*` (number is cyan-300, not `--soft-green`; see
  DESIGN.md). `base.css` gained `.heading-label`; the back link's styles moved to
  `page-header.css`.
- Tests: 210 unit (34 new), 51 dev e2e (20 new), built e2e 27 passed on the fixture
  build and 21 on the production build.
- Docs: DESIGN.md (tokens, components, WP-06 notes), ARCHITECTURE.md (routes, rendering,
  measured JS budget), CONTENT.md and `templates/article.md` (captions), DECISIONS D-035
  and D-036, impeccable surface brief `.impeccable/surfaces/src-routes-blog-article-tsx.md`.

## Uncommitted work

| Files | From | Note |
| --- | --- | --- |
| `.agents/skills/*`, `.claude/skills/*`, `skills-lock.json` | Carlos (**staged**) | A plain `git commit` would include them; commit project files by path |
| WP-02 to WP-05 files | earlier sessions | See their VALIDATION sections |
| `src/routes/blog-*`, `src/components/{article-card,article-meta,author-box,code-block,related-articles,table-of-contents,blog-components.test}.*`, `src/content/{blog-page.ts,content-labels.ts,collections/{blog-view,blog-view.test,hast-text,request-slug,request-slug.test}.ts}`, `src/routes/blog-routes.test.ts`, `e2e/blog.spec.ts`, `e2e/built/blog.spec.ts`, `.impeccable/surfaces/src-routes-blog-article-tsx.md` (untracked); `src/routes.ts`, `src/routes/work-project{.tsx,.css}`, `src/components/{content-body,page-header}.*`, `src/content/{authors.ts,collections/markdown.server.ts}`, `src/content/fixtures/blog/fixture-long-article/index.md`, `src/design/{tokens,base}.css` (modified) | WP-06 | |
| `docs/website/**`, `docs/quality-operations.md` and other docs | WP-01 to WP-06 | |

## Notes for the next session

- The content-route JS budget is nearly spent: the article route adds 14.37 KB of the
  15 KB allowed (`evidence/2026-10-12-wp06-blog/bundle-size.txt`). WP-07 should keep
  JSON-LD and RSS on the build side; a new client dependency on these routes will
  exceed the budget.
- WP-07 needs article covers for `og:image`: `entryImage(entry, cover.file)` already
  resolves them, and the image pipeline writes `<name>-og.<hash>.jpg` for covers.
- In `pnpm dev`, a TOC click made before hydration lands about 29px high (Vite injects
  CSS while `ScrollRestoration` scrolls). Built output is correct; don't chase it in
  production code.
- Flex links: space glyphs with `gap`, never literal spaces (AUDIT K16). New `<section>`
  elements inherit the global 96px padding; reset it inside columns.
- The `.data` MIME type on Azure is unverified until a deploy with content (D-033).
- `graphify update .` still refuses without `--force` (the new graph is smaller than the
  saved one); not forced.
- Firefox can't launch in this sandbox. The impeccable detector's URL mode needs
  puppeteer, which isn't installed (file scans work).

## Blockers

None for WP-07, WP-08, or WP-11.

## Next action

Start **WP-07**: snapshot today's `pageMeta` output, then add JSON-LD builders, the
`/sitemap.xml` and `/blog/rss.xml` resource routes, and XML checks in
`verify-build-content`. Task document:
[tasks/WP-07-metadata-and-discovery.md](tasks/WP-07-metadata-and-discovery.md).

## Continuation prompt

```text
Continue the Bit & Byte Ideas website extension (work gallery + blog). Read CLAUDE.md,
then docs/website/README.md, docs/website/MANIFEST.yaml, and docs/website/HANDOFF.md;
check git branch/status and reconcile the docs with the repository (keep my staged
taste-skill install untouched). Then complete WP-07 using
docs/website/tasks/WP-07-metadata-and-discovery.md, building on the routes, view modules,
and fixtures WP-05 and WP-06 established; keep everything build-side (no new client
JavaScript on the content routes). Set WP-07 to in_progress in the manifest before
editing code. Checkpoint MANIFEST.yaml, VALIDATION.md, and HANDOFF.md after each
milestone, save evidence under docs/website/evidence/, and mark WP-07 done only if every
acceptance criterion passes; report passed / failed / not run honestly. Do not write
real articles. Do not commit, push, or deploy unless I ask.
```
