# H3 — Fix and Expand Schema Markup

**Priority:** High | **Effort:** Medium | **Category:** Structured Data

## Problem

The current JSON-LD in `src/index.html` has multiple issues:

1. `serviceType` is an array of strings — invalid per Schema.org (expects a single `Text` value or structured `Service` objects via `hasOfferCatalog`)
2. No `Organization` schema — required for brand identity, logo, and social profile links
3. No `WebSite` schema — standard for all websites; enables sitelinks search box eligibility
4. Missing `logo`, `image`, `address`, `sameAs`, `founder`, `knowsAbout` on the `ProfessionalService`
5. `priceRange: "$$"` is meaningless without context for a software studio

Schema score: 32/100.

## Why It Matters

- Google uses `Organization` + `WebSite` for Knowledge Panel construction
- `ProfessionalService` without `address` will not trigger local business rich results
- `sameAs` connects the schema entity to LinkedIn, GitHub, and other authority sources, improving Knowledge Graph confidence
- Correct `hasOfferCatalog` structure lets AI engines cite individual services

## Replacement JSON-LD

Replace the current single `<script type="application/ld+json">` block in `src/index.html` with these three blocks:

### Block 1 — Organization + WebSite

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.bitandbyteideas.com/#organization",
      "name": "Bit & Byte Ideas",
      "url": "https://www.bitandbyteideas.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.bitandbyteideas.com/assets/bit_byte_ideas_full_logo.png"
      },
      "image": "https://www.bitandbyteideas.com/assets/bit_byte_ideas_full_logo.png",
      "description": "A software studio specializing in static website development, web application development, and maintenance & hosting for small and medium businesses.",
      "email": "info@bitandbyteideas.com",
      "foundingDate": "2024",
      "areaServed": "Worldwide",
      "sameAs": []
    },
    {
      "@type": "WebSite",
      "@id": "https://www.bitandbyteideas.com/#website",
      "url": "https://www.bitandbyteideas.com",
      "name": "Bit & Byte Ideas",
      "description": "Software Studio — Static Websites, Web Apps, and Maintenance.",
      "publisher": {
        "@id": "https://www.bitandbyteideas.com/#organization"
      },
      "inLanguage": "en-US"
    }
  ]
}
</script>
```

### Block 2 — ProfessionalService with hasOfferCatalog

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://www.bitandbyteideas.com/#service",
  "name": "Bit & Byte Ideas",
  "url": "https://www.bitandbyteideas.com",
  "email": "info@bitandbyteideas.com",
  "image": "https://www.bitandbyteideas.com/assets/bit_byte_ideas_full_logo.png",
  "logo": "https://www.bitandbyteideas.com/assets/bit_byte_ideas_full_logo.png",
  "description": "A software studio specializing in static website development, web application development, and maintenance & hosting subscriptions for small and medium businesses.",
  "areaServed": "Worldwide",
  "parentOrganization": {
    "@id": "https://www.bitandbyteideas.com/#organization"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Software Development Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Static Website Development",
          "description": "Custom-designed, performance-optimized, SEO-ready static sites. Mobile-first, Core Web Vitals optimized, no templates.",
          "provider": { "@id": "https://www.bitandbyteideas.com/#organization" }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Web Application Development",
          "description": "Interactive, data-driven applications with custom business logic, user authentication, database design, API development, and scalable cloud architecture.",
          "provider": { "@id": "https://www.bitandbyteideas.com/#organization" }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Website Maintenance & Hosting",
          "description": "Subscription-based managed cloud hosting including automated backups, security patches, performance monitoring, and priority support.",
          "provider": { "@id": "https://www.bitandbyteideas.com/#organization" }
        }
      }
    ]
  }
}
</script>
```

### Block 3 — FAQPage (requires adding a FAQ section to the UI)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What types of businesses does Bit & Byte Ideas work with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We work primarily with small and medium businesses that need a custom web presence or internal web application — built properly from scratch, not from a template."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to build a website?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A typical static website takes 2–4 weeks from kick-off to launch. Web applications vary by scope; we provide a detailed timeline estimate before starting any work."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer ongoing support after launch?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The Maintenance + Hosting subscription covers managed cloud hosting, automated backups, security patches, performance monitoring, and priority support for minor changes."
      }
    },
    {
      "@type": "Question",
      "name": "How do I get started?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Book a free 30-minute discovery call through the website or email info@bitandbyteideas.com. We respond within 24 hours. No commitment required for the initial consultation."
      }
    }
  ]
}
</script>
```

> FAQPage schema should only be added once a visible FAQ section exists in the UI (see M2).

## Future: Populate `sameAs`

Once social/directory profiles exist, add their URLs to the `sameAs` array in Block 1:

```json
"sameAs": [
  "https://www.linkedin.com/company/bit-and-byte-ideas",
  "https://github.com/bit-and-byte-ideas",
  "https://twitter.com/bitandbyteideas"
]
```

## Files to Change

| File             | Change                                       |
| ---------------- | -------------------------------------------- |
| `src/index.html` | Replace existing JSON-LD with 3 blocks above |

## Definition of Done

- [ ] Old single-block JSON-LD replaced with Organization+WebSite and ProfessionalService blocks
- [ ] Validate at https://search.google.com/test/rich-results — no errors
- [ ] Validate at https://validator.schema.org — no errors
- [ ] `ng build` passes with no errors
- [ ] FAQPage block added only after FAQ UI section is live (see M2)
- [ ] `sameAs` populated once social profiles are created (see M6)
