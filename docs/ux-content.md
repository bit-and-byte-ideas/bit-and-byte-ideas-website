# UX and Content

## Primary Audience

The website is aimed at small and medium businesses evaluating Bit and Byte Ideas for website, web application, maintenance, or hosting work.

The page should quickly answer:

- What does the studio build?
- Is this relevant to my business?
- How do I contact or book time?

## Page Journey

The current page flow is:

1. Navigation with brand identity and anchor links.
2. Hero section with the studio positioning and primary calls to action.
3. Services section describing available work.
4. Booking section with an embedded Calendly consultation flow.
5. Contact section with direct email and business availability details.
6. Footer with brand reinforcement and copyright.

Changes should preserve a clear path from service discovery to contact or booking.

## Calls to Action

Current calls to action are:

- `Explore Services`
- `Get in Touch`
- `Get a Quote`
- `Book a Call`
- Email link in the contact section

Avoid adding competing primary calls to action unless the business workflow changes. If a new CTA is required, decide whether booking or email remains the main conversion path and update copy consistently.

## Content Ownership

Service descriptions are currently owned in `src/app/components/services/services.ts`.

Business contact details are owned in `src/app/services/business-info.service.ts`.

Calendly booking configuration is owned in `src/app/components/booking/booking.ts`.

When updating content, prefer the existing source of truth rather than duplicating text in templates.

## Accessibility Expectations

Maintain these accessibility patterns:

- Landmarks and sections should use clear labels or heading references.
- Decorative images should have empty `alt` text and be hidden from assistive technologies when appropriate.
- Informative images, such as the footer logo, should have meaningful `alt` text.
- Anchor destinations should match visible navigation labels.
- Interactive elements should remain keyboard reachable.
- Text contrast should remain high against the dark background.

## Brand Direction

The existing design uses:

- Dark navy and slate backgrounds.
- Green and blue accent colors.
- Sharp, compact radius values.
- Strong display typography for major headings.
- Monospace labels for technical detail.

Do not introduce unrelated visual systems or generic stock-section layouts. New sections should feel like part of the same focused software-studio site.
