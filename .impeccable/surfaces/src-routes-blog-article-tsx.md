---
version: 1
slug: "src-routes-blog-article-tsx"
primary_target: "src/routes/blog-article.tsx"
related_targets: ["src/routes/blog-index.tsx"]
---

## Scope and mode
/blog (index) and /blog/<slug> (article). Mode: Read. The visitor understands something; the page gets out of the way of the text.

## Audience and job
Small-business owners and technical founders reading a practical engineering note, judging whether the studio thinks clearly, then booking a call or getting in touch.

## Proof and constraints
Articles are Carlos's reviewed writing only (docs/website/CONTENT.md); agents write fixtures, never real articles. Pages must work without JavaScript (TOC is plain anchors, no scroll-spy, no copy button). CSP forbids inline styles and scripts, so syntax highlighting is class-based. Body text is --text at --text-prose on a --measure-prose column.

## Direction and memorable moment
"Engineering notebook": the prose column is the hero. The byline is a spec strip of `// label` terms under the dek (the same grammar as the project facts rail), code sits in --surface-code panels with a mono language tag, and the TOC is a quiet `// on this page` rail at >=1100px (collapsed disclosure above the body below that). The index is a ledger: one column of rows separated by hairlines, dates in a mono rail when there is room.

## Unresolved
Real articles (content_readiness in docs/website/MANIFEST.yaml). RSS, OG, JSON-LD, and sitemap entries arrive in WP-07.
