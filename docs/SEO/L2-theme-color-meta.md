# L2 — Add theme-color Meta Tag

**Priority:** Low | **Effort:** Low | **Category:** Mobile / UX

## Problem

There is no `<meta name="theme-color">` tag in `src/index.html`. On Android Chrome and other mobile browsers, this tag controls the color of the browser's address bar and status bar, creating a more polished, branded experience when the site is viewed on mobile or added to the home screen.

## Why It Matters

- Minor mobile UX improvement — the browser chrome matches the site's dark color palette
- Required for a complete PWA manifest if PWA support is added in the future
- Takes 30 seconds to implement

## Fix

Add to `src/index.html` inside `<head>`:

```html
<meta name="theme-color" content="#111827" />
```

Use the site's primary dark background color (`#111827` based on the Tailwind `gray-900` equivalent visible in the design). Update this value if the brand color scheme changes.

For light/dark mode support:

```html
<meta name="theme-color" content="#111827" media="(prefers-color-scheme: dark)" />
<meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
```

## Files to Change

| File             | Change                              |
| ---------------- | ----------------------------------- |
| `src/index.html` | Add `<meta name="theme-color">` tag |

## Definition of Done

- [ ] `<meta name="theme-color">` present in `src/index.html`
- [ ] Color value matches the site's dark background
- [ ] `ng build` passes with no errors
- [ ] On Android Chrome: browser address bar shows the brand color when visiting the site
