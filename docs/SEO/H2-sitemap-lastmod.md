# H2 — Fix Sitemap lastmod (Future Date)

**Priority:** High | **Effort:** Low | **Category:** Technical SEO / Sitemap

## Problem

`public/sitemap.xml` contains:

```xml
<lastmod>2026-05-24</lastmod>
```

This date is in the future relative to the build date. Googlebot ignores or devalues future `lastmod` dates and treats the field as unreliable. This undermines crawl freshness signaling for the entire sitemap.

The root cause is that the date was hard-coded rather than generated at build time, and a timezone offset (local time vs UTC) pushed it one day forward.

## Why It Matters

- `lastmod` is a hint to Googlebot about when to recrawl
- A future date signals an error and causes Google to ignore the field entirely
- Accurate `lastmod` dates help ensure the page is recrawled promptly after deploys

## Fix Options

### Option A — Hard-code the correct date (quick fix)

Edit `public/sitemap.xml` and change the date to today in UTC:

```xml
<lastmod>2026-05-23</lastmod>
```

This fixes the immediate issue but requires manual updates on each deploy.

### Option B — Generate sitemap at build time (recommended)

Add a pre-build script that writes `sitemap.xml` dynamically:

`scripts/generate-sitemap.mjs`:

```javascript
import { writeFileSync } from 'node:fs';

const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD UTC

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.bitandbyteideas.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

writeFileSync('public/sitemap.xml', sitemap);
console.log(`Sitemap generated with lastmod ${today}`);
```

Add to `package.json`:

```json
{
  "scripts": {
    "prebuild": "node scripts/generate-sitemap.mjs",
    "build": "ng build"
  }
}
```

With Option B, `sitemap.xml` in version control can be a template or excluded from git entirely (add to `.gitignore` and generate fresh on every build).

## Files to Change

| File                           | Change                                |
| ------------------------------ | ------------------------------------- |
| `public/sitemap.xml`           | Fix `lastmod` to current UTC date     |
| `scripts/generate-sitemap.mjs` | Create (Option B only)                |
| `package.json`                 | Add `prebuild` script (Option B only) |

## Definition of Done

- [ ] `lastmod` in sitemap is not a future date
- [ ] `lastmod` matches or precedes the deploy date
- [ ] If Option B implemented: `npm run build` auto-generates correct date without manual edits
- [ ] Sitemap remains valid XML after the change
