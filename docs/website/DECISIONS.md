# Decisions

Append-only. To change a decision, add a new entry that supersedes the old one and mark
the old one `Superseded by D-###`. "Accepted (default)" means made independently as a
reasonable, reversible default and open to Carlos's override (see BRIEF open questions).

---

## D-001: Documentation home and status authority (2026-10-12)

**Status:** Accepted
**Decision:** Project docs live in `docs/website/`. `MANIFEST.yaml` is the only place
task status is recorded; task documents hold requirements; `HANDOFF.md` holds session
state.
**Why:** `docs/` is the existing contributor-docs location (mkdocs/TechDocs). A
dedicated subfolder keeps this project separate from the general docs, which have
drift of their own (AUDIT K3).
**Consequences:** Every session updates the manifest. `docs/website/` is not yet in
`mkdocs.yml` nav (WP-11).

## D-002: Extend the committed design; use skills selectively (2026-10-12)

**Status:** Accepted
**Decision:** The baseline is the site at `4074b5e` ("Engineered Dark"). New pages
extend existing tokens and patterns. Design skills are applied per the table in
[DESIGN.md](DESIGN.md#design-skills-used-and-not-used); conflicting skill rules are
recorded there and not applied.
**Why:** The prompt requires preserving the brand. Several installed skills prescribe
different visual worlds or practices that conflict with the no-fabrication rule.
**Consequences:** Existing sections are not restyled. If retexture work exists outside
the repo (BRIEF Q1), reconcile before WP-05.

## D-003: Fix production hydration while keeping a strict script CSP (2026-10-12)

**Status:** Accepted (default). BRIEF Q2 offers the faster hotfix.
**Decision:** Keep `script-src 'self'`. Add a post-build step that moves React Router's
inline `<script>` blocks into external same-origin files with the same order and type,
and add an e2e suite that runs against the built output with the production headers.
**Why:** Production cannot hydrate today (AUDIT K1). Alternatives considered:
(a) restore `'unsafe-inline'`: one-line fix, but it reverts a security finding the
team acted on; (b) hash every inline script in the global header: there are about 3
unique hashes per page, so the header grows with every article; (c) per-page `<meta>`
CSP with hashes alongside a relaxed header: two interacting policies, harder to audit.
Externalizing keeps one simple policy and scales with page count.
**Consequences:** The transform depends on React Router's output shape, so the e2e
guard is mandatory and must run in CI. If the transform proves unreliable, fall back to
(a) as a recorded, temporary decision.

## D-004: URLs and labels (2026-10-12)

**Status:** Accepted (default; BRIEF Q3)
**Decision:** `/work`, `/work/<slug>`, `/blog`, `/blog/<slug>`, `/blog/rss.xml`. Nav
labels "Work" and "Blog". No trailing slash in canonical URLs.
**Why:** Short, plain-English, fits the mono nav, and covers client, internal, and
concept work without implying every entry is a paid client. All these paths return 404
on the live site today, so nothing collides.
**Consequences:** Must be confirmed before the first project is published; changing a
URL after publication needs redirects.

## D-005: Markdown + frontmatter in the repo, no CMS (2026-10-12)

**Status:** Accepted
**Decision:** Each project or article is a folder in `src/content/{work,blog}/<slug>/`
with `index.md` (YAML frontmatter + Markdown) and its images. No CMS, no MDX, no paid
service.
**Why:** A single author, PR-based review, a static host, and an existing "content in
`src/content/`" convention. MDX would allow executable JSX in content (R-X2). A CMS adds
a service, cost, and auth with no workflow benefit for one author.
**Consequences:** Publishing needs git, which matches how every content change ships
today. Revisit if non-developer editors join.

## D-006: Build-time validation with zod; invalid content fails the build (2026-10-12)

**Status:** Accepted
**Decision:** zod schemas validate frontmatter. Collection rules and body rules (see
ARCHITECTURE) run in loaders, in `pnpm content:check`, and in unit tests.
**Why:** zod 4 is already in the dependency tree (transitively), is well known, and
gives precise error paths. Hand-written validators would be more code for the same
result.
**Consequences:** zod becomes a direct devDependency. Schemas are code, but
`CONTENT.md` remains the human-readable contract.

## D-007: Render Markdown at build time to sanitized hast; render hast as React (2026-10-12)

**Status:** Accepted
**Decision:** Loaders run unified (remark → rehype) with raw HTML disabled, the
sanitizer on, and class-based highlighting. The client renders the hast with
`hast-util-to-jsx-runtime`, mapping elements to components. No
`dangerouslySetInnerHTML` for content.
**Why:** Keeps the parser and highlighter out of the client bundle (loaders run only at
build under `ssr: false`). Avoids injecting HTML strings. Enables image, code, and link
components. Class-based highlighting is required because `style-src 'self'` blocks
inline style attributes (which shiki emits by default).
**Consequences:** Page data carries a hast tree (budgeted in ARCHITECTURE). Only
registered languages are highlighted.

## D-008: Publication modes and fixtures (2026-10-12)

**Status:** Accepted
**Decision:** Production builds include only published, reviewed, approved, non-fixture
entries dated today or earlier. `pnpm dev` includes drafts and fixtures with visible
banners and `noindex`. `CONTENT_FIXTURES=1 pnpm build` adds fixtures (never drafts) for
build-output e2e. A post-build check fails production builds that contain draft or
fixture markers.
**Why:** Satisfies R-B6 and R-G9 with defense in depth: filter, banner, noindex, and an
output check.
**Consequences:** Deploy workflows must never set `CONTENT_FIXTURES`. Fixtures live in
`src/content/fixtures/` and carry `fixture: true` and "[Fixture]" in their titles.

## D-009: Approval records gate publication (2026-10-12)

**Status:** Accepted; its consequence is amended by D-025
**Decision:** Published entries require `review` (Carlos). Published client projects
also require `publicApproval` with a scope, and outcomes require evidence. Agents never
write these fields.
**Why:** Turns the "no unreviewed articles under my name" and "record whether customer
assets are approved" requirements into build-time checks rather than memory.
**Consequences:** A missing approval excludes the entry from production builds (with a
build warning) rather than shipping it.

## D-010: Committed, pre-generated responsive images; no iframes (2026-10-12)

**Status:** Accepted; refined by D-031 and D-032
**Decision:** Originals sit next to the content. `pnpm content:images` (sharp) generates
AVIF and WebP widths plus a 1200×630 OG JPEG into `public/media/` and records
dimensions and hashes in `src/content/media-manifest.json`, all committed. CI only
validates.
**Why:** Matches the repo's existing practice (committed WebP variants). Keeps native
image tooling out of CI and deploy builds. Outputs are reviewable in PRs. Iframes are
blocked by the CSP and would show unapproved, changing content.
**Consequences:** Authors must run the script after adding images; validation tells
them when they forget.

## D-011: Sitemap and RSS as prerendered resource routes (2026-10-12)

**Status:** Accepted (to be confirmed by WP-07 implementation)
**Decision:** `/sitemap.xml` and `/blog/rss.xml` are React Router resource routes fed
by the same content loader. `scripts/generate-sitemap.mjs` is removed from
`pnpm build` once the output for existing URLs is shown to be equivalent.
**Why:** One source of truth for what is public. Per-URL `lastmod`. Verified that
React Router 8.3 prerenders loader-only routes.
**Consequences:** If resource-route prerendering misbehaves, fall back to a Node
script that imports the same content modules (Node 24 can run TypeScript with type
stripping).

## D-012: No category filtering until the collection is large (2026-10-12)

**Status:** Accepted
**Decision:** No filter controls until there are ≥ 9 published projects. At that point,
use link-based filters (prerendered category pages or query links) that work without
JavaScript.
**Why:** The brief asks to avoid controls for a small collection. Client-side filtering
also breaks without hydration.

## D-013: Navigation and discovery follow published content (2026-10-12)

**Status:** Accepted
**Decision:** "Work" and "Blog" appear in the nav, footer, sitemap, and `llms.txt` only
when the collection has at least one published entry. `/work` and `/blog` are always
prerendered. When empty they show a deliberate empty state and `noindex`.
**Why:** A nav link to an empty page undercuts credibility. Direct visits still get an
honest page instead of a 404.
**Consequences:** The nav needs a build-time "has content" signal (WP-08 picks: a Vite
`define` constant computed by the same lister, or a root loader).

## D-014: Homepage placement of selected work (2026-10-12)

**Status:** Accepted
**Decision:** A "selected work" section between Services and Process shows up to 3
`featured` projects by rank and is omitted entirely when none are featured.
**Why:** Proof right after the offer, before the process explanation. Omitting it
avoids an empty section on the highest-traffic page.

## D-015: Work-package plan (2026-10-12)

**Status:** Accepted
**Decision:** The 7 suggested packages are refined into WP-01…WP-11 (see the manifest):
the CSP/hydration fix becomes its own early package, images split from the content
pipeline, discovery split from verification, and documentation hygiene becomes a
separate low-priority package.
**Why:** Each package fits one focused session and leaves the repo coherent.

## D-016: No tag pages, pagination, or search at launch (2026-10-12)

**Status:** Accepted
**Decision:** Tags are shown as plain text. Pagination is revisited above 20 articles.
No site search.
**Why:** Thin tag pages hurt more than they help with a handful of articles.

## D-017: No root DESIGN.md for now (2026-10-12)

**Status:** Accepted
**Decision:** The design record for this project is `docs/website/DESIGN.md`. No
root-level `DESIGN.md` is created.
**Why:** The prompt specifies `docs/website/`. Impeccable's loader looks for a root
`DESIGN.md` and will report it missing, which is acceptable. A root file would create a
second authority.
**Consequences:** WP-11 may add a root pointer if impeccable workflows need it.

## D-018: Leave unrelated stale docs for a dedicated package (2026-10-12)

**Status:** Accepted
**Decision:** This session only adds a pointer section to `CLAUDE.md` and `AGENTS.md`.
Stale references (AUDIT K3–K5) are fixed in WP-11, except the CSP paragraph, which WP-02
fixes with the code.
**Why:** The prompt forbids overwriting unrelated instructions, and doc fixes deserve
their own reviewable change.

## D-019: Branch and commits (2026-10-12)

**Status:** Accepted
**Decision:** Work continues on `site-improvements`. Agents do not commit, push, or
deploy unless Carlos asks. Each package should end in a state that could be committed
as one Conventional Commit.
**Consequences:** Uncommitted work accumulates across sessions. `HANDOFF.md` lists it
every time. The staged taste-skill install belongs to Carlos and must not be bundled
into a project commit without his say-so.

## D-020: Reading time (2026-10-12)

**Status:** Accepted
**Decision:** Words outside fenced code blocks ÷ 225, rounded up, minimum 1 minute.

## D-021: Related articles (2026-10-12)

**Status:** Accepted
**Decision:** Rank other published articles by number of shared tags (≥ 1 required),
then by newest `publishedOn`. Show up to 3. Omit the section if none qualify.

## D-022: Table of contents (2026-10-12)

**Status:** Accepted
**Decision:** `toc: auto` shows a TOC when the article has ≥ 3 H2s; it lists H2 and H3
items. Plain anchor links, no scroll-spy.
**Why:** Must work without JavaScript (ARCHITECTURE constraints).

## D-023: Design baseline confirmed; skills guide new surfaces (2026-10-12)

**Status:** Accepted (Carlos, answering BRIEF Q1)
**Decision:** No retexture work exists outside the repo. "Retexture" meant
re-imagining the design with the installed skills. The committed site (`4074b5e`)
remains the baseline, and the skills are applied to the new surfaces per DESIGN.md.
**Consequences:** D-002 stands. Re-imagining existing sections (hero, services, process,
FAQ, contact, about) is still out of scope for this project. If Carlos wants that, it
becomes a separate work package with its own brief.

## D-024: WP-02 approach confirmed (2026-10-12)

**Status:** Accepted (Carlos, answering BRIEF Q2)
**Decision:** Fix production hydration under the unchanged CSP string by externalizing
the inline scripts (D-003). Relaxing the CSP still needs Carlos's explicit approval.

## D-025: Missing approvals on a published entry are errors (2026-10-12)

**Status:** Accepted (WP-03). Amends D-009's consequence.
**Decision:** A published entry without `review` (and, for client projects, without
`publicApproval` with the needed scope) fails validation, and therefore `pnpm build`.
It is not silently excluded.
**Why:** CONTENT.md and WP-03 AC-2 treat these as required fields. A loud failure tells
Carlos exactly what is missing; a silent exclusion could look like a broken deploy.
Fixtures are exempt (D-029).

## D-026: Where validation runs (2026-10-12)

**Status:** Accepted (WP-03)
**Decision:** Validation runs in three places that already gate work: `pnpm test` (a
test validates every entry on disk), `pnpm build` (`scripts/verify-build-content.ts`
validates and then scans the output), and `pnpm content:check` for authors. No extra CI
step.
**Why:** Pre-commit hooks and CI already run `pnpm test` and `pnpm build`, so invalid
content cannot pass either without a new workflow step.

## D-027: TypeScript scripts run by Node type stripping (2026-10-12)

**Status:** Accepted (WP-03)
**Decision:** `scripts/content-check.ts` and `scripts/verify-build-content.ts` are
TypeScript run directly by Node 24 (`node scripts/x.ts`) and share code with the app.
Modules under `src/content/collections/` therefore import siblings with explicit `.ts`
extensions. `tsconfig.node.json` type-checks `scripts/**/*.ts`.
**Why:** One implementation of the rules for loaders, scripts, and tests, with no
compile step or extra dependency (`erasableSyntaxOnly` already guarantees the syntax
Node can strip).
**Consequences:** Code imported by scripts must avoid Vite-only features
(`import.meta.glob` lives only in `load.server.ts`).

## D-028: Markdown pipeline details (2026-10-12)

**Status:** Accepted (WP-03). Refines D-007.
**Decision:** Order is remark-rehype (raw HTML dropped) → rehype-sanitize (GitHub
schema, defaults) → our heading ids (github-slugger) → rehype-highlight (lowlight
`common` grammars, no auto-detection). Sanitizing before our own transforms means the
sanitizer never has to allow ids or highlight classes. Footnotes are rejected (they
need id-clobbering configuration we don't need). `http`, `hcl`, `dockerfile`, and
`text` render as plain text (no grammar in `common`), which avoids adding `lowlight`
as a direct dependency. `mdast-util-to-string` was not needed and was not added.

## D-029: Fixture conventions (2026-10-12)

**Status:** Accepted (WP-03)
**Decision:** Fixtures live in `src/content/fixtures/`, require `fixture: true` and a
`[Fixture]` title prefix, use invented industries, are exempt from approval records, use
`featured` ranks 101+, and reference the real author key (the byline renders only in
dev and fixture builds, beside a fixture banner). Their images are generated
placeholder panels (`pnpm content:fixture-images`), never real screenshots.

## D-030: The repository is public: unapproved client material stays uncommitted (2026-10-12)

**Status:** Accepted (WP-04)
**Decision:** `bit-and-byte-ideas/bit-and-byte-ideas-website` is public (GitHub API,
2026-10-12). Builds exclude drafts, but git history does not. Client screenshots,
their generated variants, and client-identifying drafts are committed only after the
client's approval is recorded; until then they stay local and uncommitted. CONTENT.md
ground rules and `pnpm content:capture` both say so.
**Why:** Filtering at build time can't protect material that is already public in the
repository.
**Consequences:** Real client case studies are drafted locally and committed in the same
change that adds `publicApproval`. If Carlos prefers committed drafts, the alternative
is a private content repository, which is a larger change for later.

## D-031: Builds ship only the media of included entries (2026-10-12)

**Status:** Accepted (WP-04). Refines D-010.
**Decision:** Variants live in `public/media/`, which Vite copies into every build.
`scripts/prune-build-media.ts` (after `react-router build`) deletes
`build/client/media/<collection>/<slug>/` for every entry the build does not include, and
`scripts/verify-build-content.ts` fails if any such folder remains.
**Why:** Without it, every production deploy would serve fixture placeholders and
drafts' screenshots at guessable URLs.

## D-032: Image pipeline details (2026-10-12)

**Status:** Accepted (WP-04). Refines D-010.
**Decision:**
- Variant file names carry the first 8 hex chars of the source hash, so a changed image
  gets a new URL and stale files are removed on regeneration.
- The manifest records a settings fingerprint; changing widths or quality regenerates
  everything.
- The generator and capture helper are TypeScript run by Node (D-027):
  `scripts/content-images.ts` and `scripts/content-capture.ts`, not `.mjs` as first
  planned, so they share the manifest model with the app.
- `sharp` is loaded only when something must be generated. `pnpm build`, `pnpm test`,
  and `pnpm content:check` never load it: tests read dimensions with a header parser
  (`image-dimensions.ts`). The type-check reads `sharp`'s declarations because
  `scripts/content-images.ts` is type-checked, so the package must be installed (it is a
  devDependency), but its native binary is not needed.
- Encoders: AVIF q60 with 4:4:4 chroma (keeps screenshot text crisp), WebP q82, OG JPEG
  q82 mozjpeg, 1200×630 top-anchored.

## D-033: Serve prerendered `.data` files as `text/x-script` (2026-10-12)

**Status:** Accepted (WP-05). Needs confirmation on the dev environment (WP-10).
**Decision:** `public/staticwebapp.config.json` gains `"mimeTypes": { ".data": "text/x-script" }`
(the CSP string is unchanged). `scripts/serve-built.mjs` honors the same setting.
**Why:** Client navigation to a content page fetches its prerendered `<path>.data`.
Azure's docs list `mimeTypes` as supported but don't say how an unrecognized extension
is served. `text/x-script` is what React Router's own server sends. The React Router
client ignores the content type, so the setting only removes a hosting risk.

## D-034: One static route per entry instead of a `:slug` route (2026-10-12)

**Status:** Accepted (WP-05). Resolves AUDIT K14. Supersedes the `work/:slug` and
`blog/:slug` routes sketched in ARCHITECTURE.md.
**Decision:** `src/routes.ts` registers `route('work/<slug>', 'routes/work-project.tsx', { id })`
for each project included in the current mode (`listContentPaths`), all served by the
same module, which reads the slug from the request URL (stripping `.data`). Prerender is
just `getStaticPaths()` plus `/404`. WP-06 does the same for articles.
**Why:** Under `ssr: false`, Azure's 404 rewrite serves the prerendered `/404` page for
an unknown slug. With a `:slug` route, the client matched that URL to a route whose data
the page didn't carry and failed hydration with "No result found for routeId", showing
"Something went wrong" instead of the branded 404 (reproduced in dev and in the built
site). With static routes, an unknown slug matches `*` everywhere. It also keeps
production builds valid with zero entries: a route with a loader must be prerendered
for at least one path, and now no detail route exists until an entry does.
**Consequences:** The route manifest grows by one small entry per included page.
`routes.ts` and the loaders use the same mode (`contentMode`: development in
`react-router dev`, production or fixtures in `react-router build`).


## D-035: A Markdown image title is the figure caption (2026-10-12)

**Status:** Accepted (WP-06). Extends the body rules in CONTENT.md.
**Decision:** In entry bodies, `![alt](./images/name.png "Caption")` renders a
`<figure>` with `<figcaption>Caption</figcaption>`; without a title there is no caption.
Alt text still describes the image; the caption adds context and is visible text.
**Why:** DESIGN.md asks for figures with captions, and the content contract had no way to
write one. The title is standard Markdown, survives the sanitizer, and needs no new syntax.
**Consequences:** Authors must not repeat the alt text in the caption (screen readers
would hear it twice). Validation does not require captions.

## D-036: The article TOC is one nav with two presentations (2026-10-12)

**Status:** Accepted (WP-06). Implements D-022 and the DESIGN.md article layout.
**Decision:** `TableOfContents` renders one `<nav aria-label="On this page">` holding a
collapsed `<details>` list (below 1100px) and an open list for the sticky left rail
(1100px and up). CSS sets the other to `display: none`, so assistive technology meets
exactly one list at any width.
**Why:** The layout calls for a collapsed-by-default TOC on small screens and an open rail
on desktop, without JavaScript. A closed `<details>` can't be opened by CSS reliably
(`::details-content` is recent, and the summary would still announce "collapsed").
**Consequences:** The links appear twice in the HTML (a few hundred bytes). Component
tests see both copies; browser tests see only the visible one.
