# WP-05: Work gallery index and project pages

## Purpose and scope

Ship `/work` and `/work/<slug>`: prerendered, accessible, on-brand pages that present
projects honestly, distinguish client, internal, and concept work, and lead to the
existing booking and contact paths. Basic meta only; full social and structured data
come in WP-07. Homepage and nav integration come in WP-08.

## Prerequisites

WP-02 (built-output harness, hydration), WP-03 (content layer), WP-04 (images) done.
BRIEF Q1 (outside retexture work) answered or still defaulted.

## Read first

- `docs/website/DESIGN.md` (whole file), `docs/website/ARCHITECTURE.md` "Routes",
  "Not-found behavior", `docs/website/CONTENT.md` "Project"
- `docs/website/DECISIONS.md` D-002, D-004, D-012, D-013
- `src/routes.ts`, `react-router.config.ts`, `src/routes/about.tsx` + `about.css`
  (page pattern), `src/components/services.tsx` + `.css` (card pattern),
  `src/components/hero.css` (atmosphere), `src/design/base.css`, `src/design/tokens.css`,
  `src/content/seo.ts` (`pageMeta`), `src/root.tsx` (`ErrorBoundary`),
  `src/routes/not-found.tsx`
- `src/content/collections/*` (WP-03/WP-04): loaders call `loadContent()`, `getProject(slug)`,
  `renderEntry(entry)`, and `entryImage(entry, file)` (a `ResolvedImage` for
  `ScreenshotFrame`; the page's cover gets `priority`) from `load.server.ts`; prerender paths come from
  `listContentPaths()` in `paths.ts`; fixtures are under `src/content/fixtures/work/`, `src/components/responsive-image.tsx` and
  `screenshot-frame.tsx` (WP-04)
- Skills: `frontend-design`, `ui-ux-pro-max`, and `impeccable` in **Experience** mode
  (run `node .agents/skills/impeccable/scripts/context.mjs --target src/routes/work-project.tsx`
  once), within the limits in DESIGN.md

## Relevant decisions

D-002, D-004, D-007, D-008, D-010, D-012, D-013 (empty state + `noindex`), D-019.

## Implementation areas

| Path | Deliverable |
| --- | --- |
| `src/routes.ts` | `route('work', 'routes/work-index.tsx')`, `route('work/:slug', 'routes/work-project.tsx')` before `*` |
| `react-router.config.ts` | `prerender` becomes the function in ARCHITECTURE, including `listContentPaths()` for work. `tsconfig.node.json` include updated if needed |
| `src/routes/work-index.tsx` (+ `.css`) | Loader: included project summaries in display order (featured rank, then `completedOn` desc). Renders `PageHeader`, project rows, `CtaBand`; `EmptyState` + `noindex` when empty |
| `src/routes/work-project.tsx` (+ `.css`) | Loader: one project (hast body, images, meta) or `throw data(null, { status: 404 })`. Renders back link, `KindBadge`, H1, summary, cover, `ProjectMeta`, `CaseStudy`, outcomes, gallery, next-project link, `CtaBand`. Route `ErrorBoundary` renders the branded not-found content for 404 (AUDIT K14) |
| `src/components/{page-header,kind-badge,project-card,project-meta,case-study,cta-band,empty-state,content-status-banner,content-body}.tsx` (+ `.css`, tests) | Per DESIGN.md. `content-body` renders hast via `hast-util-to-jsx-runtime` with component mapping (shared with WP-06) |
| `src/content/work-page.ts` | All UI copy: labels, empty-state text, kind labels, CTA band heading |
| `src/design/tokens.css` | Only the tokens DESIGN.md lists for this package |
| `src/design/base.css` | Add new card selectors to the existing `section-rise` list if entrance motion is used |
| `e2e/work.spec.ts`, `e2e/built/work.spec.ts` | Dev (fixtures) and built-output tests |

Empty-state copy (draft; final copy goes in `work-page.ts`): heading "Case studies are
on the way", body "We're writing up recent projects with our clients' permission. In
the meantime, we're happy to walk you through relevant work on a call.", then the
`CtaBand`.

## Acceptance criteria

- **AC-1 (dev, fixtures)** `/work` lists every included fixture project in the defined
  order. Each row shows cover, kind label text, title link, summary, and industry. A
  draft fixture shows the "Draft" banner on its page.
- **AC-2** Project pages show title (one H1), kind label, summary, industry, category,
  services (labels from `services.ts`), technologies, completion date, live link (only
  when present; new tab with sr-only cue), the four case-study sections as H2s, outcome
  statements (never `evidence`), and gallery images with their alt text. The concept
  fixture shows "Concept" and no outcomes.
- **AC-3** Every project page ends with "Book a Call" (Calendly URL, new tab) and "Get in
  Touch" (`/#contact`). No new CTA labels.
- **AC-4 (production build, no real content)** `/work/index.html` exists, shows the
  empty state, and carries `noindex`. No `/work/<fixture>` files exist.
  `verify-build-content.mjs` passes.
- **AC-5 (built harness, fixture build)** Direct load and refresh of a fixture project
  URL returns 200 with full content. `/work/not-a-project` returns 404 and still shows
  the branded not-found H1 after hydration. Client navigation index → project → back
  works with hydration on.
- **AC-6** Keyboard: every link reachable in order, visible focus, no traps. One H1,
  no skipped heading levels. Card hit areas ≥ 44px tall.
- **AC-7** Screenshots at 375, 768, 1024, and 1440 for index, project, and empty state in
  `docs/website/evidence/<date>-wp05-work/`. No horizontal overflow (masked or real) in
  the probe.
- **AC-8** No raw color literals added to component CSS. Only DESIGN.md tokens added.
- **AC-9** `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e`,
  and `pnpm test:e2e:built` pass. Existing pages are visually unchanged (compare WP-01
  baseline screenshots for `/` and `/about`).

## Verification

```bash
pnpm content:check
pnpm test && pnpm lint && pnpm typecheck
pnpm dev   # manual pass at http://localhost:5173/work and each fixture page
pnpm test:e2e
CONTENT_FIXTURES=1 pnpm build && pnpm test:e2e:built   # fixture build: AC-5
pnpm build && pnpm test:e2e:built                      # production build: AC-4
ls build/client/work
graphify update .
```

## Exclusions

No homepage section or nav/footer links (WP-08). No JSON-LD, OG images, sitemap, or
RSS (WP-07); `pageMeta` title, description, and canonical only. No filters (D-012). No
changes to existing routes or components except shared, additive tokens. No real
customer content.

## Prompt

```text
Continue the Bit & Byte Ideas website extension. Read CLAUDE.md, then
docs/website/README.md, docs/website/MANIFEST.yaml, and docs/website/HANDOFF.md; check
git branch/status and reconcile the docs with the repository. Then complete WP-05 using
docs/website/tasks/WP-05-work-gallery.md. Follow docs/website/DESIGN.md (use
frontend-design, ui-ux-pro-max, and impeccable as described there; extend the existing
tokens and patterns, don't restyle existing sections). Set WP-05 to in_progress before
editing code, checkpoint the manifest, VALIDATION.md, and HANDOFF.md after each
milestone, save screenshots under docs/website/evidence/, and mark it done only when
every acceptance criterion passes. Do not commit, push, or deploy unless I ask.
```
