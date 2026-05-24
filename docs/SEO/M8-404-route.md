# M8 — Add Custom 404 Route

**Priority:** Medium | **Effort:** Low | **Category:** Technical SEO / UX

## Problem

`src/app/app.routes.ts` only defines `{ path: '' }`. There is no catch-all route for unknown URLs. Azure Static Web Apps falls back to serving `index.html` for unknown paths (configured via `navigationFallback` in `staticwebapp.config.json`), but Angular's router has no defined behavior for unmatched routes — it silently fails to render any route-matched component.

Without an explicit 404 route:

- Users who land on a broken or mistyped URL see a blank page (or the homepage with a router error)
- Google crawls linked URLs and expects a proper 404 or redirect — a blank page with a 200 status is a "soft 404" and can cause indexing problems

## Why It Matters

- Soft 404s (200 status on a page with no content) confuse Googlebot and waste crawl budget
- A clear 404 page with navigation links retains users who land on broken URLs
- The `navigationFallback` in `staticwebapp.config.json` returns 200 for all unmatched paths — Angular needs a 404 component to show something meaningful

## Fix

### Option A — Redirect unmatched routes to homepage

The simplest approach for a single-page site:

```typescript
// src/app/app.routes.ts
export const routes: Routes = [{ path: '' }, { path: '**', redirectTo: '' }];
```

This means any unknown URL redirects to the homepage. Simple, but visitors lose context about why they were redirected.

### Option B — Dedicated 404 component (recommended)

```bash
ng generate component components/not-found
```

```typescript
// src/app/app.routes.ts
export const routes: Routes = [{ path: '' }, { path: '**', component: NotFoundComponent }];
```

`not-found.html`:

```html
<section class="not-found">
  <h1>Page Not Found</h1>
  <p>The page you're looking for doesn't exist.</p>
  <a href="/">Back to Homepage</a>
</section>
```

### Azure SWA: Return a real 404 status

The `staticwebapp.config.json` `navigationFallback` returns 200 for all paths. To return a real 404 for truly unmatched routes, add a response override:

```json
"responseOverrides": {
  "404": {
    "rewrite": "/index.html",
    "statusCode": 404
  }
}
```

This lets Angular handle the routing (showing the 404 component) while Azure returns the correct HTTP status code to crawlers.

## Files to Change

| File                              | Change                              |
| --------------------------------- | ----------------------------------- |
| `src/app/app.routes.ts`           | Add `{ path: '**', ... }` catch-all |
| `src/app/components/not-found/`   | Create component (Option B)         |
| `public/staticwebapp.config.json` | Add 404 response override           |

## Definition of Done

- [ ] Navigating to `https://www.bitandbyteideas.com/nonexistent-page` shows the 404 component or redirects to homepage
- [ ] HTTP status code for unmatched paths is 404 (verify with `curl -I`)
- [ ] 404 page has a link back to the homepage
- [ ] `ng build` passes with no errors
