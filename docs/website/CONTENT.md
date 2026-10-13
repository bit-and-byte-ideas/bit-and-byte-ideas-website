# Content

Last updated: 2026-10-12. The schemas below are the contract that WP-03 implements in
`src/content/collections/schema.ts`. If the implementation must deviate, update this file
and add a decision to [DECISIONS.md](DECISIONS.md) in the same change.

Ground rules (from `PRODUCT.md` and the brief):

- Never fabricate clients, screenshots, quotes, testimonials, outcomes, metrics, or
  personal experience.
- Nothing is published under Carlos's name until he has reviewed it (`review` record).
- No client material is published without the client's recorded approval
  (`publicApproval` record).
- **This repository is public.** Anything committed, including drafts and their
  screenshots, is visible on GitHub even though builds exclude drafts. Commit client
  screenshots and client-identifying drafts only after the client's approval is recorded;
  until then keep them local (uncommitted) (D-030).
- AI agents may draft content only when asked, always as `status: draft`, and must never
  write the `review` or `publicApproval` fields.

## Where content lives

```text
src/content/work/<slug>/index.md        one project (case study)
src/content/work/<slug>/images/         original screenshots (PNG/JPEG)
src/content/blog/<slug>/index.md        one article
src/content/blog/<slug>/images/         original article images
src/content/fixtures/{work,blog}/<slug>/ development fixtures (`fixture: true`)
public/media/{work,blog}/<slug>/         generated image variants (committed, never hand-edited)
src/content/media-manifest.json          generated image metadata (committed, never hand-edited)
```

The folder name is the slug. Slugs are lowercase kebab-case
(`^[a-z0-9]+(?:-[a-z0-9]+)*$`), at most 60 characters, unique within the collection, and
**permanent once published** (changing one requires a redirect; see Unpublish).

Templates: [`templates/project.md`](templates/project.md) and
[`templates/article.md`](templates/article.md).

## Schemas

Dates are ISO `YYYY-MM-DD`. "Published" means `status: published`.

### Project (`src/content/work/<slug>/index.md`)

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `title` | string | yes | ≤ 70 chars. Shown as the H1 |
| `summary` | string | yes | 50–160 chars. Card text and meta description |
| `kind` | `client` \| `internal` \| `concept` | yes | Rendered as "Client project", "Internal project", or "Concept". Concepts must not claim a customer or outcomes |
| `status` | `draft` \| `published` | yes | |
| `category` | `website` \| `web-application` \| `automation` \| `integration` | yes | Labels in `src/content/work-taxonomy.ts` |
| `services` | list of `build` \| `automate` \| `maintain` | yes, ≥ 1 | Map to the three service lines in `src/content/services.ts` |
| `industry` | string | yes | ≤ 40 chars, plain words ("Dental practice") |
| `technologies` | string list | yes, 1–10 | Display names ("React", "Go", "Azure Static Web Apps") |
| `completedOn` | `YYYY-MM` | yes when published | Not in the future |
| `updatedOn` | date | no | Substantive revisions only |
| `liveUrl` | `https://` URL | no | Client projects: only if `publicApproval.scope` includes `live-link` |
| `featured` | integer ≥ 1 | no | Homepage rank (1 first). Unique across the collection, fixtures included (fixtures use 101+). Omit to leave off the homepage |
| `client` | `{ name, anonymized }` | when `kind: client` (forbidden otherwise) | `name` is the display name, or a description if `anonymized: true` ("A San Diego dental practice"). Unless anonymized, `publicApproval.scope` must include `name` |
| `publicApproval` | object | when `kind: client` and published | `approvedBy` (person and role at the client), `approvedOn` (date), `scope` (list of `name`, `description`, `screenshots`, `live-link`, `outcomes`), `reference` (where the written approval is kept; never rendered) |
| `images` | list | ≥ 1 when published | Each: `file` (a `.png`/`.jpg` name in `images/`), `alt` (required, specific, 10–200 chars), `role` (`cover` \| `gallery`, exactly one `cover`), `viewport` (`desktop` \| `mobile`), `capturedOn` (date), optional `caption`. Client projects need `screenshots` in `publicApproval.scope` |
| `outcomes` | list | no | Each: `statement` (rendered) and `evidence` (required, never rendered: how it was verified). Forbidden for `concept`. Client projects need `outcomes` in `publicApproval.scope` |
| `review` | `{ approvedBy, approvedOn }` | when published | Carlos's editorial sign-off |
| `seo` | `{ title?, description? }` | no | Overrides (title ≤ 60, description ≤ 160) |
| `fixture` | `true` | only in `fixtures/` | Required there, forbidden elsewhere. Fixtures are exempt from `review` and `publicApproval`, and their titles start with `[Fixture]` |

**Body:** Markdown with exactly these H2 sections, in order: `## Problem`,
`## Constraints`, `## Approach`, `## Solution`. Outcomes come from frontmatter so each
one carries its evidence. Drafts may be incomplete; published entries may not contain
`TODO`.

### Article (`src/content/blog/<slug>/index.md`)

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `title` | string | yes | ≤ 80 chars. Shown as the H1 |
| `description` | string | yes | 50–160 chars. Dek, card text, meta and RSS description |
| `status` | `draft` \| `published` | yes | |
| `author` | key | yes | Must exist in `src/content/authors.ts` (`carlos-barajas`) |
| `publishedOn` | date | when published | Future dates are excluded from the build with a warning |
| `updatedOn` | date | no | ≥ `publishedOn`. Shown as "Updated" |
| `tags` | list of keys | yes, 1–4 | From `src/content/blog-tags.ts` |
| `toc` | `auto` \| `show` \| `hide` | no (default `auto`) | `auto` shows a TOC when the body has ≥ 3 H2s |
| `cover` | `{ file, alt }` | no | Used for `og:image` (otherwise the site default) |
| `review` | `{ approvedBy, approvedOn }` | when published | Carlos's sign-off on this version |
| `seo` | `{ title?, description? }` | no | Overrides |
| `fixture` | `true` | only in `fixtures/` | As above |

**Body (both collections):** Markdown (CommonMark + GitHub tables, strikethrough, task
lists, and autolinks). No H1; start at H2; don't skip levels. No raw HTML (including
comments) and no footnotes (link to sources inline). Images come from the entry's own
folder (`![alt](./images/name.png)`) with alt text of at least 10 characters; an optional
quoted title (`![alt](./images/name.png "Caption")`) becomes the visible caption (D-035). Every
fenced code block names a language (`ts`, `tsx`, `js`, `go`, `bash`, `json`, `yaml`,
`http`, `sql`, `css`, `hcl`, `dockerfile`, or `text`); `http`, `hcl`, `dockerfile`, and
`text` render without highlighting. Links must be `https:`, `http:`, `mailto:`,
site-relative (`/work`), or `#anchor`.

**Derived at build:** reading time (words outside code blocks ÷ 225, rounded up, at least
1 minute), table of contents (H2/H3), heading anchors, related articles (most shared
tags, then newest, up to 3).

### Validation notes

- Validation runs in `pnpm content:check`, in `pnpm test` (every real and fixture entry),
  and in `pnpm build` (its last step, `scripts/verify-build-content.ts`), so invalid
  content fails pre-commit hooks and CI. Messages name the file, line, field, and fix.
- A published entry without its approval records (`review`, plus `publicApproval` for
  client work) is an error, not a silent exclusion (D-025).
- There is no `slug` field: the folder name is the slug.
- Dates are compared with the build's UTC date. `completedOn`, `updatedOn`, and approval
  dates may not be in the future. An article whose `publishedOn` is in the future is
  valid but excluded from builds until that date (a warning is printed).
- Field-level errors are reported first; cross-field rules (for example "review is
  required when published") appear once the fields themselves are valid.

### Fixtures

Development fixtures live in `src/content/fixtures/{work,blog}/<slug>/`, carry
`fixture: true` and a `[Fixture]` title, use invented industries and text that describes
itself as test scaffolding, and are excluded from production builds (D-008, D-029). Their
images are generated placeholders: `pnpm content:fixture-images` writes any missing ones
(`--force` regenerates). Never use a real screenshot in a fixture.

### Controlled vocabularies

- `src/content/authors.ts`: `carlos-barajas` → name "Carlos Barajas", role "Founder &
  Engineer", URL `/about`. The bio comes from `src/content/about.ts`.
- `src/content/blog-tags.ts`, initial set: `react`, `typescript`, `go`, `api-design`,
  `automation`, `integrations`, `cloud`, `infrastructure-as-code`, `performance`,
  `accessibility`, `security`, `web-development`, `maintenance`, `small-business`,
  `engineering-decisions`. Add a tag by adding it here, never ad hoc.
- `src/content/work-taxonomy.ts`: category and service labels.

## Workflow

Pages marked *(page exists after WP-0x)* are built by that work package; every command
below already exists. If you change an image, re-run `pnpm content:images`:
`pnpm content:check` (and the build) fail with that hint when variants are missing or
stale.

### Add a project

1. **Approval first** (client work): get written permission and note who approved what
   (`name`, `description`, `screenshots`, `live-link`, `outcomes`) and where the record
   is kept.
2. Create `src/content/work/<slug>/` and copy [`templates/project.md`](templates/project.md)
   to `index.md`. Keep `status: draft`.
3. Add screenshots to `images/`: either originals supplied by the client, or
   `pnpm content:capture <url> work/<slug> <name>` (desktop 1440×900 @2x; add
   `--viewport mobile` for 390×844 @3x, `--full-page` for the whole page, `--force` to
   replace). Crop only. Redact personal data (names, emails, phone numbers, order
   details) with an opaque block, and don't retouch anything that changes what the site
   looks like. Covers should be at least 1600px wide.
4. Run `pnpm content:images` to generate the AVIF/WebP variants (and the share image for
   the cover) and update `src/content/media-manifest.json`. Commit both the variants in
   `public/media/` and the manifest; CI never generates images.
5. Fill in the frontmatter and the four sections. Run `pnpm content:check`.
6. Preview with `pnpm dev`, then open http://localhost:5173/work/<slug>. Drafts show a
   "Draft" banner; the list at http://localhost:5173/work shows a "Draft" tag.
7. Carlos reviews, then adds `review` (and `publicApproval` for client work), sets
   `status: published`, and optionally `featured`.
8. Run `pnpm lint`, `pnpm build`, `pnpm test`, and `pnpm test:e2e`, then open a PR.
   Merging to `main` deploys the dev site. Publishing a GitHub release deploys
   production (WP-10 has the release checklist).

### Add an article

1. Pick a topic (backlog below) and create `src/content/blog/<slug>/index.md` from
   [`templates/article.md`](templates/article.md) with `status: draft`.
2. Write it, or have an agent draft it from Carlos's notes. Mark every claim that
   needs Carlos's experience or confirmation with `TODO:`.
3. Add images to `images/` and run `pnpm content:images`.
4. Run `pnpm content:check`, then preview at http://localhost:5173/blog/<slug>
   *(page exists after WP-06)*.
5. Carlos removes every `TODO:`, adds `review`, sets `publishedOn` and
   `status: published`.
6. Same checks, PR, merge, and release as projects.

### Preview

- `pnpm dev` shows drafts and fixtures, with banners, at their real URLs.
- Production-like preview with production headers: `pnpm build && pnpm serve:built`
  then open http://127.0.0.1:4173. It shows only what production
  would.
- Drafts are never deployed anywhere: the dev environment is a public URL and uses
  production filtering.

### Update

Edit `index.md`. For substantive changes (facts, recommendations, code), set
`updatedOn` and get Carlos's fresh `review.approvedOn`. Typo fixes need neither. For new
or replaced images, re-run `pnpm content:images`. Never change a published slug in
place.

### Unpublish

- Temporary: set `status: draft` and remove `featured`. After the next release, the URL
  returns 404 and drops out of the sitemap, RSS, homepage, and related lists.
- Permanent: delete the folder, its `public/media/<collection>/<slug>/` variants, and
  its manifest entries (`pnpm content:images --prune`).
- If the page had inbound links, add a redirect to `routes` in
  `public/staticwebapp.config.json`, for example
  `{ "route": "/blog/old-slug", "redirect": "/blog", "statusCode": 301 }`.
- Client withdrew approval: unpublish immediately and cut a release. Remove the
  approval record's `reference` details from the repo if the client asks.

## Missing-asset checklist

Nothing below exists in the repository today. The implementation is tested with
fixtures; production pages stay in their empty state until these arrive.

### Per project (Carlos supplies)

- [ ] Project name or anonymized description, and `kind` (client / internal / concept)
- [ ] Client approval: who, when, scope, where the record is kept (client work only)
- [ ] Cover screenshot (desktop, ≥ 2400px wide), optional mobile screenshot, up to 4
      gallery screenshots, or the URL plus permission to capture
- [ ] Industry, category, services delivered, technologies, completion month
- [ ] Live URL (if approved)
- [ ] Notes for Problem / Constraints / Approach / Solution (bullet notes are fine; an
      agent can draft prose for review)
- [ ] Outcomes with evidence (optional; only verified results)
- [ ] Homepage feature rank (optional)

Candidate internal projects to confirm or reject (real, verifiable from this
organization's repositories; not drafted): this website's 2026 rebuild (Angular →
React static prerender, CSP and SEO work), and the infrastructure-as-code setup under
`deploy/infra/`.

### Per article (Carlos supplies)

- [ ] Topic choice and his own position, examples, and experience for it
- [ ] Code samples he stands behind (or approval of drafted ones)
- [ ] Final review and `publishedOn`

### Site level

- [ ] BRIEF Q3: confirm `/work` + "Work" (or choose `/portfolio`) before the first project
      is published
- [ ] BRIEF Q5: founder headshot for bylines (optional)
- [ ] Confirm the default share image (current logo PNG) is acceptable for articles
      without a cover
- [ ] Update `PRODUCT.md` "Evidence on Hand" and "No blog currently" once real content
      ships (WP-10)

## Topic backlog (proposed, not drafted)

Each needs Carlos's own experience and review. Nothing here may be published as-is.

| # | Working title | Audience | Angle | Tags | Carlos supplies |
| --- | --- | --- | --- | --- | --- |
| 1 | Website, web app, or just connected tools: how to tell what your business needs | Owners | Expands FAQ item 6 with concrete signals | `small-business`, `web-development`, `automation` | Real examples of each situation |
| 2 | Why every page on this site is prerendered | Technical | React Router static prerendering, what it buys a small business (speed, SEO, hosting cost), with this repo as the example | `react`, `performance` | Opinions and tradeoffs from the rebuild |
| 3 | A Content-Security-Policy that doesn't break hydration | Technical | The real K1 incident and fix from WP-02 | `security`, `react` | Approval to publish the incident |
| 4 | What a website maintenance plan should actually cover | Owners | Patches, backups, monitoring, and keeping automations alive | `maintenance`, `small-business` | What the subscription actually includes |
| 5 | Connecting the tools you already use: business automation in plain English | Owners | Categories, not brands (services-strategy decision 2) | `automation`, `integrations` | Example workflows he has built |
| 6 | Designing a small, boring HTTP API in Go | Technical | Conventions, errors, testing | `go`, `api-design` | Patterns he uses (go-api-scaffold practices) |
| 7 | Accessibility checks every small-business site should pass | Owners and devs | Keyboard, contrast, alt text, reduced motion, with how this site tests them | `accessibility`, `web-development` | Review of the checklist |
| 8 | Infrastructure as code for a one-person studio | Technical | OpenTofu + Azure Static Web Apps, dev/prod split, release-driven deploys | `infrastructure-as-code`, `cloud` | Lessons from running it |
| 9 | Node.js, NestJS, or Go for a client backend? | Technical / founders | Decision criteria, not a benchmark | `engineering-decisions`, `go`, `typescript` | His actual decision rules |
