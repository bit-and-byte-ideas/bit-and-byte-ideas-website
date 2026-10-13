# Architecture

Last updated: 2026-10-12. Decisions referenced as `D-###` are in [DECISIONS.md](DECISIONS.md).
Field-level schemas are in [CONTENT.md](CONTENT.md). This file covers how the parts fit.

## Constraints that shape everything

- **Static prerendering, no runtime server.** `ssr: false` with an explicit `prerender`
  list. Every public page is HTML written at build time and served by Azure Static Web
  Apps. Verified in React Router 8.3.0 (`@react-router/dev` `dist/vite.js`,
  `dist/config-*.d.ts`):
  - `prerender` accepts `({ getStaticPaths }) => string[] | Promise<string[]>`.
  - With `ssr: false`, a route may export `loader` only if every path it matches is
    prerendered. The loader runs **at build time only**; its result is embedded in the
    HTML and written to `<path>.data` for client navigation. `headers` and `action` are
    rejected.
  - A route with a `loader` and no default export (a resource route) is prerendered to a
    file, so `sitemap.xml` and `rss.xml` can be routes.
- **Strict CSP** (`public/staticwebapp.config.json`): `script-src 'self'`,
  `style-src 'self'`, `img-src 'self' data:`, `frame-ancestors 'none'`. Consequences:
  no inline `style` attributes in rendered content (class-based syntax highlighting), and
  no third-party images or iframes. React Router's inline bootstrap is moved into
  same-origin files by `scripts/externalize-inline-scripts.mjs`, the last `pnpm build`
  step (WP-02). New features must never add inline scripts; the build fails if one
  survives.
- **Pages must be complete without JavaScript.** Crawlers should never depend on JS, and
  production went unhydrated for two months (AUDIT K1), so content can't depend on it either. No feature may need client JS to
  show content (TOC is plain links; no client-side filtering).

## Routes

`src/routes.ts` (existing entries unchanged; `*` stays last). Content detail pages are
**one static route per included entry**, all served by the same module (D-034), not a
`:slug` route:

```ts
const workRoutes = listContentPaths({ collections: ['work'] }).map((path) =>
  route(path.slice(1), 'routes/work-project.tsx', { id: `work-project${path.slice('/work'.length)}` }),
);
// [..., route('work', 'routes/work-index.tsx'), ...workRoutes, ..., route('*', ...)]
```

WP-06 added `blog` (index) and `blogRoutes` (`routes/blog-article.tsx`, ids
`blog-article/<slug>`) the same way; WP-07 adds the `blog/rss.xml` and `sitemap.xml`
resource routes. Detail modules read their slug with `slugFromRequest`
(`src/content/collections/request-slug.ts`, strips `.data` and trailing slashes), so a
wrong slug 404s during prerender and fails the build.

`react-router.config.ts`:

```ts
prerender: async ({ getStaticPaths }) => [...getStaticPaths(), '/404'],
```

`getStaticPaths()` returns every route without a `:param` or `*` (verified in React
Router 8.3.0 `getStaticPrerenderPaths()`), which now includes each entry's route.
`listContentPaths()` uses the same validation and filtering as the loaders, in the same
mode: `react-router dev` sets `NODE_ENV=development` (drafts and fixtures included) and
`react-router build` sets `production` (fixtures only with `CONTENT_FIXTURES=1`).
Verified by probing both commands.

Why static routes: with `ssr: false`, every route that has a loader must be prerendered
for at least one path, and a `:slug` route also broke hydration of the 404 page for
unknown slugs (see Not-found behavior). With no included entries there is simply no
detail route, and `/work/<anything>` falls through to `*`.

Canonical URLs have no trailing slash (matches `pageMeta()` today). Slugs match
`^[a-z0-9]+(?:-[a-z0-9]+)*$` and never contain dots.

## Content pipeline

```text
src/content/{work,blog}/<slug>/index.md   ──┐
src/content/fixtures/{work,blog}/<slug>/…   │  import.meta.glob(?raw)   (loaders, HMR in dev)
                                            │  node:fs                  (config, scripts)
                                            ▼
                         parse frontmatter (yaml) ──► validate (zod) ──► include? (mode filter)
                                                                              │
                                     ┌────────────────────────────────────────┤
                                     ▼                                        ▼
                   markdown → mdast → hast (sanitized)              summaries (index, related,
                   + heading ids, TOC, reading time,                sitemap, RSS, homepage)
                   + image refs resolved via media manifest
                                     │
                                     ▼
                   route loader returns plain JSON (hast tree + metadata)
                                     │  embedded in prerendered HTML and <path>.data
                                     ▼
                   component renders hast → React (hast-util-to-jsx-runtime),
                   mapping img/pre/a/h2/h3/table to project components
```

### Layout (built in WP-03 unless noted)

```text
src/content/
  collections/              code, no copy (sibling imports use explicit .ts: D-027)
    schema.ts               zod schemas + inferred types (client code: `import type` only)
    frontmatter.ts          split the `---` block, parse with `yaml` (duplicate keys rejected)
    body-rules.ts           Markdown body rules (structure, safety, case-study sections)
    validate.server.ts      buildCollections(sources, { today, fileExists }): pure orchestrator,
                            collection rules (duplicate slugs/ranks, images exist), issue formatting
    filter.ts               pure: isIncluded / isScheduled, contentMode, buildOutputMode, todayUtc
    media.ts                media manifest types, mediaKey, resolveImage, manifestImageCheck (WP-04)
    image-dimensions.ts     header-only width/height for PNG/JPEG/WebP/AVIF (WP-04)
    markdown.server.ts      parseMarkdown / renderMarkdown → { hast, headings }
    load.server.ts          route loaders: Vite glob sources → loadContent(), getProject(),
                            getArticle(), renderEntry(); throws on invalid content
    fs-sources.ts           node:fs sources for scripts and react-router.config.ts
    paths.ts                listContentPaths() for prerender (wired in WP-05/WP-06)
    build-guard.ts          leak markers + scan used by scripts/verify-build-content.ts
    reading-time.ts, toc.ts, related.ts    pure helpers
    test-utils.ts, *.test.ts               unit tests (Node environment)
  work/<slug>/index.md (+ images/)          real projects (none yet)
  blog/<slug>/index.md (+ images/)          real articles (none yet)
  fixtures/work/…, fixtures/blog/…          development fixtures (D-008, D-029)
  authors.ts, blog-tags.ts, work-taxonomy.ts  controlled vocabularies
  work-page.ts, blog-page.ts                UI copy for the new pages (WP-05/WP-06)
  media-manifest.json                       generated by `pnpm content:images` (committed)
scripts/
  content-check.ts          pnpm content:check (Node type stripping)
  verify-build-content.ts   last step of pnpm build
  content-fixture-images.mjs  pnpm content:fixture-images (Playwright placeholders)
  content-images.ts         pnpm content:images (sharp; authoring only)
  content-capture.ts        pnpm content:capture (Playwright)
  prune-build-media.ts      build step: drop media of excluded entries
```

The `.server.ts` suffix tells React Router to keep a module out of the client bundle.
Markdown, YAML, zod, and unified code must only be imported from `.server.ts` modules,
scripts, and route `loader`s. The client receives JSON plus `hast-util-to-jsx-runtime`.
Verified after WP-03: no `micromark`, `unified`, `ZodError`, `lowlight`, or
`github-slugger` strings in `build/client/assets/*.js`.

### Build modes (D-008)

| Mode | How | Included entries | Extras |
| --- | --- | --- | --- |
| Production | `pnpm build` (CI, dev deploy, prod deploy) | `status: published`, `review` present, `publishedOn` ≤ build date, not a fixture; client entries also need `publicApproval` | Post-build check fails if any draft or fixture marker appears in `build/client/` |
| Development | `pnpm dev` | Everything valid, including drafts and fixtures | `ContentStatusBanner` ("Draft" / "Development fixture"), `noindex` on those pages |
| Fixture build | `CONTENT_FIXTURES=1 pnpm build` | Production set plus fixtures (no drafts) | For build-output e2e only. Fixture pages render the banner and `noindex`; the post-build check prints "FIXTURE BUILD: do not deploy". Deploy workflows never set this variable |

Entries with `publishedOn` in the future are excluded from production with a build
warning (they publish on the first release after that date).

### Validation (D-006)

- Schemas in `schema.ts`. Fields and rules are in [CONTENT.md](CONTENT.md#schemas).
- Collection-level checks: unique slugs per collection (fixtures included), valid folder
  name (the slug), `featured` ranks unique, tag and author vocabularies, fixture
  location and title prefix, image files exist with current variants in the media
  manifest, no future `completedOn`/`updatedOn`/approval dates.
- Body checks: no H1, headings start at H2 without skipping levels, no raw HTML, no
  footnotes, alt text (≥ 10 chars) on every image, images only from the entry folder, a
  supported language on every fenced code block, links only `https:`, `http:`,
  `mailto:`, `/`-relative, or `#` anchors, no `TODO` once published. For projects: the
  four case-study sections, in order.
- Entry points (D-026): `pnpm test` (validates every entry on disk), `pnpm build` (its
  last step validates and scans output), `pnpm content:check`, and the loaders.
- Errors name the file, line, field, and fix, for example
  `src/content/blog/foo/index.md: tags[1] "reactjs" is not in src/content/blog-tags.ts`.

### Markdown rendering (D-007)

`unified` → `remark-parse` → `remark-gfm` → `remark-rehype` (`allowDangerousHtml: false`,
so raw HTML is dropped, and the validator rejects it first) → heading ids
(`github-slugger`) → `rehype-highlight` (class-based, registered languages only) →
`rehype-sanitize` (GitHub schema extended to allow `className` on `code`/`span` and `id`
on headings, `clobberPrefix: ''`) → hast JSON.

The client maps elements to components (`src/components/content-body.tsx`, with
`passNode` so components can read the hast; the node never reaches the DOM): `img` →
`ResponsiveImage` in a `figure` (the image title is the `figcaption`, D-035), `pre` →
`CodeBlock` (language from the `language-*` class), `table` → focusable scroll container
named after its header cells, `a` → external-link treatment for off-site URLs, and, for
articles only (`headingAnchors`), `h2`/`h3` → heading plus a sibling permalink. Text
extraction on the client uses `collections/hast-text.ts` (pure; `markdown.server.ts`
imports it too). There is no `dangerouslySetInnerHTML` for content. The only
use stays the existing JSON-LD injection through `toJsonLdScript()`, which escapes `<`.

Derived data: TOC from H2/H3 (`toc: auto` shows it when there are ≥ 3 H2s); reading time
= words outside code blocks ÷ 225, rounded up, minimum 1 (D-020); related articles = most
shared tags, then newest, up to 3 (D-021).

## Images (D-010, WP-04)

Built in WP-04.

- Originals live with their entry: `src/content/<collection>/<slug>/images/<name>.png|jpg`
  (fixtures under `src/content/fixtures/`).
- `pnpm content:images` (`scripts/content-images.ts`, `sharp` devDependency) writes
  committed variants to `public/media/<collection>/<slug>/<name>-<width>.<hash8>.{avif,webp}`
  and, for covers, `<name>-og.<hash8>.jpg` (1200×630, top-anchored). Widths are
  480/800/1200/1600/2400 below the source width, topped up with the source width
  (capped at 2400). AVIF q60 4:4:4, WebP q82, JPEG q82 mozjpeg. The source hash in each
  name gives every changed image a new URL (safe to cache forever). Metadata goes to
  `src/content/media-manifest.json` (dimensions, variants with bytes, OG, source hash,
  and a settings fingerprint: changing encoder settings regenerates everything).
  Unchanged sources are skipped; a second run writes nothing. `--check` verifies only,
  `--prune` removes outputs whose original is gone, `--report` prints a size table.
- Validation (`media.ts` `manifestImageCheck`, used by every caller of
  `buildCollections`): each referenced image must be in the manifest, its source hash
  must match, and its files must exist, or the issue says "run pnpm content:images".
- Loaders get image data through `entryImage(entry, file)` in `load.server.ts`, which
  returns a `ResolvedImage` (srcsets, WebP fallback, dimensions, OG). The manifest is
  read through Vite's glob (hot-reloads in dev) and never reaches the client bundle.
- `public/` is copied into every build, so `scripts/prune-build-media.ts` (after
  `react-router build`) deletes `build/client/media/<collection>/<slug>/` for every entry
  the build excludes, and `verify-build-content.ts` fails if any such folder remains.
- `sharp` never runs in `pnpm build` or `pnpm test`: proven by running both with a Node
  resolve hook that blocks `sharp` (WP-04 evidence). Tests read image dimensions with
  `image-dimensions.ts` (PNG/JPEG/WebP/AVIF header parser). The type-check step reads
  `sharp`'s type declarations for `scripts/content-images.ts`, which needs the package
  installed (it is a devDependency) but not its native binary.
- Components: `ResponsiveImage` (`<picture>`, AVIF then WebP `srcset`, `sizes`,
  `width`/`height`, `priority` → eager + `fetchpriority="high"`, otherwise lazy + async
  decoding) and `ScreenshotFrame` (`crop` at `--frame-ratio` top-anchored, or `natural`;
  optional caption).
- `pnpm content:capture <url> <work|blog>/<slug> <name> [--viewport mobile] [--full-page]`
  (`scripts/content-capture.ts`, Playwright) captures desktop 1440×900 @2x or mobile
  390×844 @3x with reduced motion and fonts loaded, refuses to overwrite without
  `--force`, and only targets real entries (never fixtures). Only for sites with
  recorded approval (CONTENT.md).
- No iframes of customer sites. The CSP (`frame-src` falls back to `'self'`) would block
  them anyway, and they are slow, unstable, and can show content the client did not
  approve.

## Not-found behavior (R-B8)

- Unknown, draft, and excluded slugs have no route and no prerendered page. SWA's
  `responseOverrides.404` serves `/404/index.html` with **HTTP 404**, and the client
  matches the URL to the `*` route as well, so hydration keeps the branded page. Verified
  in the built fixture site (`e2e/built/work.spec.ts`) and in dev (`e2e/work.spec.ts`).
- AUDIT K14 (resolved, D-034): with the original `work/:slug` route, the client matched
  `/work/unknown` to the detail route, found no data for it in the 404 page, and threw
  "No result found for routeId" during hydration, so the page switched to "Something
  went wrong".
- Detail loaders still throw `data(null, { status: 404 })` if a slug is missing, and the
  route `ErrorBoundary` renders the branded 404 for that case; any other error bubbles
  to the root boundary.

## Discovery (WP-07)

- **Meta:** extend `pageMeta()` in `src/content/seo.ts` with optional `type`
  (`website` | `article`), `image`, `publishedTime`, `modifiedTime`, `tags`, and keep the
  existing output byte-identical for existing routes (unit-tested). Detail routes build
  `meta()` from loader data.
- **JSON-LD:** new builders `blogPostingSchema`, `blogSchema` (index), `projectSchema`
  (`CreativeWork`, creator → `#organization`), `breadcrumbSchema`, all rendered through
  `toJsonLdScript()`. No `Review`, `AggregateRating`, or invented metrics.
- **Sitemap:** resource route `/sitemap.xml` replaces `scripts/generate-sitemap.mjs`
  after output parity is proven for existing URLs (D-011). Static routes keep the build
  date as `lastmod`; entries use `updatedOn ?? publishedOn`; index pages use their newest
  entry. Empty collections are omitted (D-013).
- **RSS:** `/blog/rss.xml`, RSS 2.0 with `atom:link rel="self"`, full permalinks, RFC 822
  dates, description only. Linked via `<link rel="alternate" type="application/rss+xml">`
  from blog pages.
- **`llms.txt` and `robots.txt`:** add `/work` and `/blog` links when they have content.
  Robots needs no change (everything is allowed).

## Security

- Content is author-controlled Markdown in the repo, reviewed by PR, but still treated as
  untrusted for rendering: raw HTML dropped, sanitizer on, URL protocols allow-listed,
  no `style` attributes, no `script`/`iframe`/`object` ever produced.
- JSON-LD always goes through `toJsonLdScript()`.
- External links get `rel="noopener noreferrer"`.
- `publicApproval` and `review` records keep unapproved client material and unreviewed
  articles out of production builds (D-009).

## Performance budgets (verified in WP-09)

- No Markdown, YAML, zod, or highlighter code in `build/client/assets/*.js` (check for
  `micromark`, `unified`, `zod` strings).
- Added client JS for the content routes ≤ 15 KB gzip (hast renderer plus components).
  Measured in WP-06 (`evidence/2026-10-12-wp06-blog/bundle-size.txt`): article route
  14.37 KB, project route 14.21 KB, of which the shared `content-body` chunk (renderer,
  `hast-util-to-jsx-runtime`, CodeBlock) is 10.84 KB. Little headroom: a new client
  dependency on these routes will exceed the budget.
- Article `.data` payload ≤ 2× the prerendered article HTML size.
- Images: explicit dimensions (CLS 0 from images), one prioritized LCP image per page,
  card images ≤ 150 KB at the rendered width.
- Lab measurements only (Playwright `PerformanceObserver`, optionally Lighthouse CLI).
  Never claim field Core Web Vitals.

## Testing

| Layer | Where | What |
| --- | --- | --- |
| Unit | `src/content/collections/*.test.ts` | Schemas (valid/invalid fixtures), filter modes, duplicate slugs, reading time, TOC, related, sanitizer (script/iframe/`javascript:` stripped), sitemap/RSS builders |
| Component | `src/components/*.test.tsx` | Rendering by role/label: badges, meta lists, empty states, TOC, code block a11y attributes |
| E2E (dev) | `e2e/*.spec.ts` against `pnpm dev` | Fixture-driven journeys: index → detail → CTA, homepage section, nav links, keyboard paths |
| E2E (built) | `pnpm test:e2e:built` (`e2e/built/`, `playwright.built.config.ts`, `scripts/serve-built.mjs`): built output served with `staticwebapp.config.json` headers, MIME types, and 404 rewrite. The work specs detect the build type: production checks (empty state, 404s) or fixture checks (pages, refresh, client navigation). CI runs it against both builds | Hydration under CSP, direct load and refresh of detail URLs, 404 status for unknown/draft slugs, sitemap and RSS contents, no drafts in output |
| Build verification | `scripts/verify-build-content.ts` (last `pnpm build` step) | Content validates; no excluded entry's URL, multi-word slug, or 3+-word title, no `[Fixture]` prefix, and no `data-content-status` in documents, anywhere in `build/client/**` (production); no `build/client/media/<collection>/<slug>` for an excluded entry (`prune-build-media.ts` runs first). Fixture builds allow fixtures but never drafts |

## Deployment

No workflow changes are needed to publish content: content ships with the code. Merging
to `main` deploys the dev environment (`deploy-app-dev.yaml`), and publishing a GitHub
release deploys production (`deploy-app-prod.yaml`). The dev environment is a public URL,
so it uses production filtering (drafts never deploy anywhere). Rollback = re-publish
the previous release. `staticwebapp.config.json` serves `.data` files as `text/x-script`
(D-033); confirm client navigation to a content page on the dev URL after the first
deploy with content. CI's e2e job runs `pnpm test:e2e:built` after `pnpm build` (WP-02). WP-10 documents
the release checklist.

## Dependencies to add

| Package | Kind | Why | Task |
| --- | --- | --- | --- |
| `zod` | dev | Frontmatter schemas (build-time) | WP-03 |
| `yaml` | dev | Frontmatter parsing | WP-03 |
| `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-sanitize`, `rehype-highlight`, `github-slugger` | dev | Build-time Markdown → sanitized hast (added in WP-03; `mdast-util-to-string` turned out unnecessary) | WP-03 |
| `@types/hast`, `@types/mdast` | dev | Tree types (pnpm does not hoist transitive `@types`) | WP-03 |
| `hast-util-to-jsx-runtime` | runtime | Render hast as React on the client | WP-03 |
| `sharp` | dev | Authoring-time image variants (0.35.5; prebuilt binaries, no build-script approval needed) | WP-04 |
| `@axe-core/playwright` | dev | Automated accessibility checks | WP-09 |

Each addition is checked with `pnpm audit` and against the client bundle budget. If a
package needs a postinstall script, add it to `allowBuilds` in `pnpm-workspace.yaml`.
