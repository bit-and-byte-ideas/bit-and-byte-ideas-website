# H5 — Add Geographic Targeting

**Priority:** High | **Effort:** Low | **Category:** On-Page SEO / Local SEO

## Problem

There is no city, state, region, or country reference anywhere on the site — not in the hero, not in the footer, not in metadata, and not in schema. This means:

- The site cannot rank for `"web studio [city]"` or `"web development [city]"` queries
- Google has no geographic signal to associate this business with any market
- AI search engines cannot answer "where is Bit and Byte Ideas located?"
- Local buyers have a raised concern: "Is this an overseas studio?"

## Why It Matters

- Location-based queries have high commercial intent ("web developer near me", "software studio Austin")
- Google's local algorithm heavily weights proximity signals on the page and in schema
- Even for a remote-first studio, stating a home base dramatically increases trust with local buyers

## Action Items

### 1. Add location to the hero section

In `hero.html`, add a single line below the subheadline:

```html
<p class="hero-location">Based in [City, State] — serving small businesses nationwide</p>
```

Or integrate into the subheadline copy:

```
"From polished static sites to full-featured web apps — custom-built in [City] for small businesses everywhere."
```

### 2. Add location to the page title and meta description

In `src/index.html`:

```html
<title>Web Design & App Development for Small Businesses | Bit & Byte Ideas — [City]</title>
<meta
  name="description"
  content="Bit & Byte Ideas is a software studio in [City, State] building custom websites and web apps for small businesses. Static sites, full-stack apps, managed hosting. Free 30-min consult."
/>
```

### 3. Add address to schema

In the `ProfessionalService` JSON-LD block (see H3), add:

```json
"address": {
  "@type": "PostalAddress",
  "addressLocality": "[City]",
  "addressRegion": "[State abbreviation]",
  "addressCountry": "US"
}
```

For a remote-first studio, a full street address is not required. City + state is sufficient for local SEO signals.

### 4. Add location to footer

In the footer component, add a location line near the email address:

```html
<p>Based in [City, State]</p>
```

### 5. Update llms.txt (see C3)

The `llms.txt` file has a `[CITY, STATE/COUNTRY]` placeholder — fill it in once the location is added to the site.

## Files to Change

| File                                    | Change                                                               |
| --------------------------------------- | -------------------------------------------------------------------- |
| `src/app/components/hero/hero.html`     | Add location line below subheadline                                  |
| `src/app/components/footer/footer.html` | Add location line                                                    |
| `src/index.html`                        | Update `<title>`, `<meta name="description">`, and JSON-LD `address` |
| `public/llms.txt`                       | Fill in location placeholder                                         |

## Decision Required

Before implementing: decide on the canonical location to display. Options:

- City + State where you operate (e.g., "Austin, TX")
- "Remote-first, based in [City]"
- "[City, State] — serving clients nationwide"

This location will appear on the live site, in Google's index, and in AI-generated summaries. Use the real operating location.

## Definition of Done

- [ ] Location appears in the hero or subheadline
- [ ] Location appears in the footer
- [ ] `<title>` and `<meta name="description">` reference the location
- [ ] `ProfessionalService` schema includes `address` with city and state
- [ ] `llms.txt` location placeholder replaced with real location
- [ ] `ng build` passes with no errors
