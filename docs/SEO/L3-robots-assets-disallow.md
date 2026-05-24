# L3 — Disallow /assets/ in robots.txt

**Priority:** Low | **Effort:** Low | **Category:** Technical SEO / Crawl Budget

## Problem

`public/robots.txt` allows all paths including `/assets/`. This means Googlebot and other crawlers will attempt to crawl and index raw image files (`BandBIdeas-Icon-small.png`, `bit_byte_ideas_full_logo.png`, etc.). For a new site with a limited crawl budget, spending crawl capacity on binary assets is wasteful.

## Why It Matters

- Crawl budget is finite — every request to `/assets/*.png` is a request not spent on indexable pages
- Raw image files do not provide indexable content and should not appear in SERPs
- Images can still be indexed via Google Images through the pages that reference them — blocking direct crawl of `/assets/` does not prevent image indexing

> **Note:** This is low priority because the current site has only one page and two images. As the site grows (portfolio images, team photos, blog images), managing crawl budget becomes more important.

## Fix

Add to `public/robots.txt` (after the H7 AI crawler rules are in place):

```
# Prevent crawling of raw asset files
User-agent: *
Disallow: /assets/
```

Or, more selectively, block only specific file types:

```
User-agent: *
Disallow: /*.ico$
Disallow: /*.png$
Disallow: /*.webp$
Disallow: /*.jpg$
Disallow: /*.jpeg$
```

The selective approach is safer — it blocks image file crawling without blocking any future directories under `/assets/` that might contain indexable content (e.g., if a downloadable PDF is added at `/assets/brochure.pdf`).

## Files to Change

| File                | Change                                                  |
| ------------------- | ------------------------------------------------------- |
| `public/robots.txt` | Add `Disallow` rules for `/assets/` or image file types |

## Coordinate With

- H7 (AI crawler rules) — implement as part of the same robots.txt update to minimize the number of changes to this file

## Definition of Done

- [ ] `Disallow` rules for assets are present in `robots.txt`
- [ ] Validate at https://www.bing.com/webmasters/robots-tester — rules work as expected
- [ ] Calendly widget and Google Fonts still load (they are external, not under `/assets/`)
- [ ] No pages or routes are accidentally blocked
