# Design

Last updated: 2026-10-12. Baseline facts are in [AUDIT.md → Design baseline](AUDIT.md#design-baseline).
This file holds the rules for new work and the planned extensions.

## Precedence

When guidance conflicts, the higher item wins:

1. Carlos's explicit requirements ([BRIEF.md](BRIEF.md)) and product truth (`/PRODUCT.md`).
2. The established brand: `src/design/tokens.css`, `src/design/base.css`, existing
   component patterns, copy voice, and the two CTA labels.
3. Accessibility (BRIEF R-X5) and the strict CSP (no inline `style` attributes, no inline
   scripts, self-hosted assets only).
4. React Router static-prerender realities (pages must be complete without JavaScript).
5. Design skills, used selectively as described below.

## Established rules (apply to all new UI)

- **Tokens only.** Colors, type sizes, spacing, radii, motion, and z-index come from
  `tokens.css`. New values become new tokens. Never add raw hex or `rgba()` to component
  CSS; add a named alpha token instead (AUDIT K9 is existing debt; don't add to it).
- **Type roles.** Bricolage Grotesque for headings (700–800, negative tracking,
  `text-wrap: balance`); Public Sans for reading text; IBM Plex Mono for labels, metadata,
  buttons, nav, dates, tags, and code. Body text never smaller than 16px.
- **System labels.** Section eyebrows use `.section-label` (renders `// label` in
  lowercase mono). Numbered markers (`01`) appear only where the order is real.
- **Color use.** Green marks action and emphasis (CTAs, `<em>` in titles, focus ring,
  active nav). Blue and the gradient are atmosphere only. Muted text uses `--text-muted`;
  `--text-faint` is for `aria-hidden` ornament only.
- **Surfaces.** `--surface` cards with a 1px `--border`, 4px radius, hover to
  `--border-accent`. Optional `translateY(-4px)` lift on hover, which the global
  reduced-motion rule neutralizes.
- **One theme.** Every section is dark. No light "paper" sections, including the blog.
- **CTAs.** Only "Book a Call" (primary, Calendly, new tab with a visually hidden
  "(opens in new tab)") and "Get in Touch" (secondary, `/#contact`). No new CTA labels.
- **External links.** `target="_blank" rel="noopener noreferrer"` plus the sr-only cue and
  a `↗` glyph marked `aria-hidden`.
- **Copy lives in `src/content/`.** UI strings for new pages go in content modules, not
  in components.
- **Motion.** CSS only, transform and opacity only, 150–400ms with `--ease-out`, gated
  by `prefers-reduced-motion`. Reuse the `section-rise` scroll-driven entrance in
  `base.css`. No animation libraries.
- **Images.** Explicit `width`/`height`, `<picture>` with AVIF and WebP, `loading="lazy"`
  below the fold, eager plus `fetchpriority="high"` for the one above-the-fold image.

## Reusable primitives today

| Primitive | Defined in | Reuse for |
| --- | --- | --- |
| `.container`, `section` padding, `section[id]` scroll margin | `base.css` | All new pages |
| `.section-header`, `.section-label`, `.section-title` (+ `em`) | `base.css` | Index headers, homepage work section |
| `.btn`, `.btn-primary`, `.btn-ghost`, `.cta-actions` | `base.css` | CTA bands, empty states |
| `.sr-only`, `.skip-link`, focus ring | `base.css` | Everywhere |
| Page hero pattern (`.atmosphere`, `.hero-label`, `.label-dot`, display headline) | `hero.css`, duplicated in `about.css` | New `PageHeader` (below), without editing either file |
| Card pattern (`.service-card`, `.client-card`) | `services.css`, `about.css` | New project and article cards follow the same surface rules |
| CTA band (`.about-cta`) | `about.css` | New shared `CtaBand` with the same look |
| `<details>` disclosure | `faq.css` | Not needed for this project |

Rule: new shared primitives go in new files (`src/components/<name>.tsx` + `.css`).
Existing sections are not refactored to use them; that would redesign unrelated areas.

## Design skills: used and not used

Skills are inputs, not authorities.

| Skill | Use | How |
| --- | --- | --- |
| `frontend-design` + `ui-ux-pro-max` | **Use** (mandated by `CLAUDE.md`) | Shape each new surface; ui-ux-pro-max QC gates (contrast, targets, CLS, reduced motion) |
| `impeccable` | **Use** | Uses the existing `PRODUCT.md`. Surface modes: **Experience** for project pages, **Read** for the blog, **Persuade** for the homepage work section. `critique` and `audit` in WP-09. Run its `context.mjs` per its SKILL.md; it will report no root `DESIGN.md` (D-017) |
| `design-taste-frontend` (v2) | **Use selectively** | §0 design read, §11 Redesign-Preserve protocol, §4.9 copy self-audit and no fake-precise numbers, §4.10 quote rules (only for real, approved quotes), the ban on div-built fake screenshots, §4.11 theme lock, §6 guardrails |
| `redesign-existing-projects` | **Use selectively** | Audit checklist items: empty states, active nav indication, 65ch measure, bottom-aligned card CTAs, no dead links |
| `emil-design-eng` | **Use selectively** | Hover/press polish on new cards and links (specific transition properties, `:active` feedback) |
| `design-taste-frontend-v1` | Do not use | Superseded by v2; stacking both conflicts |
| `gpt-taste` | Do not use | Requires GSAP, randomized layouts, and heavy motion; adds a dependency and conflicts with the restrained motion brief |
| `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui` | Do not use | Each defines a different visual world (soft agency, warm light monochrome, brutalist terminal) |
| `stitch-design-taste` | Do not use | Generates DESIGN.md files for Google Stitch, which this project does not use |
| `brandkit` | Do not use | The brand is fixed (logo and palette changes are out of scope) |
| `imagegen-frontend-web`, `imagegen-frontend-mobile`, `image-to-code` | Do not use | Generated imagery would fabricate screenshots. `image-to-code` only if Carlos supplies a mockup |
| `pick-ui-library` | Do not use | Native CSS + tokens is the decided approach; no component library |
| `full-output-enforcement` | Neutral | Output behavior, not a design input |

### Taste-skill rules deliberately not applied

These conflict with the incumbent brand, which wins (precedence 2):

- **Em-dash ban.** Existing copy uses em-dashes, and the voice is preserved. New UI chrome
  strings (labels, buttons) may avoid them; existing copy is not rewritten.
- **Bans on section-number eyebrows and `//` labels.** `// label` and `01` markers are the
  brand's system-label voice.
- **Ban on status dots.** The pulsing availability dot carries real state and stays.
- **Placeholder, stock, or generated imagery** (picsum, Unsplash, image generation).
  Forbidden here: authentic screenshots only (D-010).
- **"Randomize blog dates to look real"** (`redesign-existing-projects`). Forbidden
  fabrication.
- **"Swap icon library to Phosphor/Tabler".** No icon dependency; keep the existing
  inline-SVG and glyph (`→`, `↗`) approach.
- **"Single accent color".** The brand is green with blue atmosphere.
- **Bans on scroll cues, glows, and 3-equal-card rows** for existing sections. Existing
  hero, logo, and services are out of scope. New layouts still avoid defaulting to three
  identical cards (see layouts below).

### Dials for new surfaces (design-taste-frontend §1)

Matched to the existing site (Redesign-Preserve): `DESIGN_VARIANCE 6`,
`MOTION_INTENSITY 3`, `VISUAL_DENSITY 4`. Blog article pages: `5 / 2 / 3`.

## Planned extensions

### Tokens (planned and added)

| Token | Purpose | Starting value |
| --- | --- | --- |
| `--measure-prose` | Long-form line length (**added WP-05**) | `68ch` |
| `--text-prose` | Long-form body size (**added WP-05**) | `1.0625rem` (17px) |
| `--leading-prose` | Long-form line height (**added WP-05**) | `1.7` |
| `--text-3xl` | Content page H1 (/work, project pages; /blog next) (**added WP-05**, not in the original plan: between `--text-2xl` and the hero display) | `clamp(2.25rem, 5vw, 3.75rem)` |
| `--frame-ratio` | Screenshot card crop (**added in WP-04**) | `16 / 10` |
| `--bg-translucent` | Existing nav/sticky backdrops (for new sticky elements) | `rgba(15, 23, 42, 0.92)` |
| `--accent-tint` | Hover tint stronger than `--accent-dim` | `rgba(34, 197, 94, 0.14)` |
| `--surface-code` | Code block background (**added WP-06**) | `#131c31`, between `--bg` and `--surface-2` |
| `--syntax-keyword`, `--syntax-string`, `--syntax-number`, `--syntax-comment`, `--syntax-title`, `--syntax-punctuation` | Class-based highlighting (D-007) (**added WP-06**) | blue-300 `#93c5fd`, green-300 `#86efac`, **cyan-300 `#67e8f9`** (not `--soft-green` as planned: it was too close to the string green to tell numbers from strings), `--text-muted`, `--text`, `--text-muted`. Lowest is 6.61:1 on `--surface-code` (`evidence/2026-10-12-wp06-blog/syntax-contrast.txt`) |

### New components

All presentational. Data comes in as props from route loaders.

| Component | Used by | Notes |
| --- | --- | --- |
| `PageHeader` | `/work`, `/blog`, project, article | **Built (WP-05)**: optional `// label` kicker, H1 at `--text-3xl` with an accent word, dek, a `before` slot (back link, badges, status banner), and the same gradient glow as the heroes, masked so it fades instead of being clipped |
| `KindBadge` | Project cards and pages | **Built (WP-05)**: mono tag with text label; client = accent on `--accent-dim`, internal = `--text` on `--surface`, concept = muted text in a dashed accent outline (provisional) |
| `ResponsiveImage` | Everywhere images appear | **Built (WP-04)**, `src/components/responsive-image.tsx`. `<picture>`: AVIF then WebP `srcset` with `sizes`, WebP fallback, `width`/`height` from the manifest, required `alt` (type-enforced), `priority` for the one LCP image |
| `ScreenshotFrame` | Project cards and pages | **Built (WP-04)**, `src/components/screenshot-frame.tsx`. `<figure>` with a `--surface` matte (8px padding), 1px `--border`, 4px radius (2px on the image so corners nest), the `/connect` card's 16px `--border-accent` registration marks on the top-left and bottom-right corners, `crop` (`--frame-ratio`, top-anchored) or `natural` mode, optional mono caption. No fake browser chrome. Preview: `docs/website/evidence/2026-10-12-wp04-images/frames-*.png` |
| `ProjectCard` | `/work`, homepage | **Built (WP-05) as `ProjectRow`**: cover in a crop `ScreenshotFrame` (7fr) beside badge, H2 title link, summary, industry · category, and a cue (5fr) at ≥ 900px; stacked below. The title link stretches over the whole row (one target, one accessible name); focus ring on the stretched area; hover tints the frame border and nudges the cue arrow |
| `ProjectMeta` | Project page | **Built (WP-05)**: `<aside>` with a `<dl>` of `// label` terms; sticky facts rail at ≥ 1024px, first in reading order everywhere |
| `CaseStudy` | Project page | **Built (WP-05)**: `ContentBody` (shared Markdown renderer, prose styles) plus an Outcomes panel (`--surface`, 1px accent border, arrow markers like the service cards) only when outcomes exist |
| `CtaBand` | Project page, article page, empty states | **Built (WP-05)**: same look as `.about-cta`; existing two CTA labels only |
| `ArticleCard` | `/blog`, related articles | **Built (WP-06)**: ledger row with a hairline above; title link (H2 on /blog, H3 under related) stretched over the row, date and reading time, description, topics as text. A container query moves date and reading time into an 11rem mono rail when the list is ≥ 46rem wide |
| `ArticleMeta` | Article page | **Built (WP-06)**: a `<dl>` strip of `// label` terms under the dek (by, published, updated only when set, reading time, topics), the same grammar as `ProjectMeta`; two even columns on phones |
| `Prose` | Article body, case-study sections | **Built as `ContentBody`** (WP-05, extended in WP-06): one renderer for both collections; articles add `content-body--article` (larger heading scale) and `headingAnchors` |
| `CodeBlock` | Prose | **Built (WP-06)**: `--surface-code` panel, hairline border, a mono `// language` tag (aria-hidden) above `<pre tabindex="0" role="group" aria-label="Code example: <Language>">`; `role="group"` because `aria-label` isn't allowed on a plain `pre`. Horizontal scroll inside the panel; hljs classes mapped to the syntax tokens |
| `TableOfContents` | Long articles | **Built (WP-06)**: `<nav aria-label="On this page">`, H3s nested under their H2. Below 1100px a collapsed `<details>` styled like the FAQ rows; from 1100px an open sticky rail with an accent hairline (D-036). No scroll-spy |
| `RelatedArticles` | Article page | **Built (WP-06)**: H2 set as a `// label` (`.heading-label`), up to 3 `ArticleCard`s with H3 titles; renders nothing when none qualify |
| `EmptyState` | `/work`, `/blog` with no published entries | **Built (WP-05)**: an empty screenshot frame (dashed accent outline, 16:10 at desktop, registration marks) holding the honest message; followed by the `CtaBand` |
| `ContentStatusBanner` | Dev and fixture builds only | **Built (WP-05)**: banner (`role="note"`) on pages and a compact tag in lists, `data-content-status` draft/fixture |

### Layouts

Small collections read better as large rows than as a grid of three equal cards.

```text
/work (index)                              /work/<slug>
┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐
│ // work                              │   │ ← All work        [Client project]   │
│ H1 Selected Work                     │   │ H1 Project title                      │
│ dek (one sentence)                   │   │ summary                               │
├──────────────────────────────────────┤   │ ┌──────────── cover frame ─────────┐ │
│ ┌──── frame 7/12 ───┐  badge         │   │ └──────────────────────────────────┘ │
│ │ cover screenshot  │  H2 title      │   │ dl: industry · services · tech · live │
│ └───────────────────┘  summary       │   │ ## Problem / Constraints /            │
│                        industry      │   │    Approach / Solution (prose)        │
│ (next project row …)                 │   │ ## Outcomes (verified only)           │
├──────────────────────────────────────┤   │ gallery: desktop + mobile frames      │
│ CTA band                             │   │ next project →          CTA band      │
└──────────────────────────────────────┘   └──────────────────────────────────────┘
```

- **Rows:** ≥ 900px image 7 columns, text 5; stacked below. Same orientation for every
  row (no zig-zag), so a scanning eye always finds the text in the same place.
- **Homepage section:** placed between Services and Process (D-014), `// selected work`.
  One featured project renders as a full-width row; two or three render as a lead row
  plus a two-column pair. Ends with a "View all work" text link. Hidden when nothing is
  featured.
- **Blog index:** single column at `--measure-prose` width; each item has the title (H2),
  description, mono meta line (date · reading time), and tags. No images required.
- **Article:** header (label `// blog`, H1, description, `ArticleMeta`). At ≥ 1100px the
  TOC sits in a left rail (sticky, top offset 96px) and the prose column stays at
  `--measure-prose`. Below that, the TOC is a collapsed-by-default list above the body.
  The article ends with an author box (name, role, link to `/about`), related articles,
  and the CTA band.

### Long-form prose rules

- `--measure-prose` width, `--text-prose` size, `--leading-prose` line height, `--text`
  color for body (not muted).
- H2 `--text-2xl`, H3 `--text-xl`; generous space above headings (`--space-7`/`--space-6`),
  `scroll-margin-top: 96px` for anchors. Headings get an `id` and a hover-revealed `#`
  link (`aria-hidden` glyph, accessible name "Link to section …").
- Links are underlined (`text-underline-offset: 0.2em`), `--soft-green`, and never rely
  on color alone.
- Lists keep native markers in `--accent`. Blockquotes have a 2px `--border-accent` left
  rule. Images use `<figure>` and `<figcaption>`. Tables sit in a scroll container with
  `tabindex="0"` and a caption or `aria-label`.
- Inline code uses mono, `--surface-2` background, 0.9em. Code blocks follow `CodeBlock`.

### Navigation (proposed; implemented in WP-08)

| Location | Today | Proposed |
| --- | --- | --- |
| Desktop nav | Services · About · Get in Touch · **Book a Call** | Services · Work · Blog · About · Get in Touch · **Book a Call** |
| Mobile menu | Services · About · Get in Touch · Book a Call ↗ | Services · Work · Blog · About · Get in Touch · Book a Call ↗ |
| Footer | Services · About · Process · Contact · Book a Call ↗ | Services · Work · Blog · About · Process · Contact · Book a Call ↗ |

- Existing labels, hrefs, and the relative order of existing items are unchanged. "Work"
  and "Blog" only appear when their collection has a published entry (D-013).
- `NavLink` active state (`.nav-active`) applies on `/work/*` and `/blog/*`.
- Width risk: six items at the 900px breakpoint come to about 800px of content in an 804px
  container. WP-08 measures. If it overflows, raise the desktop breakpoint (BRIEF Q7);
  never drop or rename items.
- The mobile menu only works in production after WP-02 (AUDIT K1).

### Implementation notes (WP-05)

- Links that are `inline-flex` (back link, live link, next-project link) space their
  glyphs with `gap`, never with literal spaces: flex items drop leading and trailing
  whitespace (AUDIT K16 is the existing footer instance). Where an arrow must stay with
  the last word of a wrapping title, the link is `inline-block` with a non-breaking space.
- New entrance motion: `.project-row` joins the existing `section-rise` list in
  `base.css`; nothing else animates on entry.
- Surface brief for /work: `.impeccable/surfaces/src-routes-work-project-tsx.md`.

### Implementation notes (WP-06)

- Article header: the back link ("← All articles") replaces the `// blog` kicker the
  layout sketch shows, matching project pages: one wayfinding device, not two. The
  index keeps the `// blog` kicker.
- Heading scale: articles use H2 `--text-2xl` and H3 `--text-xl` as the prose rules say.
  Case studies keep the smaller WP-05 scale (`--text-xl`/`--text-lg`) and no permalinks:
  their four section names are fixed and short.
- Permalinks sit beside the heading, not inside it, so the heading's accessible name
  stays its text (`.prose-heading` wrapper; 44px target; revealed on hover or focus,
  always visible on touch screens).
- Blockquotes keep WP-05's 1px `--border-accent` rule rather than the 2px in the prose
  rules: the craft floor rejects colored side rules over 1px, and both collections should
  match.
- Tables: a hairline-bordered scroll container named after its columns
  ("Table: Element, Purpose"); headers in mono `// label` style.
- Author box: name, role, a one-line bio built only from facts on `/about`
  (`src/content/authors.ts`), and a "More about …" link. No headshot until Carlos
  supplies one (C-06).
- `.heading-label` (base.css) is a real heading styled as a `// label`, used by the
  author box and related articles. The back link's styles moved from `work-project.css`
  to `page-header.css` so every `before` slot gets them.
- Global `section { padding: 96px 0 }` applies to any new `<section>`; components that
  are sections inside a column (author box, related articles) reset it.
- Surface brief for /blog: `.impeccable/surfaces/src-routes-blog-article-tsx.md`.

### Responsive targets

Verify at 375, 768, 1024, and 1440 widths: no real or masked horizontal overflow, 44px
targets, images never upscaled past their source width, TOC rail only at ≥ 1100px.
