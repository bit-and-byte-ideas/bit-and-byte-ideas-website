# WP-08: Homepage selected-work section and navigation

## Purpose and scope

Connect the new areas to the existing site: a featured-work section on the homepage, and
"Work" and "Blog" links in the desktop nav, mobile menu, and footer. Links appear only
when the collection has published content (D-013). Everything that exists today keeps
its labels, URLs, anchors, and behavior.

## Prerequisites

WP-02 (mobile menu works in production), WP-05, and WP-06 done. BRIEF Q7 default in
effect unless answered.

## Read first

- `docs/website/DESIGN.md` "Navigation (proposed)", "Layouts" (homepage section);
  `docs/website/DECISIONS.md` D-013, D-014; `docs/website/AUDIT.md` "Design baseline"
  (nav, conversion paths)
- `src/components/nav.tsx` + `nav.css` + `nav.test.tsx`, `src/components/footer.tsx` +
  `footer.css` + `footer.test.tsx`, `src/routes/home.tsx`, `src/components/services.css`
  (section rhythm), `e2e/homepage.spec.ts`, `e2e/journey.spec.ts`,
  `src/content/collections/paths.ts`, `vite.config.ts`, `src/root.tsx`
- Skills: `impeccable` in **Persuade** mode for the homepage section

## Relevant decisions

D-013 (content-driven links), D-014 (placement), D-002.

## Implementation areas

| Path | Deliverable |
| --- | --- |
| Content-presence signal | Choose and record in DECISIONS: (a) a Vite `define` constant (for example `__CONTENT_NAV__ = { work: boolean, blog: boolean }`) computed in `vite.config.ts` with the WP-03 lister and declared in a `.d.ts`; or (b) a root `loader`. Prefer (a) unless it fails in tests or HMR; record why |
| `src/routes/home.tsx` | Loader returning up to 3 featured project summaries; renders `FeaturedWork` between `<Services />` and `<Process />` only when non-empty |
| `src/components/featured-work.tsx` (+ `.css`, test) | `section` labelled by its heading (no new anchor id). `.section-label` "selected work", heading from `src/content/work-page.ts`, lead row plus pair layout, "View all work" link to `/work` |
| `src/components/nav.tsx` | Desktop and mobile lists gain `NavLink`s "Work" (`/work`) and "Blog" (`/blog`) after "Services", gated by the signal; active state on nested paths |
| `src/components/footer.tsx` | Same two links after "Services", gated |
| `src/components/nav.css` | Only if the 900px measurement fails: raise the desktop breakpoint (both the `.nav-links` and `.hamburger` rules) and record it in DECISIONS |
| Tests | `nav.test.tsx` and `footer.test.tsx`: with and without each flag. `e2e/homepage.spec.ts`: existing assertions unchanged; new spec for the featured section and nav links with fixtures |

## Acceptance criteria

- **AC-1** With no published content (production build today), the nav, mobile menu,
  footer, and homepage markup is identical to before this package (compare prerendered
  `index.html` minus build hashes), and every existing e2e test passes unmodified.
- **AC-2** With fixtures in dev: "Work" and "Blog" appear after "Services" in the desktop
  nav, mobile menu, and footer; they are active (`nav-active`) on `/work`, `/work/<slug>`,
  `/blog`, and `/blog/<slug>`; order and labels of existing items are unchanged.
- **AC-3** The homepage shows the featured fixture projects in rank order between
  Services and Process. Removing all `featured` values removes the section entirely
  (no empty heading).
- **AC-4** At widths 900, 1024, 1280, and 1440 the desktop nav fits on one line with no
  overlap (measured: `scrollWidth` ≤ container width, item tops equal). If the
  breakpoint moved, the change is recorded in DECISIONS.
- **AC-5 (built harness)** At 375×812 under the production CSP, the mobile menu opens,
  shows Work and Blog (fixture build), navigates, and closes. Escape returns focus to the
  toggle.
- **AC-6** Anchors `#services`, `#process`, `#faq`, and `#contact`, the Calendly URL, and
  the email link are unchanged (existing e2e plus a targeted check).
- **AC-7** Screenshots of the homepage section and nav at 375, 900, and 1440 in
  `docs/website/evidence/<date>-wp08-integration/`.
- **AC-8** `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e`,
  and `pnpm test:e2e:built` pass.

## Verification

```bash
# before editing:
pnpm build && cp build/client/index.html docs/website/evidence/<date>-wp08-integration/index.before.html
# after editing:
pnpm build && cp build/client/index.html docs/website/evidence/<date>-wp08-integration/index.after.html
diff <(sed -E 's/-[A-Za-z0-9_]{8}\.(js|css)/.\1/g' docs/website/evidence/<date>-wp08-integration/index.before.html) \
     <(sed -E 's/-[A-Za-z0-9_]{8}\.(js|css)/.\1/g' docs/website/evidence/<date>-wp08-integration/index.after.html)
pnpm test && pnpm lint && pnpm typecheck
pnpm test:e2e
CONTENT_FIXTURES=1 pnpm build && pnpm test:e2e:built
pnpm build && pnpm test:e2e:built
graphify update .
```

Replace `<date>` with the session date. If the externalized inline-script file names
(WP-02) change with content, normalize them in the diff the same way.

## Exclusions

No restyling of the hero, services, process, FAQ, or contact sections. No changes to
`/about` or `/connect` (BRIEF Q6). No label renames, no removal of "Get in Touch", no new
CTA labels.

## Prompt

```text
Continue the Bit & Byte Ideas website extension. Read CLAUDE.md, then
docs/website/README.md, docs/website/MANIFEST.yaml, and docs/website/HANDOFF.md; check
git branch/status and reconcile the docs with the repository. Then complete WP-08 using
docs/website/tasks/WP-08-homepage-and-navigation.md. Save the pre-change prerendered
index.html first so you can prove existing markup is unchanged when there is no content.
Set WP-08 to in_progress before editing code, checkpoint the manifest, VALIDATION.md,
and HANDOFF.md after each milestone, and mark it done only when every acceptance
criterion passes. Do not commit, push, or deploy unless I ask.
```
