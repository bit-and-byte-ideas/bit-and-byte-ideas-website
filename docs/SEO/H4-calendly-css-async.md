# H4 — Load Calendly CSS Asynchronously

**Priority:** High | **Effort:** Low | **Category:** Performance / Core Web Vitals

## Problem

`src/index.html` loads the Calendly stylesheet synchronously in `<head>`:

```html
<link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
```

A synchronous `<link rel="stylesheet">` is render-blocking — the browser cannot paint any content until this external CSS is downloaded, parsed, and applied. The Calendly widget appears in the `#booking` section, which is well below the fold. Blocking the entire page render for a below-fold, third-party stylesheet directly increases FCP and LCP.

## Why It Matters

- FCP (First Contentful Paint) and LCP are Core Web Vitals ranking factors
- The Calendly CSS is ~12 KB from a third-party CDN — adds 50–200ms latency depending on network
- It provides zero visual benefit until the user scrolls to `#booking`
- Async loading is a zero-risk change — the widget looks identical once the CSS loads

## Fix

Replace in `src/index.html`:

```html
<!-- REMOVE this -->
<link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
```

```html
<!-- ADD these instead -->
<link rel="preconnect" href="https://assets.calendly.com" />
<link
  rel="preload"
  href="https://assets.calendly.com/assets/external/widget.css"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript>
  <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
</noscript>
```

The `onload` trick is the standard pattern for async CSS loading. The `<noscript>` fallback ensures the CSS loads for users who have JavaScript disabled (though Calendly itself requires JS, so this is belt-and-suspenders).

## Files to Change

| File             | Change                                                         |
| ---------------- | -------------------------------------------------------------- |
| `src/index.html` | Replace synchronous Calendly `<link>` with async pattern above |

## Definition of Done

- [ ] Calendly CSS is no longer a render-blocking resource
- [ ] Calendly widget still renders correctly when scrolled into view
- [ ] PageSpeed Insights no longer flags this stylesheet as render-blocking
- [ ] `ng build` passes with no errors
