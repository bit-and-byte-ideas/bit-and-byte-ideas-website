# H1 — Add staticwebapp.config.json

**Priority:** High | **Effort:** Low | **Category:** Technical SEO / Security

## Problem

There is no `staticwebapp.config.json` in the repository. Azure Static Web Apps uses this file to configure response headers, redirect rules, and routing. Without it:

- No HTTP security headers are set (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- The apex domain (`bitandbyteideas.com`) has no explicit 301 redirect to `www.bitandbyteideas.com`
- Security headers are a lightweight ranking signal and a trust signal for visitors

## Why It Matters

- Missing `X-Frame-Options` leaves the site vulnerable to clickjacking
- Missing `X-Content-Type-Options` allows MIME-type sniffing attacks
- The apex → www redirect may rely on Azure's default behavior, which is not guaranteed and not a proper 301
- Google Security headers audit flags their absence

## File to Create

Create `public/staticwebapp.config.json`:

```json
{
  "routes": [
    {
      "route": "/",
      "serve": "/index.html",
      "statusCode": 200
    },
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "/*.{css,scss,js,png,jpg,webp,svg,ico,txt,xml,json}"]
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html",
      "statusCode": 200
    }
  },
  "globalHeaders": {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=()",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://assets.calendly.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://calendly.com; frame-src https://calendly.com;"
  }
}
```

> **Note on CSP:** The `unsafe-inline` allowances are required for Angular's component styles and the Calendly widget. Tighten this further by using nonces once CSP is working end-to-end.

## Apex → www Redirect

Azure Static Web Apps does not support cross-domain redirects in `staticwebapp.config.json` (routes only apply within the same custom domain). The apex → www redirect must be enforced at the DNS/Azure level.

Verify in the Azure portal that the apex domain custom domain record has `dns-txt-token` validation and that the SWA is configured to redirect apex to www. This was provisioned in Terraform via `apex.tf` — confirm the behavior is active after the next infrastructure apply.

As a belt-and-suspenders measure, add a meta refresh in the Angular app's server.ts or a redirect in the app for any request to the apex domain (optional — verify at the infrastructure level first).

## Files to Change

| File                              | Change          |
| --------------------------------- | --------------- |
| `public/staticwebapp.config.json` | Create new file |

## Definition of Done

- [ ] `public/staticwebapp.config.json` exists and is valid JSON
- [ ] After deploy: `curl -I https://www.bitandbyteideas.com` returns `X-Frame-Options: DENY`
- [ ] After deploy: `curl -I https://www.bitandbyteideas.com` returns `X-Content-Type-Options: nosniff`
- [ ] Calendly widget still works (CSP allows `calendly.com` and `assets.calendly.com`)
- [ ] Google Fonts still load (CSP allows `fonts.googleapis.com` and `fonts.gstatic.com`)
- [ ] `ng build` passes with no errors
