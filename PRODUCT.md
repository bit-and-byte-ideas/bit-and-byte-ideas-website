# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: small businesses and local service providers who need a professional web
presence that actually converts — not a template site that looks like everyone else.

Secondary, weighted equally with each other but behind the primary segment:

- Startups and founders who need cloud infrastructure and CI/CD done right from day
  one, before architecture mistakes become expensive.
- Teams with an existing product or codebase who need engineering horsepower —
  a new feature, a cloud migration, or improved developer experience — working
  alongside their own team.

## Product Purpose

Bit & Byte Ideas builds and runs the websites and software small businesses need to
grow, so the owner never has to think about the technical side. It designs custom
websites, builds the software behind them (applications, automation between the tools
a business already uses), and then keeps what it built running (hosting, security
patches, monitoring) on a monthly care plan. Most clients start with a website because
it is familiar; a client can also start with automation or a custom build. It exists to bring enterprise-grade
engineering discipline to businesses too small to justify a large agency.

Success is a client whose site converts, whose systems talk to each other without
manual re-entry, and who never has to think about hosting, security, or backups
because it's handled.

## Positioning

Senior, enterprise-caliber engineering (18+ years across fintech and energy,
platform/SRE/DevOps leadership) applied directly to SMB-scale projects, without
agency overhead or template output. The mechanism a template-site competitor or a
generic dev shop can't truthfully copy: every engagement is custom-built and
quoted individually, and the same person who built the enterprise observability
and GitOps practices is the one architecting the client's site.

## Operating Context

- Engagement starts with a free 30-minute Calendly consultation
  (calendly.com/carlos-barajas-bitandbyteideas/30min); every project is quoted
  individually afterward — no published pricing anchors.
- Two conversion paths: book a call via Calendly, or email
  info@bitandbyteideas.com directly. Response time is within 24 hours /
  one business day.
- Fully remote delivery; studio is based in San Diego, CA, serving clients
  across the United States.
- Post-launch, most clients move into the Maintenance + Hosting monthly
  subscription rather than a one-off handoff.
- Can take over an existing site or codebase: starts with a technical review
  and an honest keep/replace assessment.

## Capabilities and Constraints

- Three service lines: (1) website & application development — from marketing
  sites to full applications with auth, dashboards, and business logic;
  (2) business automation & integrations — connecting existing tools (CRM,
  invoicing, forms, e-commerce, email) and building custom API integrations
  where no off-the-shelf connector exists; (3) maintenance + hosting — the
  monthly care plan covering managed hosting, backups, security patches, and
  monitoring. It is the ongoing relationship, not an add-on.
- Ownership: the client owns their website. Software built for a client stays the
  studio's and is licensed to the client under their plan, with an option to buy it
  outright. On cancellation the license ends, with a data export and transition
  support where it applies. This is stated openly to prospects: reuse across clients
  is what lowers their cost over time.
- Bilingual English/Spanish websites are offered for businesses with
  Spanish-speaking customers. The offer is bilingual sites only; do not imply
  Spanish-language sales or support.
- No CMS — all site copy lives in typed content modules (`src/content/`), not
  an editable backend.
- No backend API, authentication, or persisted user data on the marketing site
  itself; it is a fully static, prerendered build (Vite + React Router v8,
  served from Azure Static Web Apps).
- No blog currently; `/about` is a separate route from the homepage.
- No published pricing tiers or ranges — pricing is always quoted per
  engagement (a deliberate decision, not a gap to fill in later).

## Brand Commitments

- Name: "Bit & Byte Ideas." Tagline: "Building digital ideas, one bit at a time."
- Founder: Carlos Barajas (Founder & Engineer), the sole person doing the work
  today. Site copy deliberately uses "we" as studio voice rather than "I" —
  preserve this plural voice in future copy; it is not a claim of a larger team.
- Visual identity ("Engineered Dark" — dark navy/slate with green/blue accents,
  Bricolage Grotesque / Public Sans / IBM Plex Mono) is an existing, confirmed
  direction recorded in `docs/ux-content.md` and
  `src/design/tokens.css`. This file records product truth only — the visual
  system itself belongs in DESIGN.md, not here.

## Evidence on Hand

- Founder bio and a 4-item trust bar (18+ years building software, AWS & Azure,
  fintech & energy background, < 24 hour response time) in
  `src/content/trust.ts` and `src/content/about.ts`.
- A 10-question FAQ addressing pricing, timelines, templates, post-launch,
  ownership, bilingual sites, takeovers, and automation, in `src/content/faq.ts`.
- Named client work in `src/content/work.ts` (shown on `/about`). Only clients the
  founder has cleared for public naming appear there, described only by facts visible
  on their live site.
- No client testimonials, case studies, logos, or press mentions exist yet —
  future work must not fabricate these.

## Product Principles

1. Custom over templated — every website, and every page of this site, is
   designed for the specific brand and customer, never generic or page-builder output.
   This claim is about website design; software may be reused across clients (see
   Ownership above).
2. Enterprise discipline, SMB accessibility — the same rigor (TDD, CI/CD,
   observability, IaC) the founder brought to fintech/energy platforms, applied
   without agency overhead or pricing opacity.
3. Two conversion paths, kept simple — Calendly booking and direct email are
   the entire funnel; do not add friction or additional paths without cause.
4. Relationship extends past launch — the maintenance/hosting subscription is
   a core part of the offering, not an upsell afterthought.
5. Honest scope over misleading ranges — no published pricing, because
   accurate individual quotes are preferred over numbers that don't hold up.

## Accessibility & Inclusion

No specific standard or user need has been confirmed beyond general good
practice (semantic HTML, keyboard navigation, sufficient contrast). No binding
requirement (e.g., WCAG level) is recorded.
