# WP-04: Image pipeline and responsive image components

## Purpose and scope

Turn original screenshots and article images into committed, optimized, correctly
sized variants. Record their metadata in a manifest the build validates. Provide the
`ResponsiveImage` and `ScreenshotFrame` components every content page will use.
Optionally provide a capture helper for consistent, authentic screenshots.

## Prerequisites

WP-03 done (schemas reference images, fixtures and placeholder images exist).

## Read first

- `docs/website/ARCHITECTURE.md` "Images", `docs/website/DECISIONS.md` D-010,
  `docs/website/CONTENT.md` (image fields, capture and redaction rules),
  `docs/website/DESIGN.md` (`ResponsiveImage`, `ScreenshotFrame`, `--frame-ratio`)
- `src/content/collections/schema.ts`, `src/content/collections/validate.server.ts`
  (`buildCollections` options and the image-existence check), `load.server.ts`,
  `fs-sources.ts`, `scripts/content-fixture-images.mjs` (from WP-03). Fixture
  placeholder PNGs already exist under `src/content/fixtures/*/*/images/`
- `pnpm-workspace.yaml` (`allowBuilds`), `src/design/tokens.css`,
  `src/components/hero.tsx` (existing image attribute conventions)

## Relevant decisions

D-010 (committed variants, no iframes), D-008 (fixtures), D-007 (image mapping in
rendered Markdown).

## Implementation areas

| Path | Deliverable |
| --- | --- |
| `package.json` | Dev dep `sharp`. Scripts `content:images` → `node scripts/content-images.ts` (flags `--prune`, `--check`, `--report`) and `content:capture` → `node scripts/content-capture.ts` |
| `scripts/content-images.ts` | For each `src/content/{work,blog,fixtures/*}/<slug>/images/*.{png,jpg,jpeg}`: AVIF and WebP at widths 480/800/1200/1600/2400 (≤ source width) into `public/media/<collection>/<slug>/`, plus `<name>-og.jpg` (1200×630, top crop) for covers. Write `src/content/media-manifest.json` (`width`, `height`, `variants[]`, `og`, `sourceHash`). Skip unchanged sources. `--prune` removes outputs with no source. Warn on sources > 3 MB or < 1600px wide (covers) |
| `scripts/content-capture.ts` | Playwright helper: `<url> <collection>/<slug> <name> [--viewport desktop\|mobile] [--full-page]`. Desktop 1440×900 @2x, mobile 390×844 @3x, reduced motion, waits for network idle. Prints a reminder that approval must be recorded first |
| `src/content/collections/validate.server.ts` | Extend `BuildOptions` with the media manifest and validate every referenced image against it (exists, hash matches) with a fix hint ("run pnpm content:images"); pass it from `load.server.ts`, `paths.ts`, and both scripts |
| `src/components/responsive-image.tsx` (+ `.css`, `.test.tsx`) | `<picture>`: AVIF and WebP `srcset`, `sizes` prop, `width`/`height` from the manifest, required `alt`, `priority` prop → `loading="eager"` + `fetchpriority="high"`, otherwise `loading="lazy"` + `decoding="async"` |
| `src/components/screenshot-frame.tsx` (+ `.css`, `.test.tsx`) | Hairline-border matte frame; `crop` mode uses `aspect-ratio: var(--frame-ratio)` + `object-fit: cover; object-position: top`; `natural` mode keeps intrinsic ratio. No fake browser chrome |
| `src/design/tokens.css` | Add `--frame-ratio` (DESIGN.md) |
| `public/media/**`, `src/content/media-manifest.json` | Generated for fixtures and committed |
| `.gitignore` | Unchanged unless a cache directory is introduced |

## Acceptance criteria

- **AC-1** `pnpm content:images` generates variants for every fixture image. A second
  run reports 0 changes and `git status` is unchanged.
- **AC-2** Every variant is ≤ source width; AVIF and WebP exist for each width; covers
  have a 1200×630 JPEG; manifest dimensions match the files (checked by a test).
- **AC-3** `pnpm content:check` fails with a fix hint when an image is referenced but
  missing from the manifest, or when a source changed after generation.
- **AC-4** `ResponsiveImage` tests: renders `<picture>` with both sources, `img` has
  `alt`, `width`, `height`, `sizes`, and the right loading attributes for `priority`
  true/false. A missing `alt` is a type error.
- **AC-5** `pnpm build` does not invoke `sharp` (CI stays free of image processing):
  confirmed by running the build with `sharp` unavailable or by inspecting the build
  script chain.
- **AC-6** A size report for the fixture outputs (bytes per width and format) is in
  `docs/website/evidence/<date>-wp04-images/`.
- **AC-7** `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and
  `pnpm test:e2e` pass. `pnpm audit` result recorded for `sharp`.

## Verification

```bash
pnpm install
pnpm content:images && pnpm content:images   # second run: no changes
git status --short public/media src/content/media-manifest.json
pnpm content:check
pnpm test
pnpm lint && pnpm typecheck && pnpm build
pnpm test:e2e
du -ah public/media | sort -h | tail -20
```

## Exclusions

No page layouts (WP-05/WP-06). No capture of any real customer site (only fixtures or
this site). No OG meta wiring (WP-07). No CDN or external image services.

## Prompt

```text
Continue the Bit & Byte Ideas website extension. Read CLAUDE.md, then
docs/website/README.md, docs/website/MANIFEST.yaml, and docs/website/HANDOFF.md; check
git branch/status and reconcile the docs with the repository. Then complete WP-04 using
docs/website/tasks/WP-04-image-pipeline.md. Set WP-04 to in_progress before editing
code, checkpoint the manifest, VALIDATION.md, and HANDOFF.md after each milestone, and
mark it done only when every acceptance criterion passes. Do not capture any real
customer website. Do not commit, push, or deploy unless I ask.
```
