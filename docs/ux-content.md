# UX and Content

## Primary Audience

The website is aimed at small and medium businesses across the United States evaluating
Bit and Byte Ideas for website, web application, maintenance, or hosting work. The studio's
home base (San Diego, CA) is stated for trust and local search.

The site should quickly answer:

- What does the studio build?
- Is this relevant to my business?
- How do I contact or book time?

## Page Journey

The home page flow is:

1. Fixed navigation with brand identity, anchor links, and the primary CTA.
2. Hero with the keyword-targeted headline, positioning copy, and both CTAs.
3. Trust strip with experience and platform proof points.
4. Services section describing the three service lines.
5. Process section explaining how an engagement runs.
6. FAQ answering common buyer questions (pricing model, timelines, ownership, location).
7. Contact section with direct email and business availability details.
8. Footer with brand reinforcement, location line, navigation, and GitHub link.

`/about` carries the founder's background, technical range, and best-fit client profiles,
ending in a CTA band. Changes should preserve a clear path from service discovery to
booking or contact.

## Calls to Action

There are exactly two CTA labels, in a fixed hierarchy:

- **Book a Call** — primary. Always an external link to Calendly, opening in a new tab.
  Rendered as the filled green button in the nav, hero, mobile menu, and about CTA band.
- **Get in Touch** — secondary. Anchors to `#contact` (email path). Rendered as the ghost
  button or text link.

Do not introduce new CTA labels for the same actions (this was SEO item M5). If the
conversion strategy changes, update every surface in the same change.

## Content Ownership

All copy lives in typed modules under `src/content/` — see
[Architecture](architecture.md#content-ownership) for the full table. Components render
content; they do not own it. When updating copy, edit the content module and let every
surface pick it up.

SEO-sensitive strings (titles, meta descriptions, structured data) live in
`src/content/seo.ts` and are covered by unit tests plus prerender checks.

## Accessibility Expectations

Maintain these patterns:

- A skip link is the first focusable element and targets `#main-content`.
- Landmarks and sections use clear labels or heading references; headings are sequential.
- Decorative images (hero watermark, nav icon, footer icon) have empty `alt` and
  `aria-hidden`; brand identity is carried by real text (the "Bit & Byte Ideas" wordmark,
  identical in the nav and footer), not a raster logo image.
- Interactive elements are keyboard reachable with visible focus rings, and touch targets
  are at least 44×44px.
- Text contrast meets 4.5:1 on the dark background — body-muted text uses `--text-muted`;
  `--text-faint` is reserved for decorative, `aria-hidden` ornament only.
- Every animation is gated by `prefers-reduced-motion`, and scroll reveals are
  transform-only so content is never hidden without JavaScript or in print.

## Brand Direction

The accepted direction is "Engineered Dark" (`docs/redesign/03-design-direction.md`):

- Dark navy/slate palette with green and blue accents, carried in `src/design/tokens.css`.
- Bricolage Grotesque display type, Public Sans body, IBM Plex Mono for the `//` system
  labels and technical detail.
- Blueprint grid and grain textures, hairline rules, sharp 4px radii.
- One orchestrated hero load; subtle scroll-triggered entrances elsewhere.

Do not introduce unrelated visual systems or generic stock-section layouts. New sections
should feel like part of the same focused software-studio site.
