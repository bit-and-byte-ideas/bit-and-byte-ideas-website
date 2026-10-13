# WP-06: Blog index and article pages

## Purpose and scope

Ship `/blog` and `/blog/<slug>` with readable long-form typography, accessible code
blocks, an optional table of contents, related articles, author byline and dates, and a
path to booking. Basic meta only; RSS, sitemap, OG, and JSON-LD come in WP-07.

## Prerequisites

WP-02, WP-03, and WP-04 done. WP-05 is done: reuse its shared components
(`PageHeader`, `CtaBand`, `EmptyState`, `ContentStatusBanner`/`ContentStatusTag`,
`ContentBody`) and follow its route pattern (D-034): one static route per included
article, not a `:slug` route.

## Read first

- `docs/website/DESIGN.md` ("Long-form prose rules", "Layouts", syntax tokens),
  `docs/website/ARCHITECTURE.md` ("Markdown rendering", "Not-found behavior",
  "Performance budgets"), `docs/website/CONTENT.md` "Article"
- `docs/website/DECISIONS.md` D-007, D-013, D-016, D-020, D-021, D-022
- `src/routes.ts`, `react-router.config.ts`, `src/design/tokens.css`, `src/design/base.css`,
  `src/routes/about.tsx` (byline target), `src/content/about.ts`, `src/content/seo.ts`
- `src/content/collections/*` (WP-03/WP-04): loaders call `loadContent()`, `getArticle(slug)`,
  `renderEntry(entry)`, and `entryImage(entry, file)` from `load.server.ts`. Body images
  keep `src="./images/<file>"` in the hast; the loader returns a map from that src to
  `entryImage(entry, file)`, and the content renderer maps `img` to `ResponsiveImage`; `showToc`/`tocItems` (`toc.ts`) and
  `relatedArticles` (`related.ts`) are ready; fixtures are under
  `src/content/fixtures/blog/`. Any shared components from WP-05
- Skills: `frontend-design`, `ui-ux-pro-max`, `impeccable` in **Read** mode (run its
  `context.mjs --target src/routes/blog-article.tsx` once), per DESIGN.md limits

## Relevant decisions

D-004, D-007, D-008, D-013, D-016, D-020, D-021, D-022.

## Implementation areas

| Path | Deliverable |
| --- | --- |
| `src/routes.ts` | `route('blog', 'routes/blog-index.tsx')` plus one static route per included article from `listContentPaths({ collections: ['blog'] })`, all served by `routes/blog-article.tsx` with unique ids, exactly as `workRoutes` does (D-034). WP-07 adds `blog/rss.xml` |
| `react-router.config.ts` | No change: `prerender` is `getStaticPaths()` + `/404`, which picks up the article routes |
| `src/routes/blog-index.tsx` (+ `.css`) | Loader: included article summaries, newest first. Renders `PageHeader` and an `ArticleCard` list; `EmptyState` + `noindex` when empty |
| `src/routes/blog-article.tsx` (+ `.css`) | Loader: article (hast, toc, reading time, related summaries, author) or 404. Renders header, `ArticleMeta`, optional TOC, `Prose` body, author box, `RelatedArticles`, `CtaBand`. Route `ErrorBoundary` for branded 404 |
| `src/components/{article-card,article-meta,prose,code-block,table-of-contents,related-articles,author-box}.tsx` (+ `.css`, tests) | Per DESIGN.md |
| `src/content/blog-page.ts` | UI copy: labels, empty state, "Updated", "min read", TOC label "On this page", related heading, author box text |
| `src/design/tokens.css` | `--measure-prose`, `--text-prose`, `--leading-prose`, `--surface-code`, `--syntax-*` |
| `e2e/blog.spec.ts`, `e2e/built/blog.spec.ts` | Dev and built-output tests |

Empty-state copy (draft): heading "Articles are on the way", body "We're writing about
practical engineering decisions for small businesses. Until the first one is out, the
fastest way to get an answer is to ask us directly.", then the `CtaBand`.

## Acceptance criteria

- **AC-1 (dev)** `/blog` lists included fixture articles newest first: title link (H2),
  description, `<time datetime>` date, reading time, and tags. The draft fixture page
  shows the "Draft" banner.
- **AC-2** Article page: one H1, description, byline "Carlos Barajas" linking `/about`,
  published date, "Updated" date only when `updatedOn` is set, reading time equal to the
  D-020 calculation, tags as text.
- **AC-3** The long fixture shows a TOC (`nav` named "On this page") whose links land
  on the headings below the fixed nav (`scroll-margin-top`). The short fixture shows no
  TOC.
- **AC-4** Code blocks: `pre` is focusable (`tabindex="0"`), has an accessible name
  including the language, scrolls horizontally without page overflow, and uses class-based
  highlighting (no `style` attributes in the HTML). Every `--syntax-*` token measures
  ≥ 4.5:1 against `--surface-code` (computed values recorded in evidence).
- **AC-5** Prose: links underlined; lists, blockquote, table (in a focusable scroll
  container), and figure with caption render per DESIGN.md. Body text ≥ 16px at 375px
  and line length ≤ `--measure-prose`.
- **AC-6** Related articles: up to 3 by D-021. The section is absent when nothing
  qualifies.
- **AC-7** Every article ends with "Book a Call" and "Get in Touch" (existing labels and
  destinations).
- **AC-8 (production build, no real content)** `/blog/index.html` shows the empty state
  with `noindex`. No article HTML or `.data` files for drafts or fixtures.
  `verify-build-content.mjs` passes.
- **AC-9 (built harness, fixture build)** Direct load and refresh of an article URL →
  200. `/blog/not-an-article` and the draft fixture's URL → 404 with the branded H1
  after hydration.
- **AC-10** Client bundle: no `micromark`, `unified`, `zod`, `yaml`, or `lowlight`/
  `highlight.js` strings in `build/client/assets/*.js`. Added gzip JS for the blog
  routes ≤ 15 KB (measured, recorded).
- **AC-11** Screenshots at 375, 768, 1024, and 1440 (index, long article, short article,
  empty state) in `docs/website/evidence/<date>-wp06-blog/`. No horizontal overflow.
- **AC-12** `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e`,
  and `pnpm test:e2e:built` pass.

## Verification

```bash
pnpm content:check
pnpm test && pnpm lint && pnpm typecheck
pnpm dev   # manual pass at http://localhost:5173/blog and each fixture article
pnpm test:e2e
CONTENT_FIXTURES=1 pnpm build && pnpm test:e2e:built
grep -lE 'micromark|unified|lowlight|highlight\.js' build/client/assets/*.js || echo "no parser code in client"
pnpm build && pnpm test:e2e:built
graphify update .
```

## Exclusions

No RSS, sitemap, OG, or JSON-LD (WP-07). No tag pages, pagination, search, comments, or
newsletter (D-016). No copy-to-clipboard or scroll-spy (needs JS; revisit after launch).
No real articles: agents must not write publishable articles in this package.

## Prompt

```text
Continue the Bit & Byte Ideas website extension. Read CLAUDE.md, then
docs/website/README.md, docs/website/MANIFEST.yaml, and docs/website/HANDOFF.md; check
git branch/status and reconcile the docs with the repository. Then complete WP-06 using
docs/website/tasks/WP-06-blog.md, reusing any shared components WP-05 already created.
Follow docs/website/DESIGN.md (use frontend-design, ui-ux-pro-max, and impeccable in
Read mode). Set WP-06 to in_progress before editing code, checkpoint the manifest,
VALIDATION.md, and HANDOFF.md after each milestone, save screenshots under
docs/website/evidence/, and mark it done only when every acceptance criterion passes.
Do not write real articles. Do not commit, push, or deploy unless I ask.
```
