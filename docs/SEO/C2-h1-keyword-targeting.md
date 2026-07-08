# C2 — H1 Keyword Targeting

**Priority:** Critical | **Effort:** Low | **Category:** On-Page SEO

## Problem

The current H1 is: `"We Build Digital Products That Work."`

This is brand-voice copy. No one searches that phrase. It contains no keyword that matches how small business buyers search for web development services. Google uses the H1 as a primary signal for page topic.

## Why It Matters

- H1 is one of the strongest on-page ranking signals
- The current H1 matches zero commercial search queries
- "Digital products" is not how small business owners describe what they need
- Competitors targeting "web design for small business" or "custom website development" will outrank this page for every non-branded query

## Keyword Research Direction

Target keywords (pick one as primary, others as secondary):

- `web design for small businesses` — high intent, moderate competition
- `custom website development` — broad, high volume
- `web application development for small business` — specific, lower competition
- `software studio [city]` — local variant (requires adding location first — see H5)

## Recommended H1 Rewrite Options

Option A (service-focused):

```
Custom Web Design & App Development for Small Businesses
```

Option B (outcome-focused):

```
We Build Fast, Custom Websites and Web Apps for Small Businesses
```

Option C (location-targeted, after H5 is resolved):

```
Web Design & Development for Small Businesses in [City]
```

The existing tagline `"Building digital ideas, one bit at a time."` can remain as a subheadline — it carries the brand voice without needing to do keyword work.

## Files to Change

| File | Change |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `src/app/components/hero/hero.html` | Update H1 text |
| `src/index.html` | Update `<title>` to match (already `"Bit & Byte Ideas — Software Studio"` — consider `"Web Design & App Development for Small Businesses | Bit & Byte Ideas"`) |
| `src/index.html` | Update `og:title` to match new page title |

## Definition of Done

- [ ] H1 contains at least one primary keyword phrase
- [ ] Page title (`<title>`) updated to match and contains keyword + brand name
- [ ] `og:title` updated to match
- [ ] H1 still reads naturally — not keyword-stuffed
- [ ] Build passes with no errors
