# M5 — Standardize CTA Labels

**Priority:** Medium | **Effort:** Low | **Category:** SXO / Conversion

## Problem

The site currently uses five different labels for what is effectively the same action (contacting or booking):

| Label              | Location           |
| ------------------ | ------------------ |
| "Explore Services" | Hero               |
| "Get in Touch"     | Hero, Navigation   |
| "Get a Quote"      | Service cards (×3) |
| "Start a Project"  | Contact section    |
| "Book a Call"      | Navigation         |

This creates mild decision paralysis — visitors must decode which button does what before clicking. It also dilutes the call-to-action signal for analytics and A/B testing.

## Why It Matters

- Consistent CTAs reduce cognitive load and improve click-through rate
- A unified label is easier to track in analytics (one event vs five)
- For a service business, the primary conversion is a consultation booking — every CTA should drive toward that single action
- SXO (Search Experience Optimization) rewards sites where the user journey is clear from first click to conversion

## Recommended CTA Hierarchy

**Primary CTA (one label sitewide):** `"Book a Free Call"` or `"Get a Free Quote"`

This label:

- States what happens (a call/quote)
- States it's free (lowers friction)
- Is action-oriented

**Secondary CTA:** `"Learn More"` or `"See Our Work"` — used only where the user is not ready to convert (e.g., hero section secondary button).

**Tertiary:** Email link — `"Or email us directly"` near the booking form.

## Suggested Mapping

| Current                             | Replace With                  |
| ----------------------------------- | ----------------------------- |
| "Get in Touch" (hero)               | Secondary: "See Our Services" |
| "Explore Services" (hero)           | Keep as secondary             |
| "Get a Quote" (service cards)       | "Book a Free Call"            |
| "Start a Project" (contact section) | "Book a Free Call"            |
| "Book a Call" (nav)                 | "Book a Free Call"            |
| "Get in Touch" (nav)                | Remove (duplicate of booking) |

## Files to Change

| File                                        | Change                  |
| ------------------------------------------- | ----------------------- |
| `src/app/components/hero/hero.html`         | Align CTA labels        |
| `src/app/components/services/services.html` | Unify service card CTAs |
| `src/app/components/contact/contact.html`   | Align CTA label         |
| `src/app/components/nav/nav.html`           | Simplify nav CTAs       |

## Definition of Done

- [ ] Primary CTA uses the same label in at least 3 locations
- [ ] No more than 2 distinct CTA labels sitewide (primary + secondary)
- [ ] Navigation has at most 1 conversion CTA
- [ ] Visual hierarchy is clear: primary CTA is more prominent than secondary
- [ ] `ng build` passes with no errors
