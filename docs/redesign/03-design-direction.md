# 03 — Design Direction

**Status:** Accepted 2026-07-07 — Direction A with today's exact palette; fonts approved
**Inputs:** `frontend-design` skill (distinctive, intentional aesthetics) + `ui-ux-pro-max`
design-system generation and UX rule database.

## How the two skills were used

- `ui-ux-pro-max` generated a baseline system for "software consulting studio / small
  business services": **Hero-Centric + Trust** landing pattern, CTA above the fold,
  professional-blue palette with an urgency accent, and the CRITICAL/HIGH UX rule sets
  (accessibility, touch, performance) that become our QC gates.
- `frontend-design` pushes past that baseline: the generated Poppins/Open Sans +
  light-blue system is exactly the kind of templated default it warns against, and it
  contradicts the documented brand (dark navy/slate, green/blue accents, monospace
  technical labels). So: **structure and QC from ui-ux-pro-max, aesthetic conviction from
  frontend-design.**

## Direction A — "Engineered Dark" (recommended)

The site should feel like the inside of a well-run engineering studio: dark, precise,
quietly confident — a blueprint you'd trust with your business.

- **Concept**: the vernacular of software made visible to non-technical SMB owners.
  Monospace "system labels" (e.g. `// services`, `status: available`) as section eyebrows,
  hairline rules and measurement-mark details, terminal-green signals used _sparingly_ as
  proof-of-life accents. The one aesthetic risk: an oversized display headline treated
  typographically (mixed weight/width, a cursor-blink accent) instead of a stock hero
  illustration.
- **Palette** — _as accepted: today's exact palette, carried over verbatim from
  `src/styles.scss`:_
  - Background `#0f172a`, surface `#111827`, raised surface `#1a2440`
  - Accent green `#22c55e` (dim `rgba(34,197,94,.08)`, soft `#4ade80`) — CTAs, focus ring
  - Blue `#3b82f6` — secondary interactive; gradient `135deg #3b82f6 → #22c55e`
  - Text `#f8fafc` primary / `#64748b` muted; borders `rgba(100,116,139,.18)` and
    `rgba(34,197,94,.3)`; radius `4px`
  - Phase 2 review flag: muted text `#64748b` on `#0f172a` sits near the 4.5:1 threshold —
    verify per-usage and lighten where it fails the contrast gate.
- **Typography** (self-hosted, `font-display: swap`; no Inter/Roboto/Poppins):
  - Display: **Bricolage Grotesque** — characterful grotesk, reads crafted not corporate
  - Body: **Public Sans** — sturdy, neutral, excellent at 16px+
  - Mono: **IBM Plex Mono** — the brand's existing technical-label voice, formalized
- **Motion**: one orchestrated hero load (staggered reveals, 30–50ms steps), scroll-triggered
  section entrances via transform/opacity only, 150–300ms ease-out, everything gated by
  `prefers-reduced-motion`. No parallax, no scroll-jacking.
- **Texture**: subtle grid/blueprint background at low opacity in the hero, faint grain
  overlay on surfaces — atmosphere without noise.
  - **Amended 2026-07-25**: the tiled grid-line implementation was replaced on both hero
    surfaces (`src/components/hero.css`, `src/routes/about.css`) with a single brand-gradient
    ambient glow (`--gradient`, defined in the palette above but previously unused) plus one
    deliberate corner measurement mark. The project's design-review hook (`codex-grid-background`)
    flags hairline grid-line backgrounds tiled by a fixed pixel cell as a recurring generic
    generated-UI signature; the tiled implementation matched that signature closely enough to
    keep re-flagging on every pass. The "blueprint, atmosphere without noise" intent stands —
    the corner mark and grain overlay (`.hero::after`) still carry it — but the literal tiled
    grid is retired in favor of a treatment specific to this brand's own accent gradient.

## Direction B — "Studio Ledger" (alternative)

Light, editorial, print-inspired: warm off-white paper, near-black text, one saturated
accent, serif display type, ruled layout like a well-set proposal document. A genuinely
distinctive break — but it abandons the brand equity in the dark identity and the current
docs explicitly say not to introduce unrelated visual systems. Offered as a conscious
alternative if "start fresh" means the brand too. **Not recommended.**

## Layout & IA pattern (both directions)

From the ui-ux-pro-max landing baseline, adapted:

1. Hero — positioning statement + primary CTA (Book a call) + secondary (Explore services), above the fold
2. Trust strip — proof points immediately after the hero
3. Services — three lines, equal visual weight, each with a "what you get" outcome
4. Process — how an engagement runs (already a differentiator on the current site)
5. FAQ (SEO M2) — objection handling + FAQPage schema (pricing questions answered here:
   pricing is quoted per engagement — M1 closed as won't-do)
6. Contact — email path plus the external "Book a call" Calendly link
7. Footer

Single primary CTA per screen (ui-ux-pro-max `primary-action`): **Book a call** everywhere;
email is the persistent secondary. This resolves the current site's four competing CTAs
(noted in `docs/ux-content.md`).

## Non-negotiable QC gates (from ui-ux-pro-max CRITICAL/HIGH sets)

- Text contrast ≥ 4.5:1; visible focus rings; sequential heading hierarchy; skip link
- Touch targets ≥ 44×44px with ≥ 8px spacing; `cursor: pointer` on interactive elements
- SVG icons only (Lucide), one stroke width — no emoji icons
- CLS < 0.1: explicit image dimensions, `font-display: swap`
- Mobile-first at 375 / 768 / 1024 / 1440; no horizontal scroll; body text ≥ 16px
- `prefers-reduced-motion` honored on every animation
- Semantic color tokens in `design/tokens.css` — no raw hex in components

## Resolved questions (2026-07-07)

1. Direction A accepted, with today's exact palette (see above).
2. Logo stays as-is; refresh out of scope.
3. Fonts approved: Bricolage Grotesque / Public Sans / IBM Plex Mono, replacing the
   current Syne / Plus Jakarta Sans / DM Mono — self-hosted instead of Google Fonts CDN.
