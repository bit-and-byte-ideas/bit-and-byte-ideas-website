# Brief

Last updated: 2026-10-12

## Goal

Extend the existing Bit & Byte Ideas marketing site with two content areas that build
credibility with prospective small and medium business customers:

1. **Work gallery**: honest, well-presented evidence of real work, with case studies that
   explain the problem, constraints, approach, solution, and verified outcomes.
2. **Technology blog**: practical articles on engineering decisions that demonstrate
   expertise and give search engines and AI assistants substantive pages to cite.

Both must lead naturally to the existing conversion paths: **Book a Call** (Calendly) and
**Get in Touch** (`/#contact`, email).

## Audience

- **Primary:** small business and local service owners evaluating a developer. Mostly
  non-technical; they judge by visible quality, relevance to their industry, and trust.
- **Secondary:** founders and teams with a codebase who need engineering help. They read
  the blog and case-study "Approach" sections to judge technical depth.
- **Machine readers:** search crawlers and AI assistants (the site already invests in
  `robots.txt`, `llms.txt`, and JSON-LD).

Product truth (services, voice, positioning, no-fabrication rule) lives in
[`/PRODUCT.md`](../../PRODUCT.md). This brief does not restate it.

## Requirements

IDs are referenced by task documents.

### Work gallery (R-G)

- **R-G1** Gallery index at `/work` and one prerendered page per published project at
  `/work/<slug>`.
- **R-G2** Homepage section featuring selected projects, ordered by an explicit
  `featured` rank, hidden when nothing is featured.
- **R-G3** Authentic screenshots only, served as optimized responsive images with
  meaningful alt text, explicit dimensions, and a consistent frame. No iframes by default.
- **R-G4** Each project shows title, summary, industry, category, services, technologies,
  and an optional live link.
- **R-G5** Case-study sections: problem, constraints, approach, solution, and outcomes.
  Outcomes appear only when verified.
- **R-G6** Visible distinction between client work, internal projects, and concept
  demonstrations.
- **R-G7** Every project page ends with a path to Book a Call / Get in Touch.
- **R-G8** Validated content model: stable slugs, publication status, featured order,
  image metadata, and a record of the customer's approval for public display.
- **R-G9** Development fixtures, clearly labeled and excluded from production builds.
- **R-G10** A deliberate public empty state when no project is published.
- **R-G11** Category filtering only once volume justifies it (threshold in
  [DECISIONS.md](DECISIONS.md) D-012).

### Technology blog (R-B)

- **R-B1** Blog index at `/blog` and one prerendered page per published article at
  `/blog/<slug>`.
- **R-B2** Title, description, author, published and updated dates, tags, and calculated
  reading time.
- **R-B3** Readable long-form typography: headings, lists, links, images, tables, and
  accessible code blocks.
- **R-B4** Table of contents for longer articles.
- **R-B5** Related articles when relevant published content exists.
- **R-B6** Draft and published states. Drafts are excluded from public routes, the
  sitemap, RSS, structured data, and production content payloads.
- **R-B7** RSS feed, sitemap inclusion, canonical URLs, social metadata, structured data.
- **R-B8** Real 404 behavior (status 404) for unknown or unpublished slugs.
- **R-B9** Article template and a short backlog of proposed topics. No invented personal
  experience, and nothing published under Carlos's name without his review.
- **R-B10** Simplest authoring workflow that fits the repo: validated Markdown plus
  metadata. No CMS or paid service without a recorded rationale.

### Cross-cutting (R-X)

- **R-X1** Add, preview, publish, update, and unpublish projects and articles without
  editing presentation components.
- **R-X2** Rendered content is safe: no raw HTML passthrough, no script execution from
  content, sanitized links.
- **R-X3** Preserve existing URLs, anchors (`#services`, `#process`, `#faq`, `#contact`),
  contact details, Calendly destination, CTA labels, and working functionality.
- **R-X4** Extend the existing design tokens and components; keep the "Engineered Dark"
  brand.
- **R-X5** Accessibility: keyboard operable, visible focus, semantic headings, 4.5:1 text
  contrast, reduced-motion respected, 44px touch targets.
- **R-X6** Performance: no layout shift from images, prerendered HTML usable without
  JavaScript, no heavy client libraries for content rendering.
- **R-X7** Review-ready and deployable through the existing release workflow. No
  production deploy as part of this project.

### Documentation (R-D)

- **R-D1** This documentation set, kept current by every session.
- **R-D2** Exact instructions for adding, previewing, publishing, updating, and
  unpublishing content ([CONTENT.md](CONTENT.md)).

## Out of scope

- Framework migration, backend services, CMS, paid services, databases.
- Comments, newsletter signup, site search, analytics, tag archive pages, pagination
  (until volume requires it), internationalization.
- Redesigning or rewriting existing sections (hero, trust strip, services, process, FAQ,
  contact, about, connect). Known issues found there are logged in
  [AUDIT.md](AUDIT.md#known-issues), not fixed, unless a work package says so.
- Testimonials, client logos, or metrics that have not been supplied and approved.
- Logo or palette changes. Backstage changes (`catalog-info.yaml` is untouched).
- Production deployment.

## Assumptions

Each is reversible and recorded so a later session can revisit it.

- **A1** URLs are `/work` and `/blog`; nav labels "Work" and "Blog" (D-004).
- **A2** No real projects or articles exist yet. Implementation is built and tested with
  labeled fixtures; real content arrives from Carlos (CONTENT.md checklist).
- **A3** Carlos is the only author. Articles are bylined and may use first person;
  marketing pages keep the studio "we" voice (PRODUCT.md).
- **A4** Publishing remains: merge to `main` (auto-deploys to the dev environment), then
  a GitHub release (deploys production). No new workflow is required for publishing.
- **A5** The visual baseline is the committed site at `4074b5e`. The taste-skills
  installed on 2026-10-12 are staged but have not changed any source file (AUDIT.md K13).
- **A6** Hosting stays on Azure Static Web Apps with a strict Content-Security-Policy.
- **A7** No analytics or event tracking exists, so no event names need preserving.
- **A8** English (en-US) only.

## Open questions

None block the next task. Defaults are in effect until answered. Q1 and Q2 were answered on 2026-10-12.

| ID | Question | Default in effect | Blocks |
| --- | --- | --- | --- |
| Q1 | Is there taste-skill "retexture" work outside this repo (another machine, branch, or stash)? | **Answered 2026-10-12:** no. "Retexture" meant re-imagining the design with the installed skills. `4074b5e` is the baseline (D-023). | Nothing |
| Q2 | CSP fix: keep strict CSP by externalizing React Router's inline scripts (default), or hotfix by restoring `'unsafe-inline'`? | **Answered 2026-10-12:** fix it, keeping the CSP string unchanged; ask before relaxing it (D-024). | Nothing |
| Q3 | `/work` + "Work", or `/portfolio` + "Portfolio"? | `/work` (D-004). | Must be settled before the first project is published |
| Q4 | Which real projects can be shown, their kind, and who approves each? | None published; fixtures only. | Content readiness, not implementation |
| Q5 | Is a founder headshot available for the author byline? | No photo; text byline linking to `/about`. | Nothing |
| Q6 | Should `/connect` (QR business card) link to Work or Blog? | No, keep it focused. | Nothing |
| Q7 | If six nav items do not fit at the 900px desktop breakpoint, may the breakpoint move up (labels unchanged)? | Yes, raise the breakpoint; never rename or drop existing labels. | WP-08 |
