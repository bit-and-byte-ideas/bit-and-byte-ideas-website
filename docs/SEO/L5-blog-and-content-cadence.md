# L5 — Blog and Content Cadence

**Priority:** Low | **Effort:** High (ongoing) | **Category:** Content / Topical Authority

## Problem

The site has no blog, resources section, or any regularly updated content. A single static homepage cannot build topical authority over time. Search engines reward sites that demonstrate expertise through consistent, useful content — especially on topics related to their services.

## Why It Matters

- Topical authority: 10 articles on web development for small businesses signal expertise to Google more than 0 articles, even if each individual article is modest
- Long-tail traffic: blog posts target specific queries ("how to choose a website developer", "static site vs web app for small business") that the homepage cannot rank for
- E-E-A-T: published articles with a named author demonstrate experience and expertise
- Internal linking: blog posts can link to service pages, strengthening the page authority of those pages
- AI citation: LLMs preferentially cite sites with substantive, well-structured content on a topic

## Recommended Content Plan

### Minimum viable cadence: 4 posts/year

Even one post per quarter builds more topical authority than zero. Consistency matters more than volume.

### Topic ideas (service-aligned, high buyer intent)

| Title                                                                                | Target keyword                      | Service alignment     |
| ------------------------------------------------------------------------------------ | ----------------------------------- | --------------------- |
| "Static Website vs Web Application: What Does Your Business Actually Need?"          | static website vs web app           | All services          |
| "How to Choose a Web Developer for Your Small Business (7 Questions to Ask)"         | choose web developer small business | Lead generation       |
| "What's Included in Website Maintenance? What You Should Expect From a Hosting Plan" | website maintenance plan            | Maintenance + Hosting |
| "Why Your Small Business Website Is Slow (And How to Fix It)"                        | slow small business website         | Static Website Dev    |
| "How Long Does It Take to Build a Website? A Realistic Timeline"                     | how long to build a website         | All services          |
| "What Is a Static Website and Is It Right for Your Business?"                        | what is a static website            | Static Website Dev    |
| "Web App vs Website: The Real Difference for Small Business Owners"                  | web app vs website                  | Web App Dev           |
| "The True Cost of a Business Website in 2026"                                        | cost of a business website          | Lead generation       |

### Format

Each post should:

- Target one primary keyword phrase
- Be 800–1,500 words
- Have a named author (the founder) with a photo
- Include at least one internal link to a service page or the contact section
- End with a CTA to book a free consultation

## Implementation Notes

### Angular routing for a blog

To add a blog to the current Angular app:

```typescript
// app.routes.ts
{ path: 'blog', loadComponent: () => import('./components/blog/blog-list').then(m => m.BlogList) },
{ path: 'blog/:slug', loadComponent: () => import('./components/blog/blog-post').then(m => m.BlogPost) },
```

Consider using:

- **Markdown files + Angular SSG** — write posts in Markdown, render at build time (similar to what Analog.js provides)
- **CMS integration** — Contentful, Sanity, or Netlify CMS for non-developer content editing
- **Simple approach** — one Angular component per post, prerendered at build time

Each new blog post URL must be added to `public/sitemap.xml` (or auto-generated via the sitemap script in H2).

### Schema for blog posts

Each blog post page should include `Article` schema:

```json
{
  "@type": "Article",
  "headline": "Post title",
  "author": {
    "@type": "Person",
    "name": "[Founder name]"
  },
  "datePublished": "YYYY-MM-DD",
  "publisher": {
    "@id": "https://www.bitandbyteideas.com/#organization"
  }
}
```

## Files to Change (when implementing)

| File                                                   | Change                                  |
| ------------------------------------------------------ | --------------------------------------- |
| `src/app/app.routes.ts`                                | Add blog routes                         |
| `src/app/components/blog/`                             | Create BlogList and BlogPost components |
| `public/sitemap.xml` or `scripts/generate-sitemap.mjs` | Add blog post URLs                      |

## Definition of Done

- [ ] Blog section accessible at `/blog`
- [ ] At least 2 posts published before launch
- [ ] Each post has a named author, date, and 800+ words
- [ ] Each post is prerendered at build time (`ng build` shows the route in prerendered output)
- [ ] Blog post URLs added to sitemap
- [ ] Internal links from each post point to relevant service sections
