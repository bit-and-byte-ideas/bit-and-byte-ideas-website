# M3 — Create a Dedicated OG Share Image

**Priority:** Medium | **Effort:** Medium | **Category:** On-Page SEO / Social

## Problem

`og:image` and `twitter:image` currently point to the full logo PNG:

```
https://www.bitandbyteideas.com/assets/bit_byte_ideas_full_logo.png
```

The logo was not designed for social sharing. It has unknown dimensions and is not optimized for the 1200×630px format required for correct rendering in link previews on LinkedIn, Slack, iMessage, Twitter/X, and Facebook. Incorrect dimensions result in cropped or blurry previews, reducing click-through rates from shared links.

## Why It Matters

- Link previews on social and messaging platforms are a significant traffic driver for shared content
- `summary_large_image` Twitter cards require minimum 600×314px and prefer 1200×630px
- LinkedIn and Facebook use 1200×630px and crop anything outside that ratio
- A professional-looking link preview increases trust when sharing the site URL

## Required Image Specification

| Property      | Value                                         |
| ------------- | --------------------------------------------- |
| Dimensions    | 1200 × 630 px                                 |
| Format        | JPEG (preferred for photos/composites) or PNG |
| File size     | Under 300 KB                                  |
| Aspect ratio  | 1.91:1                                        |
| File location | `public/assets/og-image.jpg`                  |

## Recommended Design

The OG image should convey the brand at a glance — it appears as a banner without any surrounding page context.

Suggested layout:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   [Logo]                                        │
│                                                 │
│   Bit & Byte Ideas                              │
│   Custom Web Design & App Development           │
│   for Small Businesses                          │
│                                                 │
│   bitandbyteideas.com                          │
│                                                 │
└─────────────────────────────────────────────────┘
```

Background: use the brand dark color (`#111827` or similar). Text: white or brand accent green. Include the logo mark prominently.

Tools for creating: Figma, Canva (use exact 1200×630 canvas), or generate programmatically with `@vercel/og` or `sharp`.

## Files to Change

| File                         | Change                                                                   |
| ---------------------------- | ------------------------------------------------------------------------ |
| `public/assets/og-image.jpg` | Create new 1200×630 image                                                |
| `src/index.html`             | Update `og:image` and `twitter:image` to point to `/assets/og-image.jpg` |
| `src/index.html`             | Add `og:image:width`, `og:image:height`, `og:image:type`                 |

## Updated Meta Tags

```html
<meta property="og:image" content="https://www.bitandbyteideas.com/assets/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/jpeg" />
<meta name="twitter:image" content="https://www.bitandbyteideas.com/assets/og-image.jpg" />
```

## Definition of Done

- [ ] `public/assets/og-image.jpg` exists and is 1200×630px
- [ ] File size is under 300 KB
- [ ] `og:image`, `og:image:width`, `og:image:height` updated in `src/index.html`
- [ ] `twitter:image` updated to match
- [ ] Validate preview at https://www.opengraph.xyz/ — correct dimensions and no cropping
- [ ] Validate Twitter Card at https://cards-dev.twitter.com/validator
- [ ] Validate LinkedIn preview by pasting URL in LinkedIn's link inspector
