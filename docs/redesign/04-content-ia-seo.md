# 04 — Content, Information Architecture & SEO Parity

**Status:** Accepted 2026-07-07 — no pricing anchors (M1 won't-do); FAQ drafted below

## Information architecture

| Route     | Purpose                                                              | Prerendered                                           |
| --------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| `/`       | Full journey: hero → trust → services → process → FAQ → contact      | Yes                                                   |
| `/about`  | E-E-A-T depth: who runs the studio, experience, how we work (SEO C1) | Yes                                                   |
| `*` (404) | Branded not-found with route back home (SEO M8)                      | Yes (`404.html`, wired in `staticwebapp.config.json`) |

Anchor navigation on `/` mirrors today's behavior (`#services`, `#process`, `#contact`),
with nav labels matching anchor headings (existing a11y expectation). "Book a call" is an
external Calendly link (the inline embed was dead code and is dropped — see 02).

## Content ownership (typed modules, one source of truth)

| Content                        | Module                         | Migrated from                  |
| ------------------------------ | ------------------------------ | ------------------------------ |
| Business contact, hours, links | `src/content/business-info.ts` | `business-info.service.ts`     |
| Service lines & outcomes       | `src/content/services.ts`      | `services.ts` component        |
| Process steps                  | `src/content/process.ts`       | `process` component            |
| Trust-strip stats              | `src/content/trust.ts`         | `trust-strip` component        |
| FAQ                            | `src/content/faq.ts`           | New copy (SEO M2, draft below) |
| About page copy                | `src/content/about.ts`         | `about` component              |
| Per-route meta, OG, JSON-LD    | `src/content/seo.ts`           | `index.html` head              |
| Calendly URL, GitHub, socials  | `src/content/site.ts`          | nav/footer components          |

Copy is extracted from the live Angular components **before** deletion (Phase 1 in 05) so
nothing is rewritten from memory.

## SEO checklist

**Correction (2026-07-07):** the `docs/SEO/` items are an open backlog — none are checked
off. So the bar is twofold: (a) don't regress what the Angular site actually ships today
(meta/OG/schema in `index.html`, robots.txt, sitemap.xml, prerendered HTML), and (b) use
the rebuild to implement the on-site backlog items cheaply while every page is being
rebuilt anyway.

### Parity with today's shipped SEO (must-have before cutover)

- Title, description, canonical, OG, Twitter card per route (today: `index.html` head)
- ProfessionalService JSON-LD (today's schema block)
- robots.txt, sitemap.xml, favicons carried through `public/`
- Prerendered HTML for `/` and `/about`

### Backlog items implemented during the rebuild

- H1 `staticwebapp.config.json` — security headers, apex redirect, 404 wiring
- H2 sitemap regenerated at build with real `lastmod`
- H3 / M6 JSON-LD upgrade: Organization + WebSite + sameAs, fixed serviceType, FAQPage
- H7 robots.txt: name AI crawlers explicitly
- C2 H1 keyword targeting per route
- C3 `llms.txt`
- C4 / M9 image optimization: WebP, explicit dimensions, `fetchpriority` on hero asset, lazy-load below fold
- M2 FAQ section + FAQPage schema (draft below)
- M4 meta gaps: `og:locale`, og:image dimensions, `twitter:site`; L2 `theme-color`
- M5 standardized CTA copy (single primary: "Book a call")
- M8 404 route
- H5 geographic targeting — resolved 2026-07-07: US-wide service, San Diego, CA home base
  (hero subheadline, footer line, schema PostalAddress, FAQ #7, llms.txt)

### Closed as won't-do / moot

- M1 pricing anchors — pricing is quoted per engagement (owner decision, 2026-07-07)
- H4 Calendly CSS async + M7 noscript — embed removed entirely (see 02)
- L3 robots.txt `/assets/` disallow — won't-do: Vite emits the JS/CSS bundles and fonts
  under `/assets/`, and Google must crawl them to render the page; blocking would hurt
  more than the crawl-budget saving is worth

### Deferred (not part of the rebuild)

- L1 DMARC reject, L4 external listings, L5 blog, H6 IndexNow automation (sitemap is
  re-submitted manually post-cutover)

### Verification method

1. Prerender smoke tests (02) grep `dist/**/*.html` for title/description/JSON-LD/H1.
2. Post-cutover: `/seo-page` audit of the production URL and comparison against the
   `docs/SEO/README.md` baseline; submit sitemap via IndexNow (H6).

## Copy improvements while we're in there

- Hero rewrite to lead with the client outcome ("a website that wins you customers")
  rather than the studio's self-description; keyword targeting per C2 stays.
- Services copy shifts from feature lists to outcome + deliverable framing (no pricing).
- `/about` keeps the C1 E-E-A-T depth but gets the Direction A visual treatment.

## FAQ draft (M2) — for your edit before Phase 4 ships

1. **How much does a website cost?** Every project is quoted individually after a free
   30-minute consultation — scope, integrations, and timeline drive the price, so we'd
   rather give you an accurate number than a misleading range. Maintenance + hosting is a
   flat monthly subscription.
2. **How long does it take to build a website?** A typical static marketing site ships in
   2–4 weeks from kickoff; web applications depend on scope and are estimated during the
   consultation, with progress you can see weekly.
3. **Do you use templates or page builders?** No — every site is custom-designed and
   hand-built for your brand, your customers, and Core Web Vitals performance.
4. **What happens after launch?** You own everything — code, content, and infrastructure.
   Most clients add the maintenance + hosting subscription: managed cloud hosting,
   security updates, backups, monitoring, and priority support for small changes.
5. **Can you take over an existing website or codebase?** Yes. We start with a technical
   review, give you an honest assessment of what's worth keeping, and take it from there.
6. **Do I need a web application or just a website?** If your customers only need to find
   and contact you, a fast static site is usually right. If they need to log in, submit
   data, or run a workflow, that's an application — the consultation sorts this out in
   the first ten minutes.
7. **Where are you located and who do you work with?** We're a software studio based in
   San Diego, California, working remotely with small and medium businesses across the
   United States. Response time is within one business day.

The FAQ shipped in Phase 4 (`src/content/faq.ts`) — edits there, not here; this draft is
kept as the decision record.

## Open items

None — H5 resolved 2026-07-07 (US-wide, San Diego home base).
