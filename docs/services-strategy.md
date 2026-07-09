# Services Rethink — Strategy Notes

**Status:** Accepted 2026-07-09 — three-service restructure, no tool names, hero unchanged for now
**Date:** 2026-07-09

You asked me to rethink how services are presented so both non-technical and technical
business owners immediately understand what's on offer, while still calling out website
build-out, hosting, and maintenance — and adding an explicit business-automation /
integrations story. This is a content-strategy note, not an implementation; nothing in
`src/content/services.ts` has changed yet.

## The actual problem

The current three services (`src/content/services.ts`) are organized by **build
technology**, not by **business outcome**:

| # | Title | What it's really organized around |
| - | ----- | ----------------------------------- |
| 01 | Static Website Development | The word "static" — a rendering technique, meaningless to a business owner |
| 02 | Web Application Development | "Custom business logic," "database design & API development" — engineering vocabulary |
| 03 | Maintenance + Hosting | Already outcome-framed and fine as-is |

A non-technical owner doesn't walk in thinking "do I need static or dynamic rendering?" —
they think "I need people to find me online," "I don't want to worry about it breaking,"
and (very commonly, and currently **not represented anywhere on the site**) "I'm tired of
manually retyping the same information into three different tools." That third thought is
exactly the gap you're asking me to close, and it's bigger than a copy tweak: today,
integrations exist only as a single throwaway bullet — *"Third-party service
integrations"* — buried inside service #2. There is no first-class automation story
anywhere on the site, in the FAQ, or in the schema.

The FAQ already half-senses this problem. `faq.ts` item 6, *"Do I need a web application
or just a website?"*, exists specifically to help a visitor self-classify between the two
build services — which is a workaround for the services section not making that
distinction easy in the first place, and it still doesn't mention automation as a third,
often cheaper and faster, path.

## Guiding principle

**Lead every service with the plain-English outcome; follow with enough specific,
concrete detail that a technical reader can self-qualify ("they clearly know what they're
doing") without the copy ever requiring technical vocabulary to be understood.** Concrete
named examples (QuickBooks, Shopify, Slack, a CRM) do more work than the word
"integrations" alone — they let a non-technical reader recognize their own tools instantly
instead of translating an abstraction.

This is the same principle already at work in the FAQ and about page (e.g., "You own
everything" instead of "we don't lock you into proprietary infrastructure") — I'm applying
it more consistently to the services section specifically.

## Recommendation: three services, reframed around Build → Automate → Maintain

Keep three cards (no layout/CSS change needed — `services-grid` already targets three
columns). Merge the two build services into one that spans the complexity spectrum
instead of forcing a visitor to pre-classify themselves, and give automation full
first-class billing as its own card:

1. **Website & Application Development** (merges today's 01 + 02)
2. **Business Automation & Integrations** (new)
3. **Maintenance + Hosting** (today's 03, lightly revised)

### Why this order

Build is what got them here. Automation is the differentiator most competitors in this
space don't offer and the thing you specifically asked to surface — placing it second, not
third, means a scanning visitor sees it before they've mentally moved on. Maintenance
closes as the ongoing-relationship reassurance, which is also its natural role today (it's
already the one subscription-billed, "add-on" service).

### Proposed copy

**01 — Website & Application Development**

> From a fast, polished marketing site to a full-featured application with logins,
> dashboards, and business logic — we design and build custom software around your goals,
> not a template. Start where you are today; we architect it to grow with you.

- Custom design — no templates or page builders
- Mobile-first, SEO-optimized, and fast (Core Web Vitals)
- User accounts, dashboards & business logic when you need them
- Database design, APIs & cloud infrastructure for anything custom
- Built to scale from a single page to a full application

**02 — Business Automation & Integrations** *(new)*

> Stop copying the same information between tools by hand. We connect the software you
> already use — CRM, invoicing, forms, email, e-commerce — so information flows
> automatically, and build custom integrations via API when an off-the-shelf connector
> doesn't exist. Less manual work, fewer mistakes, more time to run your business.

- Connect the tools you already use (CRM, invoicing, forms, e-commerce, email)
- Custom API integrations when an off-the-shelf connector doesn't exist
- Automated workflows that replace manual, repetitive tasks
- Data sync between systems — no more double data entry
- Notifications & alerts wired into the tools your team already checks

**03 — Maintenance + Hosting** *(lightly revised — bold is the change)*

> Stay focused on running your business while we handle everything technical. Monthly
> plans cover managed cloud hosting, security updates, dependency patches, and performance
> monitoring — **plus keeping automations working as the tools on either end change** —
> billed monthly, no surprises.

- Managed cloud hosting
- Automated backups & recovery
- Security patches & dependency updates
- Performance monitoring & alerts
- Priority support & minor changes

Badge stays `Add-on subscription` on Maintenance only — it's the one recurring-billed
service; the other two stay quote-based, consistent with the existing "no pricing anchors,
quoted per engagement" decision (SEO item M1).

## Alternative considered: four cards instead of three

Keep all of today's three services untouched and simply add automation as a fourth card.

- **Pros:** Purely additive — lower-risk, doesn't touch tested copy.
- **Cons:** Requires a grid change (`services-grid` is `repeat(3, 1fr)` at desktop; four
  cards want a 2×2 or four-across treatment). More importantly, it leaves the "static vs.
  web application" jargon-fork in place — the exact clarity problem you're asking me to
  fix — and misses the chance to make automation feel as prominent as build/maintain
  instead of "one more item."

**Not recommended**, but flagging it because it's the lower-effort path if you'd rather not
touch the two existing build cards.

## Downstream touchpoints (once we implement)

- **`src/content/seo.ts`** needs no changes: `hasOfferCatalog` in
  `professionalServiceSchema()` already derives from `services.map(...)`, so the
  structured-data offer catalog updates automatically the moment `services.ts` changes.
- **FAQ** (`src/content/faq.ts`): item 6, *"Do I need a web application or just a
  website?"*, should be revised to match the merged framing and explicitly mention
  automation as a third path — something like *"Do I need a bigger website, or just my
  tools connected?"* with an answer that names the automation service. I'd also consider a
  new FAQ item giving 2–3 concrete named-tool examples (this is where naming specific tools
  like QuickBooks/Shopify/Slack pays off most, since FAQ answers can be longer and more
  concrete than a service-card bullet).
- **Hero / Process sections**: out of scope for this request (you asked specifically about
  services), but worth knowing the hero H1 ("We Build Custom Websites & Web Apps.") and
  subheadline don't currently gesture at automation at all. If you want the hero to carry
  the same three-pillar story, that's a separate, small follow-up — not required for the
  services section to make sense on its own.
- **SEO content opportunity** (not required, noted for later): "business automation,"
  "workflow automation for small business," and tool-specific long-tail terms
  ("QuickBooks integration developer," "Shopify automation") are keyword territory the
  site currently has zero presence in. A future SEO pass could target this once the
  service exists on-page.
- **No CSS/component changes needed** either way if we go with the three-card
  recommendation — this is a pure content-module edit (`src/content/services.ts` +
  `src/content/faq.ts`), which keeps the eventual implementation low-risk.

## Decisions (2026-07-09)

1. **Three-service restructure — confirmed.** Proceeding with Build → Automate →
   Maintain as drafted above.
2. **No specific third-party tool names for now** — generic categories only (CRM,
   invoicing, forms, e-commerce, email). Revisit once there's a track record of real
   integrations to point to, rather than implying partnerships that don't exist yet. The
   copy above already complies with this — it names categories, never brands — so no
   copy changes were needed as a result of this decision.
3. **Hero/subheadline left as-is.** Out of scope for this pass.

## Additional thoughts before implementation

A few things worth flagging now, before I touch the content modules:

- **Position automation as a standalone entry point, not just an add-on.** The
  automation description already reads this way (it never presupposes we built the
  visitor's existing site), which is deliberate: automation work is typically smaller,
  faster, and cheaper than a full website build, which makes it a natural lower-commitment
  first engagement for a prospect who isn't ready to rebuild their site yet. Worth
  remembering as a sales/positioning asset, not just a services-page detail — it's a
  legitimate lead-gen wedge distinct from the website funnel.
- **Don't vary the "Get in Touch" CTA text per card.** It would be tempting to make the
  automation card's CTA say something more specific ("Tell us what you'd like connected"),
  but every CTA on the site was deliberately standardized to two labels — "Book a Call"
  primary, "Get in Touch" secondary — after the original Angular site shipped five
  different labels for the same action (SEO item M5). Reintroducing a third label on one
  card would undo that fix. Keep the card CTA identical across all three services.
- **Schema/SEO side effect is positive, not neutral.** Merging the two build services
  into one `Service` schema entry might sound like it loses a keyword-targeted entity for
  "web application development," but the merged title/description still contains both
  phrases together in one node (`hasOfferCatalog` derives `name`/`description` straight
  from `service.title`/`service.description`), so if anything this reads as more
  topically coherent to a crawler than two thinner, overlapping entries did.
- **FAQ item 6 rewrite, drafted and ready:**

  > **Do I need a website, a full application, or just my tools connected?**
  > Most businesses start with a website; you add application features like logins or
  > dashboards only when customers need to interact with the system directly. But
  > sometimes the real bottleneck isn't your website at all — it's the manual work
  > between the tools you already use. We'll help you figure out which one (or which
  > combination) actually solves the problem in the first ten minutes of a call.

- **New FAQ item, demystifying "automation" without naming tools:**

  > **What does "business automation" actually mean?**
  > It means the manual, repetitive parts of running your business — copying data
  > between systems, re-entering the same customer information twice, manually sending a
  > follow-up email after every sale — get handled automatically. Describe how you
  > currently do it and we'll tell you what's possible; you don't need to know any
  > technical terms to start that conversation.

  That last sentence is doing real work for the non-technical half of the audience: it
  explicitly lowers the bar to asking, rather than assuming they already know what an API
  or a webhook is.
- **Optional, not required:** a short badge on the automation card (parallel to
  Maintenance's `Add-on subscription`) — something like `Often the quickest win` — signals
  it's typically a smaller/faster engagement than a full build, reinforcing the
  standalone-entry-point positioning above, without making an absolute speed claim or a
  pricing anchor. Your call; easy to add or skip.
- **Optional, not required:** `about.ts`'s "Teams Needing a Technical Partner" client-fit
  card could pick up a one-clause nod to integration work, same treatment as the hero —
  fine to leave for a later pass since it's not required for the services section to
  stand on its own.

## Implementation plan

With all three questions answered, I'll now: update `src/content/services.ts` (three
services as drafted), update `src/content/faq.ts` (item 6 rewritten, one new item added),
run the full gate suite (lint/build/test/e2e — confirming the schema updates automatically
and the prerendered output reflects the new copy), and open a PR on a new branch, matching
how every other content change in this project has shipped.
