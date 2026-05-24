# M9 — Image Lazy Loading and WebP Conversion

**Priority:** Medium | **Effort:** Medium | **Category:** Performance / Core Web Vitals

## Problem

Below-fold images load eagerly (the default browser behavior) and are served as PNG with no WebP alternative. Specifically:

- Footer logo `bit_byte_ideas_full_logo.png` (107 KB) — below the fold, should be lazy-loaded and served as WebP
- Any images added in future sections (portfolio, about, testimonials) must follow the same pattern from the start

This item complements C4 (which covers the hero/LCP image). C4 takes priority — address that first.

## Why It Matters

- Eager loading of below-fold images delays resources needed for the LCP element
- WebP is 25–35% smaller than PNG at equivalent quality
- `loading="lazy"` defers image loading until the image is near the viewport, reducing initial page load time
- Every KB saved above the fold improves LCP and FCP

## Fix

### 1. Convert images to WebP

```bash
# Install cwebp (macOS: brew install webp)
cwebp -q 85 public/assets/bit_byte_ideas_full_logo.png \
  -o public/assets/bit_byte_ideas_full_logo.webp
```

Or use a Node.js build script with `sharp`:

```javascript
import sharp from 'sharp';
await sharp('public/assets/bit_byte_ideas_full_logo.png')
  .webp({ quality: 85 })
  .toFile('public/assets/bit_byte_ideas_full_logo.webp');
```

### 2. Update footer image markup

In `src/app/components/footer/footer.html`:

```html
<picture>
  <source srcset="assets/bit_byte_ideas_full_logo.webp" type="image/webp" />
  <img
    src="assets/bit_byte_ideas_full_logo.png"
    alt="Bit and Byte Ideas logo"
    loading="lazy"
    width="[actual-width]"
    height="[actual-height]"
  />
</picture>
```

Always specify `width` and `height` to prevent CLS (Cumulative Layout Shift) even for lazy-loaded images.

### 3. Rule for all future images

Any image added to the site going forward must follow this template:

**Above the fold (hero):**

```html
<picture>
  <source srcset="assets/image.webp" type="image/webp" />
  <img src="assets/image.png" alt="..." fetchpriority="high" width="W" height="H" />
</picture>
```

**Below the fold:**

```html
<picture>
  <source srcset="assets/image.webp" type="image/webp" />
  <img src="assets/image.png" alt="..." loading="lazy" width="W" height="H" />
</picture>
```

## Files to Change

| File                                          | Change                                               |
| --------------------------------------------- | ---------------------------------------------------- |
| `src/app/components/footer/footer.html`       | Add `<picture>`, `loading="lazy"`, `width`, `height` |
| `public/assets/bit_byte_ideas_full_logo.webp` | Create WebP version                                  |

## Definition of Done

- [ ] Footer logo uses `<picture>` with WebP source and PNG fallback
- [ ] Footer logo has `loading="lazy"`, `width`, and `height` attributes
- [ ] WebP file exists in `public/assets/` and is smaller than the PNG
- [ ] No CLS introduced (image dimensions specified)
- [ ] `ng build` passes with no errors
- [ ] PageSpeed Insights no longer flags the footer logo as an unoptimized image
