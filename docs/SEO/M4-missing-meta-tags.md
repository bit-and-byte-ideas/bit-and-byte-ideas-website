# M4 — Add Missing Meta Tags

**Priority:** Medium | **Effort:** Low | **Category:** On-Page SEO

## Problem

Several standard meta tags are missing from `src/index.html`:

- `og:locale` — standard for English-language sites
- `og:image:width` and `og:image:height` — prevents layout shift in link previews
- `twitter:site` — associates the Twitter Card with a Twitter/X account
- `meta name="robots"` — currently defaults to indexable, but explicit declaration is best practice

## Why It Matters

- `og:locale` is read by Facebook, LinkedIn, and other platforms to determine language/region
- Without image dimensions, some platforms render link previews incorrectly or refuse to show the large card format
- `twitter:site` enables Twitter Card analytics and increases card trustworthiness
- An explicit robots meta tag prevents ambiguity with third-party crawlers that do not inherit defaults

## Tags to Add

Add to `src/index.html` inside `<head>`, near the existing OG/Twitter tags:

```html
<!-- Locale -->
<meta property="og:locale" content="en_US" />

<!-- OG image dimensions (update if og:image changes per M3) -->
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/jpeg" />

<!-- Twitter/X account (add once account exists) -->
<meta name="twitter:site" content="@bitandbyteideas" />

<!-- Explicit robots directive -->
<meta name="robots" content="index, follow" />
```

> `twitter:site` should use the actual Twitter/X handle. If no account exists yet, omit this tag until one is created rather than using a placeholder.

## Files to Change

| File             | Change                    |
| ---------------- | ------------------------- |
| `src/index.html` | Add the tags listed above |

## Definition of Done

- [ ] `og:locale` present with value `en_US`
- [ ] `og:image:width` and `og:image:height` present and match the actual image (coordinate with M3)
- [ ] `meta name="robots"` present with `index, follow`
- [ ] `twitter:site` added once a Twitter/X account exists
- [ ] `ng build` passes with no errors
- [ ] Validate OG tags at https://www.opengraph.xyz/
