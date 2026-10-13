# WP-10: Content readiness, release instructions, and final handoff

## Purpose and scope

Leave the project ready for review and release: a release checklist, a clear content
readiness report (what real content exists, what's missing), product docs updated to
match reality, and a final handoff. If Carlos has supplied real content by now, run it
through the workflow to the point of review. Agents never publish it themselves.

## Prerequisites

WP-09 done. Real content is optional for this package (see `content_readiness` in the
manifest).

## Read first

- `docs/website/CONTENT.md` (workflow, checklist), `docs/website/MANIFEST.yaml`
  `content_readiness`, `docs/website/VALIDATION.md`, `docs/website/AUDIT.md` K11, K12
- `.github/workflows/deploy-app-dev.yaml`, `deploy-app-prod.yaml`, `ci.yaml`,
  `docs/quality-operations.md` ("Deployment", "Rollback", "SEO Operations"),
  `PRODUCT.md`, `public/llms.txt`

## Relevant decisions

D-004 (confirm before first publish), D-008, D-009, D-013, D-019.

## Implementation areas

| Path | Deliverable |
| --- | --- |
| `docs/website/RELEASE.md` (new) | Release checklist: pre-merge gates (`pnpm lint`, `pnpm build`, `pnpm test`, `pnpm test:e2e`, `pnpm test:e2e:built`, `pnpm content:check`); PR; merge → dev deploy and what to check on the dev URL; GitHub release → production; post-release checks (sitemap, RSS, a project and an article URL, 404 status, mobile menu); rollback (re-publish previous release); unpublish-urgently procedure |
| `docs/website/README.md` | Add RELEASE.md to the index |
| `PRODUCT.md` | Only once real content is published: update "No blog currently" and "Evidence on Hand". Otherwise add nothing and leave K11 open |
| `public/llms.txt` | Only once real content is published: add `/work` and `/blog` links |
| `docs/quality-operations.md`, `docs/architecture.md`, `docs/ux-content.md` | Short sections pointing to `docs/website/` for content routes and workflow |
| `docs/website/HANDOFF.md`, `MANIFEST.yaml`, `VALIDATION.md` | Final state; content readiness per item |
| PR description draft (in HANDOFF or evidence) | Summary of the change set for Carlos to use if he asks for a PR |

## Acceptance criteria

- **AC-1** `RELEASE.md` exists, uses only real commands and workflow names, and was
  walked through locally up to (not including) merge.
- **AC-2** `content_readiness` in the manifest lists each needed item with status
  `missing`, `supplied`, `in_review`, or `published`, matching the repo.
- **AC-3** If any real entry exists: `pnpm content:check` passes; it renders correctly
  in `pnpm dev`; its approvals are present or it stays `draft`; screenshots in evidence.
- **AC-4** All gates in RELEASE.md pass on the final tree.
- **AC-5** HANDOFF.md states branch, revision, every uncommitted file group (including
  Carlos's staged skills), what is done, what needs Carlos (content, approvals, Q3), and
  the exact next action.

## Verification

```bash
pnpm install
pnpm content:check
pnpm lint && pnpm typecheck && pnpm test
pnpm build && pnpm test:e2e && pnpm test:e2e:built
git status --short
```

## Exclusions

No merge, push, release, or deploy (Carlos does these, or asks explicitly). No writing
or publishing real articles or case studies without Carlos's material and review.

## Prompt

```text
Continue the Bit & Byte Ideas website extension. Read CLAUDE.md, then
docs/website/README.md, docs/website/MANIFEST.yaml, and docs/website/HANDOFF.md; check
git branch/status and reconcile the docs with the repository. Then complete WP-10 using
docs/website/tasks/WP-10-content-readiness-and-release.md. Do not publish content or
add review/publicApproval records yourself. Set WP-10 to in_progress before starting,
checkpoint after each milestone, and mark it done only when every acceptance criterion
passes. Do not commit, push, merge, release, or deploy unless I ask.
```
