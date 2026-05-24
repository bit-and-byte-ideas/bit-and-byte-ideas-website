# C4 — LCP Image Optimization

**Priority:** Critical | **Effort:** Medium | **Category:** Performance / Core Web Vitals

## Problem

The hero image `assets/BandBIdeas-Icon-small.png` is 153 KB, above-the-fold, loaded without a priority hint, and has no WebP equivalent. Additionally, `public/BandBIdeas.ico` is 400 KB — a favicon should be under 10 KB. Both directly damage LCP (Largest Contentful Paint), a Core Web Vitals ranking signal.

## Why It Matters

- LCP is a confirmed Google ranking factor (Core Web Vitals)
- Good LCP: < 2.5 seconds | Needs Improvement: 2.5–4 seconds | Poor: > 4 seconds
- A 153 KB unoptimized PNG above the fold is a primary LCP liability
- `fetchpriority="high"` tells the browser to fetch the LCP image before other resources
- WebP is 25–35% smaller than PNG at equivalent quality on average
- A 400 KB favicon is downloaded on every page load

## Action Items

### 1. Add `fetchpriority="high"` to the hero image

In the hero component template, find the `<img>` tag for the icon and add the attribute:

```html
<img
  src="assets/BandBIdeas-Icon-small.png"
  alt="Bit and Byte Ideas"
  fetchpriority="high"
  width="[actual-width]"
  height="[actual-height]"
/>
```

Always include explicit `width` and `height` to prevent CLS (Cumulative Layout Shift).

### 2. Convert hero image to WebP with PNG fallback

```html
<picture>
  <source srcset="assets/BandBIdeas-Icon-small.webp" type="image/webp" />
  <img
    src="assets/BandBIdeas-Icon-small.png"
    alt="Bit and Byte Ideas"
    fetchpriority="high"
    width="[actual-width]"
    height="[actual-height]"
  />
</picture>
```

Convert the PNG to WebP using:

```bash
cwebp -q 85 public/assets/BandBIdeas-Icon-small.png -o public/assets/BandBIdeas-Icon-small.webp
# or using sharp in a build script
```

### 3. Replace the 400 KB favicon

The current `BandBIdeas.ico` is 400 KB — likely a multi-resolution ICO exported incorrectly.

Replace with:

```bash
# Generate a proper 32x32 PNG favicon from the icon
convert assets/BandBIdeas-Icon-small.png -resize 32x32 public/favicon-32x32.png
convert assets/BandBIdeas-Icon-small.png -resize 16x16 public/favicon-16x16.png
```

Update `src/index.html`:

```html
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
```

Remove `public/BandBIdeas.ico` (or keep a tiny version if ICO format is needed for IE11 support — it is not).

### 4. Add `loading="lazy"` to below-fold images

The footer logo (`bit_byte_ideas_full_logo.png`, 107 KB) is below the fold and should be lazy-loaded:

```html
<img
  src="assets/bit_byte_ideas_full_logo.png"
  alt="Bit and Byte Ideas logo"
  loading="lazy"
  width="[actual-width]"
  height="[actual-height]"
/>
```

Also convert the footer logo to WebP.

### 5. Add Calendly preconnect

```html
<!-- In src/index.html <head> -->
<link rel="preconnect" href="https://assets.calendly.com" />
```

## Files to Change

| File                                    | Change                                                     |
| --------------------------------------- | ---------------------------------------------------------- |
| `src/app/components/hero/hero.html`     | Add `fetchpriority="high"`, `<picture>`, `width`, `height` |
| `src/app/components/footer/footer.html` | Add `loading="lazy"`, `<picture>`, `width`, `height`       |
| `src/index.html`                        | Update favicon links, add Calendly preconnect              |
| `public/assets/`                        | Add `.webp` versions of both images                        |
| `public/favicon-32x32.png`              | Create properly-sized favicon                              |
| `public/BandBIdeas.ico`                 | Replace with tiny version or remove                        |

## Definition of Done

- [ ] Hero image has `fetchpriority="high"` and `<picture>` with WebP source
- [ ] Hero image has explicit `width` and `height` attributes
- [ ] Footer logo has `loading="lazy"` and WebP equivalent
- [ ] Favicon is under 10 KB
- [ ] `ng build` passes with no errors
- [ ] PageSpeed Insights LCP score improves (run before/after comparison)
