# Website Redesign & Rebuild — Overview

**Status:** Accepted — all decisions confirmed 2026-07-07
**Date:** 2026-07-07

Bit and Byte Ideas is rebuilding its public website from the ground up: the Angular 20 SSR
application is replaced by a React 19 application scaffolded from the
[frontend-react-teamplate](https://github.com/bit-and-byte-ideas/frontend-react-teamplate)
repository, with a full visual redesign guided by the `frontend-design` and `ui-ux-pro-max`
skills.

## Goals

1. **Fresh start on the template's stack.** Vite + React 19 + TypeScript, pnpm, Vitest +
   Testing Library, ESLint flat config, commitlint + pre-commit gates, and the template's
   CI pattern — adopted wholesale, not piecemeal.
2. **A distinctive redesign.** Evolve the existing dark software-studio identity into
   something memorable, not templated. Direction, palette, and typography are specified in
   [03-design-direction.md](03-design-direction.md).
3. **Zero SEO regression.** The `docs/SEO/` action items represent real completed work
   (schema, llms.txt, robots, sitemap, meta/OG, prerendered HTML). The rebuild must reach
   parity before cutover — tracked in [04-content-ia-seo.md](04-content-ia-seo.md).
4. **Same conversion engine.** Calendly booking and direct email remain the two conversion
   paths; the page journey (discover → trust → book/contact) is preserved and sharpened.
5. **Keep what already works operationally.** Azure Static Web Apps hosting, Terraform
   infra, TechDocs, policy checks, Playwright e2e, and graphify stay.

## Non-Goals

- No backend API, authentication, or persisted user data.
- No CMS. Content stays in typed source modules.
- No new hosting platform. Azure SWA + existing Terraform remain untouched (only the
  deploy workflow's build steps and `app_location` change).

## Document Map

| Doc                                                | Covers                                                                                        |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [01-template-adoption.md](01-template-adoption.md) | Tool-by-tool inventory from the template; what carries over from this repo; what gets deleted |
| [02-architecture.md](02-architecture.md)           | React app structure, routing, prerendering/SEO strategy, content ownership, testing           |
| [03-design-direction.md](03-design-direction.md)   | Aesthetic direction, typography, palette, motion, accessibility gates                         |
| [04-content-ia-seo.md](04-content-ia-seo.md)       | Information architecture, page sections, SEO parity checklist                                 |
| [05-migration-roadmap.md](05-migration-roadmap.md) | Phased execution plan, PR-sized milestones, cutover and rollback                              |

## Key Decisions (recommendations — please confirm or veto)

| #   | Decision                      | Recommendation                                                                                                                                                        | Alternatives considered                                                                                                             |
| --- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Rebuild in-place vs. new repo | **In-place, on a long-lived `rebuild/react` branch.** Preserves git history, SEO docs, Terraform, TechDocs, graphify, and the SWA deployment token wiring.            | New repo from template (loses history and forces re-wiring infra, secrets, and Backstage catalog entry)                             |
| D2  | Design direction              | **Direction A: "Engineered Dark"** — evolve the current navy/slate + green/blue identity with new typography and stronger composition.                                | Direction B: light editorial theme (clean break, but discards brand equity and contradicts the documented brand direction) — see 03 |
| D3  | SEO-safe rendering            | **Static prerendering at build time** of all routes (`/`, `/about`, 404) so crawlers get full HTML, matching what Angular SSR provides today. Approach options in 02. | Pure SPA (SEO regression — rejected); full SSR server (over-engineered for a marketing site on SWA static hosting)                  |
| D4  | Package manager               | **pnpm via Corepack**, as the template mandates. CI and deploy workflows updated accordingly.                                                                         | Keep npm (diverges from template; user asked for all template tooling)                                                              |

## Decision Outcomes (2026-07-07)

All four decisions **accepted**, with amendments:

- **D1**: work happens on the existing `site-redesign` branch — no new branch created.
- **D2**: Direction A accepted, amended — **keep today's exact palette** (tokens recorded in
  03); typography and composition follow the `frontend-design` proposal (Bricolage
  Grotesque / Public Sans / IBM Plex Mono, approved).
- **D3**: React Router v7 framework mode with static prerender, accepted — output stays
  fully static for Azure SWA.
- **D4**: pnpm via Corepack, accepted.

Open-question resolutions: no Prettier (template ESLint-only formatting); ci.yaml follows
the template shape plus an e2e job; no blog yet; `/about` stays a separate route;
**no pricing anchors** — pricing is quoted per engagement, so SEO item M1 is closed as
won't-do; FAQ questions drafted in 04.

Corrections found during source review:

- `docs/SEO/` items are an **open backlog** (all unchecked), not completed work. The
  rebuild implements the on-site items rather than "preserving" them — reframed in 04.
- The Calendly inline embed is dead code (the booking component is not mounted anywhere);
  the live site links out to Calendly. The rebuild drops the embed and its
  render-blocking scripts entirely, which closes SEO items H4 and M7 as moot — see 02.
