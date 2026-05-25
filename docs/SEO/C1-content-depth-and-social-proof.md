# C1 — Content Depth and Social Proof

**Priority:** Critical | **Effort:** High | **Category:** Content / E-E-A-T

## Problem

The entire site is a single page with ~350 words. There is no portfolio, no case studies, no client testimonials, and no named founder. Google's Helpful Content system rewards demonstrated first-hand experience. A small business buyer landing from search has zero reason to trust an anonymous studio with no visible track record.

Current E-E-A-T score: 28/100.

## Why It Matters

- Google explicitly evaluates Experience, Expertise, Authoritativeness, and Trustworthiness
- A single 350-word page cannot rank for competitive queries — there is not enough content to evaluate
- The highest single bounce trigger for service buyers is "no proof of past work"
- "Founded 2024" with no client evidence signals inexperience

## Action Items

### 1. Create `/about` page

New Angular route: `/about`

Content to include:

- Full name and photo of the founder(s)
- 300–500 word bio: background, relevant experience, motivation for starting the studio
- Technologies and methodologies used (Angular, Azure, etc.)
- What types of clients you work best with
- Link to LinkedIn/GitHub

### 2. Add testimonials section to the homepage

Add 2–3 client quotes to the homepage between the Services and Booking sections.

Format per testimonial:

```
"Quote text here." — First Name L., Company Type (e.g. "Owner, Retail Shop")
```

If no current clients exist: request a quote from a pro-bono client, a previous employer, or a peer who has reviewed your work.

### 3. Create `/portfolio` page

New Angular route: `/portfolio`

For each project (minimum 3):

- Screenshot or mockup
- Project name (client name or anonymized)
- 1-paragraph outcome: what was built, what problem it solved, measurable result if available
- Technologies used
- Link to live site if public

If work is under NDA: describe the problem and solution without naming the client. A concept project or personal project is better than nothing.

### 4. Expand homepage word count to 800–1,000 words

Flesh out the existing sections:

- Each service card: expand from bullet list to 2–3 sentences explaining who it's for and what outcome they get
- Add a "Why Us" or "How We Work" section (3-step process: Consult → Build → Launch)
- Expand the contact/CTA section with a sentence about what happens after someone reaches out

## Files to Change

| File                                        | Change                                           |
| ------------------------------------------- | ------------------------------------------------ |
| `src/app/app.routes.ts`                     | Add routes for `/about` and `/portfolio`         |
| `src/app/components/`                       | Create `AboutComponent` and `PortfolioComponent` |
| `src/app/app.html`                          | Add `<router-outlet>` or lazy-load new pages     |
| `src/app/components/services/services.html` | Expand service card copy                         |
| `src/app/components/hero/hero.html`         | Add a "trusted by" or brief social proof line    |

## Definition of Done

- [x] `/about` page live with founder name, photo, and bio _(name + bio complete; founder photo pending)_
- [ ] At least 2 named testimonials visible on the homepage
- [ ] `/portfolio` page live with at least 3 project entries
- [x] Homepage word count is 800+ words _(services expanded to 2–3 sentences each; How We Work section added)_
- [x] All new pages added to `public/sitemap.xml` with correct `<lastmod>`
- [x] New pages prerender correctly (`ng build` shows "Prerendered 2 static routes")
