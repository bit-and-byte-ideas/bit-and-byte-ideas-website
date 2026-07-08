# SEO Action Items

Audit date: 2026-05-23 | Overall health score: **47 / 100**

Each file below is a self-contained action item with a definition of done.
Items are ordered by priority. Work through Critical → High → Medium → Low.

## Critical

| File                                                                         | Issue                                             | Done? |
| ---------------------------------------------------------------------------- | ------------------------------------------------- | ----- |
| [C1-content-depth-and-social-proof.md](C1-content-depth-and-social-proof.md) | Single 350-word page, zero portfolio/testimonials | [ ]   |
| [C2-h1-keyword-targeting.md](C2-h1-keyword-targeting.md)                     | H1 contains no search keywords                    | [x]   |
| [C3-llms-txt.md](C3-llms-txt.md)                                             | No llms.txt — invisible to AI search engines      | [x]   |
| [C4-lcp-image-optimization.md](C4-lcp-image-optimization.md)                 | Hero image 153 KB PNG, no fetchpriority, no WebP  | [x]   |

## High

| File                                                                   | Issue                                                                  | Done? |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----- |
| [H1-staticwebapp-config.md](H1-staticwebapp-config.md)                 | No staticwebapp.config.json — missing security headers + apex redirect | [x]   |
| [H2-sitemap-lastmod.md](H2-sitemap-lastmod.md)                         | Sitemap lastmod is a future date                                       | [x]   |
| [H3-schema-markup.md](H3-schema-markup.md)                             | Schema incomplete — no Organization/WebSite, broken serviceType        | [x]   |
| [H4-calendly-css-async.md](H4-calendly-css-async.md)                   | Calendly CSS is render-blocking                                        | n/a   |
| [H5-geographic-targeting.md](H5-geographic-targeting.md)               | No location anywhere on site or in metadata                            | [x]   |
| [H6-indexnow-sitemap-submission.md](H6-indexnow-sitemap-submission.md) | No IndexNow, no GSC sitemap ping on deploy                             | [ ]   |
| [H7-robots-txt-ai-crawlers.md](H7-robots-txt-ai-crawlers.md)           | robots.txt doesn't name AI crawlers explicitly                         | [x]   |

## Medium

| File                                                           | Issue                                                        | Done? |
| -------------------------------------------------------------- | ------------------------------------------------------------ | ----- |
| [M1-pricing-anchors.md](M1-pricing-anchors.md)                 | No pricing on any service card                               | n/a   |
| [M2-faq-section.md](M2-faq-section.md)                         | No FAQ section or FAQPage schema                             | [x]   |
| [M3-og-share-image.md](M3-og-share-image.md)                   | og:image points to logo, not a dedicated social card         | [ ]   |
| [M4-missing-meta-tags.md](M4-missing-meta-tags.md)             | Missing og:locale, og:image dimensions, twitter:site         | [x]   |
| [M5-cta-standardization.md](M5-cta-standardization.md)         | Five different CTA labels for the same action                | [x]   |
| [M6-schema-same-as.md](M6-schema-same-as.md)                   | sameAs array in schema is empty                              | [x]   |
| [M7-calendly-noscript.md](M7-calendly-noscript.md)             | No noscript fallback for Calendly embed                      | n/a   |
| [M8-404-route.md](M8-404-route.md)                             | No custom 404 route in Angular router                        | [x]   |
| [M9-image-lazy-loading-webp.md](M9-image-lazy-loading-webp.md) | Footer logo and below-fold images lack lazy loading and WebP | [x]   |

## Low

| File                                                             | Issue                                       | Done? |
| ---------------------------------------------------------------- | ------------------------------------------- | ----- |
| [L1-dmarc-reject.md](L1-dmarc-reject.md)                         | DMARC policy is quarantine, not reject      | [ ]   |
| [L2-theme-color-meta.md](L2-theme-color-meta.md)                 | Missing theme-color meta tag                | [x]   |
| [L3-robots-assets-disallow.md](L3-robots-assets-disallow.md)     | /assets/ directory wastes crawl budget      | n/a   |
| [L4-external-listings.md](L4-external-listings.md)               | Not listed on Clutch, GoodFirms, DesignRush | [ ]   |
| [L5-blog-and-content-cadence.md](L5-blog-and-content-cadence.md) | No blog or topical authority content        | [ ]   |
