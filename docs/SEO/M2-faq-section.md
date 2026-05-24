# M2 — Add FAQ Section and FAQPage Schema

**Priority:** Medium | **Effort:** Medium | **Category:** Content / Schema

## Problem

There is no FAQ section on the site. FAQ content:

1. Addresses buyer objections and questions directly on the page
2. Targets long-tail keyword queries (e.g., "how long does a website take to build")
3. Enables `FAQPage` schema markup, which helps AI engines (ChatGPT, Perplexity, Gemini) cite specific answers when users ask about web development services

> **Note on Google rich results:** Google restricted FAQ rich results for commercial sites in August 2023. This FAQ section is still valuable for AI search citation and user trust, but do not expect accordion-style rich results in Google SERPs.

## Why It Matters

- Long-tail FAQ queries have low competition and high conversion intent
- LLMs use structured Q&A content as a primary citation source
- FAQ sections reduce friction for buyers considering reaching out

## Questions to Cover

| Question                                   | SEO value                               |
| ------------------------------------------ | --------------------------------------- |
| What types of businesses do you work with? | Entity/audience targeting               |
| How long does it take to build a website?  | "how long does a website take" queries  |
| How long does a web application take?      | Same, for app queries                   |
| Do I own the code after the project?       | High-intent qualifier question          |
| What technologies do you use?              | Expertise signal, tech-specific queries |
| Do you offer ongoing support?              | Targets "website maintenance" queries   |
| How much does a website cost?              | Direct pricing query                    |
| How do I get started?                      | Last-mile conversion question           |

## Implementation

### 1. Create FAQ component

```bash
ng generate component components/faq
```

Component should render an accessible accordion or flat Q&A list using `<details>`/`<summary>` or a custom Angular pattern.

### 2. Add FAQ section to `app.html`

Place the FAQ section between Booking and Contact (or between Services and Booking):

```html
<app-faq />
```

### 3. Add FAQPage schema to `src/index.html`

Only add the FAQPage JSON-LD block (from H3) once the UI FAQ section is live. The questions in the schema must match the questions visible on the page.

## Files to Change

| File                              | Change                    |
| --------------------------------- | ------------------------- |
| `src/app/components/faq/faq.ts`   | Create new component      |
| `src/app/components/faq/faq.html` | FAQ content               |
| `src/app/components/faq/faq.scss` | Styles                    |
| `src/app/app.html`                | Add `<app-faq />`         |
| `src/app/app.ts`                  | Import `FaqComponent`     |
| `src/index.html`                  | Add FAQPage JSON-LD block |

## Definition of Done

- [ ] FAQ section visible on the homepage with at least 4 questions
- [ ] FAQ is accessible (keyboard navigable, ARIA attributes if using accordion)
- [ ] FAQPage JSON-LD schema added and validated at https://search.google.com/test/rich-results
- [ ] Questions in schema exactly match questions visible in the UI
- [ ] `ng build` passes and FAQ section prerendered in static HTML
