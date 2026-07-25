---
target: homepage (/)
total_score: 28
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
timestamp: 2026-07-25T06-37-51Z
slug: src-routes-home-tsx
---
Method: dual-agent (A: general-purpose design review · B: general-purpose detector/browser evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | External links (`target="_blank"`) don't signal "opens in new tab" except the GitHub icon |
| 2 | Match System / Real World | 3 | Mono "system label" voice (`// what we do`) skews toward how an engineer sees the work, not necessarily the primary SMB-owner persona |
| 3 | User Control and Freedom | 4 | Mobile menu closes explicitly, FAQ items toggle independently, no traps |
| 4 | Consistency and Standards | 4 | Green primary action, card layout, and mono/display type roles are uniform throughout |
| 5 | Error Prevention | 3 | No forms to break, but nothing pre-empts a blocked Calendly popup or missing mail client |
| 6 | Recognition Rather Than Recall | 4 | "Book a Call" repeats identically at nav, hero, and footer |
| 7 | Flexibility and Efficiency | n/a | Single-path first-visit Persuade landing page; power-user shortcuts aren't meaningful here |
| 8 | Aesthetic and Minimalist Design | 4 | No stock photography or icon soup; every visual element reinforces one idea |
| 9 | Error Recovery | 3 | No error states on-page, but the Contact section offers no reassurance for a hesitant visitor |
| 10 | Help and Documentation | n/a | The 8-item FAQ is the appropriate help layer for a marketing page; dedicated docs would be over-engineering |
| **Total** | | **28/32** | **Good (87.5%)** |

## Design Specificity Verdict

**LLM assessment**: Authored, not templated. The eyebrow motif (`// what we do`), blinking-caret headline, dot-grid "blueprint" background, mono system-label treatment of the trust bar, and the specific credential set (18+ years, AWS & Azure, Fintech & Energy, <24h response) encode the "enterprise engineering discipline applied to SMB work" positioning directly into the visual language — a generic consultancy site could not use this unchanged. Copy is similarly specific (explicit template/page-builder rejection, "technical review and honest keep/replace assessment"). The one place specificity thins: the trust bar states credentials as bare stats without connecting them to why an SMB owner should care — the actual differentiation mechanism from PRODUCT.md ("the same person who built enterprise GitOps now builds your site") never makes it into homepage copy.

**Deterministic scan**: `detect.mjs` found exactly one finding — `codex-grid-background` (advisory/slop) on `src/components/hero.css:12`, flagging the dot-grid hero background as a recurring generated-UI pattern. Both sub-agents independently converged on this being a likely false positive: the CSS is explicitly commented as a "Blueprint layer: engineering grid + measurement dots," uses a radial mask to fade rather than tile flatly, is `aria-hidden`/`pointer-events: none`, and directly executes the project's own committed "Engineered Dark" brief (`docs/redesign/03-design-direction.md`). Worth a human glance, but not a rewrite target.

**Visual overlays**: No browser-injectable overlay ran — this environment has no live DOM-mutation/script-injection tool exposed, so the detector's browser-console pass was correctly skipped rather than faked (per the critique protocol's fallback rule). Assessment A did have screenshot access via Playwright and used it for the design review below (1440×900 and 390×844, multiple states); those are the visual evidence for this run, not a console overlay.

## Overall Impression

This is a genuinely well-crafted, on-brief marketing page — restrained, accessible by construction (not just by claim), and visually distinct in a way that matches the accepted "Engineered Dark" direction. The gut-check problem is that the page's best persuasion asset (the enterprise-background trust bar) and its most important moment (the final ask) both underperform: credentials are asserted without being connected to SMB value, and the lower-friction "Book a Call" path is missing from the exact section built to convert.

## What's Working

- **The hero is a real design bet.** Staggered rise-in animation gated behind `prefers-reduced-motion`, a blinking caret on "Websites," and the blueprint dot-grid create a distinct first impression a generic light/editorial direction would not have produced.
- **Accessibility gates are actually met, not just claimed.** Verified live: visible focus rings, 44px touch targets, a functional skip link, correct `aria-labelledby`/`aria-hidden` usage throughout.
- **Card/grid discipline.** All three service cards align to equal height regardless of copy length, and the shorter "Maintenance + Hosting" card's CTA still bottom-aligns with its longer siblings — a detail most templated sites get wrong.

## Priority Issues

**[P1] Primary CTA disappears at the moment of commitment**
- **Why it matters**: `src/components/contact.tsx` renders only the `mailto:` button in the closing Contact section — no "Book a Call" link, even though the accepted design brief states Calendly should appear "everywhere." This is the exact spot where a hesitant SMB owner decides whether to act, and the higher-friction path (compose a cold email) is the only one offered.
- **Fix**: Add a "Book a Call" button in `contact.tsx` alongside the email CTA, matching the nav/hero treatment — ideally as the visually primary action with email secondary, per the brief's stated hierarchy.
- **Suggested command**: `/impeccable clarify` (or a direct fix — this is a content/CTA-completeness issue, not a visual redesign)

**[P1] Trust bar asserts credentials without connecting them to the customer's problem**
- **Why it matters**: `trustItems` in `src/content/trust.ts` reads as bare labels ("AWS & Azure / Cloud Platforms," "Fintech & Energy / Enterprise Background"). PRODUCT.md's actual differentiation mechanism — the same person who built enterprise observability/GitOps now architects the client's site — never appears on the page. With no testimonials to lean on, this narrative bridge is the strongest available persuasion lever and it's currently implied, not stated.
- **Fix**: Add one sentence near the trust bar or hero sub-copy translating the stats into an SMB-relevant claim, e.g. "enterprise-grade engineering discipline, without agency overhead."
- **Suggested command**: `/impeccable clarify`

**[P2] FAQ is an unchunked wall of 8 items**
- **Why it matters**: `faq.ts`/`faq.tsx` render all 8 questions as one flat list mixing pricing, timeline, scope, takeover, and location — violating the ≤4-per-group chunking guideline right before the final ask, raising scan cost at the worst moment.
- **Fix**: Group into two labeled clusters (e.g. "Cost & Process" / "Fit & Logistics"), or reorder so the highest-value objections (cost, templates) lead.
- **Suggested command**: `/impeccable layout`

**[P3] External-link affordance is inconsistent**
- **Why it matters**: `nav.tsx`, `hero.tsx`, and `footer.tsx` all open Calendly/GitHub in a new tab, but only the GitHub icon carries an `aria-label` noting "(opens in new tab)." A visitor who clicks "Book a Call" and gets a silent new tab can lose their place.
- **Fix**: Add a consistent external-link indicator (icon or `aria-label` suffix) to every `target="_blank"` CTA, not just the social icon.
- **Suggested command**: `/impeccable harden`

**[P3] Hero eyebrow spends prime attention on founding year instead of a differentiator**
- **Why it matters**: The first line a visitor reads is `// software consulting — est. 2024` — the highest-attention real estate on the page, spent on category + founding year rather than a differentiator or credibility cue.
- **Fix**: Consider `// custom-built, not templated` or a comparable differentiator line.
- **Suggested command**: `/impeccable clarify`

## Persona Red Flags

**Jordan (First-Timer, arrives via search)**: Reads the hero and trust bar fine. Hits mild jargon friction at "Business Automation & Integrations" as a section *title* (the description underneath rescues it). Biggest red flag: reaches the closing "Ready to build something great?" section ready to act, and the only visible action is an email compose button — no scheduling widget in sight, so Jordan either scrolls back to nav to find "Book a Call" or defaults to the higher-friction path.

**Riley (Stress Tester)**: No horizontal scroll at 390px or 1440px; hero content and both CTAs stay within the fold on mobile. FAQ `<details>` elements open independently with no exclusivity bug. Red flag: the mobile hamburger menu is entirely React-state-driven with no `<noscript>` fallback — desktop nav links are `display:none` below 900px, so a slow-hydrating connection leaves mobile visitors with no way to reach About or Get in Touch.

**Casey (Mobile User)**: Touch targets check out (44px hamburger and nav links), trust bar reflows cleanly to a 2×2 grid, no observed jank. Red flag: hits the same Contact-section gap as Jordan, harder — composing a cold email on a phone keyboard is even less appealing than tapping a "Book a Call" button, and that button isn't offered where the ask actually happens.

## Minor Observations

- `process.css` has a dead `.step-connector { display: none; }` rule with the element still rendered in `process.tsx` — leftover from an earlier visual concept. Not user-visible, but worth deleting.
- Footer tagline ("Building digital ideas, one bit at a time.") appears only in the footer — a good non-redundant use of the brand line.
- The "Add-on subscription" badge on the Maintenance service card is an honest, low-friction way to clarify pricing structure without a full pricing table.
- Logo hover state (soft green/blue glow) is a nice, on-brand touch.

## Questions to Consider

1. If there are no testimonials yet, should the trust bar be doing more narrative work than four bare stats — is "18+ Years / AWS & Azure / Fintech & Energy / <24 Hours" actually persuasive to a small-business owner, or is it more persuasive to other engineers?
2. The brief mandates "Book a call everywhere" as the single primary CTA — why does the section literally about starting a project not include it?
3. Is the mono-label "Engineered Dark" aesthetic speaking to the primary persona (SMB owner) or is it more legible to the secondary personas (startup founders, technical teams) — and if the latter, is that a deliberate trade-off?
