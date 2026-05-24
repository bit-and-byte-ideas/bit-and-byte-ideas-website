# M7 — Add noscript Fallback for Calendly

**Priority:** Medium | **Effort:** Low | **Category:** Accessibility / Technical SEO

## Problem

The Calendly booking widget is rendered entirely by JavaScript. If JavaScript is disabled or fails to load, the `#booking` section shows an empty container with no message or alternative. While Calendly requires JS to function, the section heading and a fallback message should still be useful to JS-disabled users.

Additionally, some crawlers and prerendering environments may not execute third-party scripts, leaving the section content-less in their snapshot.

## Why It Matters

- Accessibility: users with JS disabled (or blocked by aggressive ad blockers) see nothing
- Prerendering: the Calendly container is empty in the SSG output — the heading is prerendered but the iframe is not (expected, but the fallback improves the static snapshot)
- Google's crawler sometimes renders pages without executing all JS — a fallback ensures the section has meaningful content in that scenario

## Fix

In the booking component template, wrap or follow the Calendly container with a `<noscript>` block and an accessible fallback link:

```html
<!-- Calendly inline widget -->
<div #calendlyContainer class="calendly-inline-widget" style="min-width:320px;height:700px;"></div>

<!-- noscript fallback -->
<noscript>
  <p class="booking-fallback">
    To book a free 30-minute consultation, email us at
    <a href="mailto:info@bitandbyteideas.com">info@bitandbyteideas.com</a>
    or
    <a
      href="https://calendly.com/carlos-barajas-bitandbyteideas/30min"
      target="_blank"
      rel="noopener"
    >
      open Calendly directly </a
    >.
  </p>
</noscript>
```

This ensures:

- JS-disabled users see a meaningful alternative
- The section has text content in any rendering environment
- The email link and direct Calendly URL serve as booking alternatives

## Files to Change

| File                                      | Change                                              |
| ----------------------------------------- | --------------------------------------------------- |
| `src/app/components/booking/booking.html` | Add `<noscript>` block after the Calendly container |
| `src/app/components/booking/booking.scss` | Add `.booking-fallback` style (centered, muted)     |

## Definition of Done

- [ ] `<noscript>` block is present after the Calendly container
- [ ] Fallback contains an email link and a direct Calendly URL
- [ ] Fallback is visually styled appropriately (not garish)
- [ ] `ng build` passes with no errors
- [ ] In a browser with JS disabled, the booking section shows the fallback text
