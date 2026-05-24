# M1 — Add Pricing Anchors to Service Cards

**Priority:** Medium | **Effort:** Low | **Category:** Content / SXO

## Problem

All three service cards show features but no pricing — not even a range. The only signal is "Get a Quote." Small business buyers comparison-shop on price and frequently leave a site that gives them no cost anchor to self-qualify against. Price transparency also improves SEO by matching the intent of queries like "how much does a website cost" or "web development pricing small business."

## Why It Matters

- Buyers without a price anchor assume worst-case (too expensive) or distrust the studio
- Price-range content targets long-tail keywords with high commercial intent
- Reduces unqualified leads (saves time on both sides)
- Sites with pricing signals convert better from SEO traffic

## Recommended Copy

Add a pricing line below each service card's feature list:

**Static Website Development:**

```
Starting at $[X] — custom quote based on scope
```

**Web Application Development:**

```
Quote-based — typically $[X]–$[X] depending on complexity
```

**Maintenance + Hosting:**

```
From $[X]/month — includes hosting, backups, and security updates
```

If you are not ready to publish specific numbers, a softer anchor still helps:

```
"Pricing varies by scope — most small business sites start under $[X]."
```

## Files to Change

| File                                        | Change                                       |
| ------------------------------------------- | -------------------------------------------- |
| `src/app/components/services/services.html` | Add pricing line to each service card        |
| `src/app/components/services/services.scss` | Style the pricing line (muted, smaller text) |

## Definition of Done

- [ ] Each service card displays a pricing anchor or range
- [ ] Pricing is factually accurate
- [ ] Pricing line is visually de-emphasized (not the primary CTA)
- [ ] `ng build` passes with no errors
