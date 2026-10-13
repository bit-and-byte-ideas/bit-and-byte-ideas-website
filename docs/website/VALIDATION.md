# Validation log

Append a section per session, newest last. Every check is **passed**, **failed**, or
**not run** (with the reason). Link evidence. Never record a claim without the check
behind it.

---

## Session 2026-10-12 (WP-01)

Environment: macOS (Darwin 27.2), Node 24.14.1, pnpm 11.6.0, Chrome via Claude in Chrome,
Playwright 1.62.1 (chromium). Branch `site-improvements` at `4074b5e` (same as `main`).

### Repository checks

| Check | Result | Detail |
| --- | --- | --- |
| `pnpm lint` | passed | Exit 0. pnpm 11 first re-synced a stale `node_modules` from the lockfile (no tracked files changed) |
| `pnpm typecheck` | passed | Exit 0 |
| `pnpm test` | passed | 7 files, 27 tests |
| `pnpm build` | passed | Prerendered `/`, `/about`, `/connect`, `/404` + SPA fallback; `sitemap.xml` with 3 routes, `lastmod 2026-10-13` (UTC date while local date was 2026-10-12) |
| `pnpm test:e2e` | passed | 20/20 against `pnpm dev`, including "mobile menu opens, navigates, and closes" (which fails in production; see below) |
| `pnpm preview` | not run | Not needed; built output was served with `python3 -m http.server` instead |
| Executable inline scripts in `build/client/index.html` | 8 found | Node one-liner from WP-02 verification. `/about` and `/404` have the same 8 |

### Live site (https://www.bitandbyteideas.com)

| Check | Result | Detail |
| --- | --- | --- |
| Headers (`curl -D -`) | observed | Apex and www return 200; CSP `script-src 'self'` (no `'unsafe-inline'`); `x-frame-options: DENY` |
| Proposed routes free | passed | `/blog`, `/work`, `/portfolio`, `/projects` return 404 |
| Live vs local content | passed | Visible text identical on `/`, `/about`, `/connect` (diff ratio 1.0); same asset hashes; live sitemap `lastmod` 2026-08-04 |
| Live hydration (Chrome) | **failed** | `window.__reactRouterContext` undefined; hamburger has no React props; a click leaves `aria-expanded="false"`; nav never gets `scrolled`. Chrome window resize had no effect (viewport stayed 1920px), so the menu was tested with a programmatic click |
| Control: same build, no headers | passed | `python3 -m http.server` on `build/client`: hydrated, menu toggles |
| Playwright CSP reproduction | **failed (as expected)** | With the production CSP header injected: 8 CSP violations, no router context, menu stays closed. Without it: 0 violations, menu opens. `evidence/2026-10-12-wp01-baseline/baseline-report.json` → `csp`, `csp-enforced-mobile-menu.png`, `csp-absent-mobile-menu.png` |

### Layout and semantics probes (built output, Playwright)

Screenshots: `evidence/2026-10-12-wp01-baseline/{home,about,connect,404}-{mobile,tablet,desktop}.png`
(375×812, 768×1024, 1440×900 full page).

| Check | Result | Detail |
| --- | --- | --- |
| Images missing `width`/`height` | passed | 0 on all pages and viewports |
| Images missing `alt` | passed | 0 |
| Touch targets < 44px in both dimensions | passed | 0 |
| Horizontal overflow | passed with note | Only `/` at 375px: `scrollWidth` 380 (trust-strip items and the decorative hero icon). `body { overflow-x: hidden }` masks it; `scrollX` stays 0. Logged as AUDIT K7 |
| Raw color literals in component/route CSS | observed | 20 occurrences in 6 files (`grep -nE '#[0-9a-fA-F]{3,8}\b\|rgba?\('`). AUDIT K9 |

### Documentation checks

| Check | Result | Detail |
| --- | --- | --- |
| `MANIFEST.yaml` parses; required keys; dependencies valid; ready/todo consistent with dependencies | passed | Python + PyYAML script (see session transcript); 11 tasks |
| mkdocs nav paths exist | failed (pre-existing) | 6 missing `redesign/*.md` (AUDIT K3, WP-11) |
| Stale `docs/redesign` / `docs/SEO` references | failed (pre-existing) | 12 references in 10 files before this session; 14 after, because the new `CLAUDE.md`/`AGENTS.md` pointer names the removed folder on purpose (WP-11 removes that sentence) |
| Relative links and anchors across `docs/website/**/*.md`; manifest evidence paths | passed | 22 Markdown files, 0 broken links or anchors |
| `pnpm lint` after adding docs (covers `evidence/…/capture-baseline.mjs`) | passed | Exit 0 |
| `CLAUDE.md` / `AGENTS.md` changes | passed | `git diff --stat`: 9 added lines each, 0 removed. Existing instructions untouched (AC-5) |
| React Router 8.3 prerender API (function form, `ssr:false` loader rules, resource-route prerendering, `getStaticPaths`) | verified by reading source | `node_modules/.pnpm/@react-router+dev@8.3.0…/dist/vite.js` and `config-*.d.ts` |

### Not run

- Accessibility tooling (axe, Lighthouse): not installed; planned in WP-09.
- Performance measurement: none; no performance claims are made.
- WebKit, Firefox, and real devices: not run.
- `graphify update .`: not run. Only docs changed, and graphify indexes `src/` only.
- impeccable `context.mjs` and detector: not run. No UI changes this session.
- pre-commit hooks: not run (no commit was made).

### Outstanding failures

- AUDIT K1 (production hydration blocked by CSP): owned by WP-02.
- AUDIT K3 (stale references, mkdocs nav): owned by WP-11.

---

## Session 2026-10-12 (WP-02)

Environment as above. Branch `site-improvements` at `4074b5e` plus working-tree changes.
Carlos answered BRIEF Q1 (no outside retexture; D-023) and Q2 (fix it with the CSP
string unchanged; D-024). Evidence: `evidence/2026-10-12-wp02-csp/`.

### Acceptance criteria

| AC | Result | Evidence |
| --- | --- | --- |
| AC-1 No executable inline scripts in `build/client/**/*.html`; build fails otherwise | passed | `pnpm build` moved 36 scripts from 5 pages into 13 files. An independent regex count across all HTML gives 0. `node scripts/externalize-inline-scripts.mjs --check` exits 1 on an unfixed build ("36 executable inline script(s) remain in: 404/index.html, …") and 0 on the fixed one (`guard-and-sizes.txt`) |
| AC-2 `pnpm test:e2e:built` under the production CSP | passed | 17/17 chromium (`e2e-built-after.txt`). Same suite on an unfixed build: 13 failed / 4 passed (`e2e-built-before.txt`), so the tests detect K1 |
| AC-3 `public/staticwebapp.config.json` unchanged | passed | `git diff --exit-code` exit 0 (`gates.txt`) |
| AC-4 lint, typecheck, test, build, test:e2e | passed | Exit 0 each; unit 27/27; dev e2e 20/20 (`gates.txt`) |
| AC-5 CI runs the suite; CSP docs accurate | passed (CI not executed) | `ci.yaml` e2e job: Build → `pnpm test:e2e:built` (YAML parses). `docs/quality-operations.md` Security/Testing/CI rewritten. CI itself was not run (nothing pushed) |
| AC-6 Before/after evidence | passed | `before.json` (hydrated false, 8 violations, menu stays closed), `after.json` (hydrated true, 0 violations, menu open), `before-mobile-menu.png`, `after-mobile-menu.png` |

### Other checks

| Check | Result | Detail |
| --- | --- | --- |
| Idempotence | passed | Re-running the externalize step on a processed build moves 0 scripts |
| Payload cost | observed | 8 small script requests per page, 3,624 bytes in total across 13 files. Seven are shared by every page (cacheable); one per page lists that route's modules (`guard-and-sizes.txt`) |
| WebKit (Desktop Safari) | passed | 17/17 (`e2e-built-webkit.txt`); temporary config deleted afterwards |
| Firefox | not run | Playwright's Firefox could not launch here (`sandbox_extension_issue_file_to_process … Operation not permitted`, launch timeout). An environment limitation, not a test result |
| Test-harness bug found and fixed | note | The first hydration probe used `getByRole` on the hamburger, which is `display: none` on desktop, so desktop tests timed out even after the fix. Fixed with `includeHidden: true`, then the before/after runs were redone with the corrected suite |
| `graphify update .` | not completed | graphify refused to overwrite `graph.json` (new scan 796 nodes vs 2,900 existing) and suggested `--force`. Not forced, to avoid discarding the shared graph; `graph.json` unchanged. Carlos may want to run `graphify update . --force` or a full rebuild deliberately |
| Production verification | not run | Not deployed (out of scope). The live site stays broken until the change is released |

### Outstanding

- AUDIT K1 fixed in the repository only; needs commit, merge, and release.
- AUDIT K3/K4 remain (WP-11).

---

## Session 2026-10-12 (WP-03)

Branch `site-improvements` at `4074b5e` plus working tree (WP-01/WP-02 still uncommitted).
Evidence: `evidence/2026-10-12-wp03-content/`.

### Acceptance criteria

| AC | Result | Evidence |
| --- | --- | --- |
| AC-1 `pnpm content:check` exits 0 and prints counts per collection and mode | passed | `gates.txt`: 8 sources; work 4 valid (production 0, fixtures 3, development 4); blog likewise; 0 issues |
| AC-2 A failing-case test with the expected message for every rule | passed | `validate.server.test.ts` (45 tests): every rule listed in the task, plus unknown fields, impossible dates, non-https URLs, name/screenshot scopes, cover count, future dates, misplaced files, missing frontmatter, duplicate keys, comments, external images, unsupported languages, protocol-relative links, footnotes, extra sections. "slug ≠ folder" is covered as "a `slug` field is rejected", because the schema has no slug field (the folder is the slug) |
| AC-3 Build-mode filtering | passed | `filter.test.ts`: production/fixtures/development × published/draft/fixture/draft-fixture/scheduled, same-day publishing, mode detection |
| AC-4 Sanitizer strips script, iframe, event handlers, style, unsafe URLs | passed | `markdown.server.test.ts`: checked on the hast tree and on the HTML React renders from it via `hast-util-to-jsx-runtime` (javascript:, data:, vbscript:) |
| AC-5 Heading ids, TOC, reading time, related ranking | passed | `markdown.server.test.ts`, `derived.test.ts`, `fixtures.test.ts` (real fixtures: long article has 5 H2s and a TOC, short has none, related ranks `fixture-related-article` then `fixture-short-article`) |
| AC-6 Post-build guard runs and is proven to fail | passed | `build-guard.txt`: production and fixture builds pass; a planted fixture title/draft URL fails the production check (exit 1); a planted draft URL fails the fixture check (exit 1); an invalid temporary article fails with 3 precise messages (exit 1). Unit-tested in `build-guard.test.ts` |
| AC-7 Existing checks pass; no existing test weakened | passed | lint 0, typecheck 0, unit 125/125 (27 existing unchanged + 98 new), dev e2e 20/20, built e2e 17/17 (`gates.txt`) |
| AC-8 `pnpm audit` recorded; no high/critical in new packages | passed | `e2e-and-audit.txt`: `--prod` clean; full audit 18 (3 low, 9 moderate, 6 high), none through a WP-03 package; identical at `HEAD` (pre-existing dev tooling, AUDIT K15) |

### Other checks

| Check | Result | Detail |
| --- | --- | --- |
| Client bundle free of parser/validation code | passed | No `micromark`, `unified`, `ZodError`, `lowlight`, `highlight.js`, or `github-slugger` in `build/client/assets/*.js` (no route imports content yet; re-check in WP-05/06) |
| Node type stripping for `scripts/*.ts` | passed | Node 24.14.1 runs them with no flags or warnings; `tsconfig.node.json` type-checks them |
| Bug found by tests | fixed | Reading time counted stray punctuation (`.` after inline code) as a word; tokens now need a letter or digit |
| Fixture images | observed | 6 placeholder PNGs, 408 KB total (first version with hatching was about 1.6 MB; switched to a solid fill) |
| `graphify update .` | not completed | Refused again (1,067 vs 2,900 nodes, asks for `--force`); not forced; `graph.json` unchanged |
| Firefox | not run | Same sandbox limitation as WP-02 |

### Notes

- "Reject a duplicate frontmatter block" from the task is implemented as rejecting
  duplicate YAML keys. A second `---` block in the body is indistinguishable from a
  Markdown thematic break.
- Cross-field rules report only after field-level errors are fixed (zod behavior),
  documented in CONTENT.md.

---

## Session 2026-10-12 (WP-04)

Branch `site-improvements` at `4074b5e` plus working tree (WP-01 to WP-03 still
uncommitted). Evidence: `evidence/2026-10-12-wp04-images/`.

### Acceptance criteria

| AC | Result | Evidence |
| --- | --- | --- |
| AC-1 Variants for every fixture image; a second run changes nothing | passed | First run: 6 images, 26 widths × 2 formats + 4 share images, 4.5 s. Second run: "0 generated, 6 unchanged, manifest unchanged"; shasums of all 56 outputs, the manifest, and its mtime identical before and after (`gates.txt`; the before/after diff was run in-session) |
| AC-2 Variants ≤ source width; AVIF + WebP per width; covers have 1200×630 JPEG; manifest dimensions match files (test) | passed | `media.test.ts` "committed variants for fixtures": every file's real dimensions read with an independent header parser match the manifest and sharp's output info; `size-report.md` |
| AC-3 `content:check` fails with a fix hint when an image is missing from the manifest or its source changed | passed | Unit tests (missing, stale, missing generated file, body images). Live: before generation all 6 images failed with "has no generated variants … run pnpm content:images"; overwriting `diagram.png` gave "changed since its variants were generated; run pnpm content:images" from both `content:check` and `content:images --check`; restored byte-for-byte (`stale-source-check.txt`) |
| AC-4 `ResponsiveImage`: picture with both sources, img alt/width/height/sizes, loading by priority; missing alt is a type error | passed | `responsive-image.test.tsx` (5), `screenshot-frame.test.tsx` (5). Making `alt` optional fails `pnpm typecheck` with "Unused '@ts-expect-error' directive"; restored |
| AC-5 `pnpm build` does not invoke sharp | passed | `build-without-sharp.txt`: with a Node resolve hook (`block-sharp.mjs`) that makes `require('sharp')` and `import('sharp')` throw, `pnpm build`, `pnpm test` (142/142 at that point), and `pnpm content:check` all pass. Note: the type-check reads sharp's `.d.ts` (the package must be installed; its native binary need not be). An earlier attempt that hid the package folder was invalid (sharp still resolved), and its result was discarded |
| AC-6 Size report in evidence | passed | `size-report.md`: AVIF 383 KB, WebP 579 KB, OG 122 KB for the six fixture placeholders (not representative of real screenshots) |
| AC-7 lint, typecheck, test, build, test:e2e pass; audit recorded for sharp | passed | `gates.txt`: lint 0, typecheck 0, unit 152/152, fixture and production builds 0, dev e2e 20/20, built e2e 17/17. `audit.txt`: `--prod` clean; no advisory involves sharp or `@img/*`; the same 18 pre-existing dev-tool advisories (K15) |

### Other checks

| Check | Result | Detail |
| --- | --- | --- |
| Build media pruning | passed | Production build removes all 4 fixture media folders; fixture build keeps the 4 with images; a planted folder fails the guard (`build-media.txt`) |
| Capture helper | passed | Captured this site's own local build (not a customer site) to the scratchpad: desktop 2880×1800, mobile 1170×2532; refusals for overwrite, fixtures target, missing entry, non-http URL, bad name (`capture-helper.txt`) |
| Frame rendering | passed | `frames-desktop.png`, `frames-mobile.png`: crop ratio exactly 1.600, AVIF chosen, 1200w at desktop and 480w at 375px for the given `sizes`, no overflow (`preview-frames.txt`) |
| Design hook (impeccable) | 1 false positive | Flagged `media.ts:58` ("broken image"); it is the `src: string` field of a TypeScript interface. Left unchanged and not suppressed |
| Bugs found and fixed | fixed | `content:images --check` also listed a stale image's outputs as strays; type error in a test helper caught by `tsc` |
| `graphify update .` | not completed | Still refuses to overwrite without `--force`; not forced |
| Real customer sites | not captured | Per instructions |

---

## Session 2026-10-12 (WP-05)

Branch `site-improvements` at `4074b5e` plus working tree (WP-01 to WP-04 still
uncommitted). Evidence: `evidence/2026-10-12-wp05-work/`.

### Acceptance criteria

| AC | Result | Evidence |
| --- | --- | --- |
| AC-1 Dev: index lists fixtures in order with cover, kind label, title link, summary, industry; draft banner | passed | `e2e/work.spec.ts` (order: featured 101, 102, then concept 2026-06, then draft); draft page shows `role="note"` with `data-content-status="draft"`; index rows show a Draft/Fixture tag |
| AC-2 Project page fields, four H2 sections, outcomes without evidence, gallery alt text; concept shows "Concept" and no outcomes | passed | `e2e/work.spec.ts`; `work-view.test.ts` proves evidence and approval records never leave the loader |
| AC-3 Every project page ends with Book a Call (Calendly, new tab) and Get in Touch (`/#contact`) | passed | `e2e/work.spec.ts`, `work-components.test.tsx` (CtaBand) |
| AC-4 Production build: `/work` empty state with `noindex`, no fixture pages, guard passes | passed | `gates.txt`; `e2e/built/work.spec.ts` production block; `production-work-*.png` at 4 widths |
| AC-5 Fixture build: direct load and refresh 200; unknown and draft slugs 404 with the branded page after hydration; client navigation index → project → back | passed | `e2e/built/work.spec.ts` fixture block (21 passed). First attempt failed: with a `work/:slug` route the 404 page failed hydration ("No result found for routeId") and showed "Something went wrong" (reproduced in dev and built). Fixed with static per-entry routes (D-034); unknown slugs also work in dev now |
| AC-6 Keyboard order and visible focus; one H1; no skipped levels; card targets ≥ 44px | passed | `e2e/work.spec.ts` (tab order through the 4 project links, `::after` focus outline solid; mouse click on the screenshot centre opens the project; heading sequence); probes in `*-report.json` (no undersized targets) |
| AC-7 Screenshots at 375/768/1024/1440 for index, project, empty state; no overflow | passed | `fixtures-*.png` (index, client and concept projects), `production-work-*.png` (empty state); `fixtures-report.json`, `production-report.json`: `scrollWidth` never exceeds the viewport |
| AC-8 No raw colors added; only DESIGN.md tokens | passed with note | No hex/rgba in new CSS (`grep`). Tokens added: `--measure-prose`, `--text-prose`, `--leading-prose` (planned) and `--text-3xl` (not in the original plan; DESIGN.md updated to record it) |
| AC-9 lint, typecheck, test, build, test:e2e, test:e2e:built pass; existing pages visually unchanged | passed | `gates.txt`; `regression/compare.txt`: 0 differing pixels for home, about, connect, 404 at 375/768/1440 against the WP-01 baseline; 404 markup identical without scripts |

### Other checks and notes

| Check | Result | Detail |
| --- | --- | --- |
| Production build with zero content | passed | First version failed ("Invalid route exports … ssr:false") because a loader route had no prerendered path; the static-route design registers no detail route until an entry exists |
| `NODE_ENV` during config evaluation | verified | `development` under `react-router dev`, `production` under `react-router build` (probe), so routes and loaders share one mode |
| Client JS | passed | No parser code in assets; `work-project` chunk 11.6 KB gzip, `work-index` 1.0 KB |
| `.data` MIME | passed (locally) | `text/x-script` via `staticwebapp.config.json` `mimeTypes` (D-033); Azure behavior to confirm on the dev URL (WP-10) |
| Visual fixes from inspection | fixed | Header glow seam (masked); missing spaces in flex links (gap); detached next-project arrow (inline + nbsp). Footer has the same flex-spacing quirk (AUDIT K16, logged) |
| impeccable process | adapted | Context loaded, new-work and craft-floor read, direction contract in `work-project.tsx`, surface brief written. Not done: the question round (DESIGN.md already decided layout), image comps (would bill the user's OpenAI key), and the finish-review subagent (no such agent type here, and agents weren't requested); a fresh in-thread review against the contract found no further material gaps |
| Design hook | 1 false positive | `body-images.ts:8` "broken image" is a doc comment; unchanged, not suppressed |
| CI | updated, not run | e2e job now also runs the built suite against a fixture build |
| `graphify update .` | not completed | Still refuses without `--force` |

## Session 2026-10-12 (WP-06)

Branch `site-improvements` at `4074b5e` plus working tree (WP-01 to WP-05 still
uncommitted). Evidence: `evidence/2026-10-12-wp06-blog/`.

### Acceptance criteria

| AC | Result | Evidence |
| --- | --- | --- |
| AC-1 Dev: index newest first with H2 title link, description, `<time datetime>`, reading time, tags; draft page shows the Draft banner | passed | `e2e/blog.spec.ts` (order short 2026-03-01, related 2026-02-10, long 2026-01-15, then the undated draft with a Draft tag; row contents; draft banner `role="note"` `data-content-status="draft"`) |
| AC-2 One H1, description, byline "Carlos Barajas" → `/about`, published date, "Updated" only when set, D-020 reading time, tags as text | passed | `e2e/blog.spec.ts` (long has published + updated; short has no "Updated"; reading time matches the index); `routes/blog-routes.test.ts` checks the loader's minutes equal `readingMinutes(countWords(body))` |
| AC-3 Long fixture TOC (`nav` "On this page") lands headings below the fixed nav; short fixture has none | passed | Dev: rail links in order, `#a-table` settles at 96px under the 72px nav; at 375px the TOC is a collapsed disclosure. Built: a click made before hydration (scripts held back 900ms) still lands correctly (`e2e/built/blog.spec.ts`). Short fixture: no TOC. Note below on a dev-only race |
| AC-4 `pre` focusable, named with its language, scrolls horizontally without page overflow, class-based highlighting, no `style` attributes; syntax tokens ≥ 4.5:1 on `--surface-code` | passed | `e2e/blog.spec.ts` (TypeScript/Go/Text names, `tabindex="0"`, `.hljs-keyword` spans, `main [style]` count 0, the text block's `scrollWidth > clientWidth`, ArrowRight scrolls it, page `scrollWidth ≤ innerWidth` at 375px); `syntax-contrast.txt` (lowest 6.61:1) |
| AC-5 Underlined links; lists, blockquote, focusable table container, captioned figure; body ≥ 16px at 375px; line length ≤ `--measure-prose` | passed with note | `e2e/blog.spec.ts`; probes in `fixtures-report.json` (prose 17px, column width ≤ computed max-width at every width). Blockquote rule is 1px, not the 2px DESIGN.md first specified (recorded there: craft floor, and parity with case studies) |
| AC-6 Up to 3 related by D-021; absent when none | passed | `e2e/blog.spec.ts` (long → related, short; related → long; draft → none), `blog-view.test.ts` (ranking, limit of 3, drafts and self excluded) |
| AC-7 "Book a Call" and "Get in Touch" on every article | passed | `e2e/blog.spec.ts` (long, short, draft: Calendly in a new tab, `/#contact`) |
| AC-8 Production: `/blog` empty state with `noindex`; no draft or fixture HTML/.data; guard passes | passed | `e2e-built-production.txt` (empty state, noindex, no `/blog/` links, fixture and draft URLs 404); `build-production.txt` (`blog 0/4 included`, guard OK); `production-leak-check.txt` (only `blog/index.html` and `blog.data`; the only string match is the status component's code). AC text names `verify-build-content.mjs`; the script is `verify-build-content.ts` since WP-03 |
| AC-9 Fixture build: direct load and refresh 200; unknown and draft slugs 404 with the branded H1 after hydration | passed | `e2e-built-fixtures.txt` (27 passed, 4 production-only skipped), including zero CSP violations, client navigation index → article → back, `.data` served as `text/x-script` |
| AC-10 No parser strings in client JS; added blog JS ≤ 15 KB gzip | passed with note | `bundle-parser-check.txt`: no `micromark`, `unified`, `lowlight`, `highlight.js`, or `zod`, and no package signatures (`YAMLParseError`, `ZodError`, `registerLanguage`, …). The plain word `yaml` appears once, as the code-tag label `yaml: 'YAML'`, not parser code. `bundle-size.txt`: article route adds 14.37 KB, index 2.51 KB |
| AC-11 Screenshots at 375/768/1024/1440 (index, long, short, empty state); no overflow | passed | `fixtures-blog*-{375,768,1024,1440}.png` (index, long, short), `production-blog-*.png` (empty state); `*-report.json`: `scrollWidth` never exceeds the viewport, no undersized targets, no `style` attributes |
| AC-12 lint, typecheck, test, build, test:e2e, test:e2e:built | passed | `gates.txt` (lint, typecheck, 210 unit tests, content:check, 51 dev e2e); `build-fixtures.txt` + `e2e-built-fixtures.txt`; `build-production.txt` + `e2e-built-production.txt` (21 passed, 10 fixture-only skipped) |

### Other checks and notes

| Check | Result | Detail |
| --- | --- | --- |
| Existing pages unchanged | passed | `regression/compare.txt`: home, about, connect, 404 at 375/768/1440 match the WP-01 baseline except one pixel off by 1/255 under the nav's backdrop blur, which also varies between two captures of the same build (renderer noise) |
| Dev-only TOC race | explained, not a production issue | In `pnpm dev`, a TOC click made before hydration lands about 29px higher (heading top 67px, under the 72px nav), every time. Instrumented: the click starts the native smooth scroll, then React Router's `ScrollRestoration` calls `scrollIntoView()` at hydration while Vite injects route CSS. The same race on the built output lands at 96px. The dev test waits for hydration; the built test covers the early click |
| Article `.data` size (WP-09 budget) | within | 13.6 KB `.data` vs 20.7 KB HTML for the long fixture (≤ 2×) |
| Visual fixes from inspection | fixed | Back link unstyled outside `/work` (styles moved to `page-header.css`); inline-code chip inside code blocks (CSS order); global `section` padding on the author box; `//` pushed away from the TOC summary text by flex gap; ragged byline wrap at 375px (two-column grid); author link under 44px |
| impeccable process | adapted | Context loaded with `--target src/routes/blog-article.tsx`, Read mode, craft floor read before UI edits, direction contract in `blog-article.tsx`, surface brief written. Not done: image comps (would bill the user's OpenAI key) and a finish-review subagent (agents weren't requested); an in-thread review against the contract found no further gaps |
| impeccable detector | clean (files) | `detect.mjs --json` over the 8 new or changed components, both blog routes (`.tsx` + `.css`), `base.css`, and `tokens.css`: `[]`. URL scans not run (the detector needs puppeteer, which isn't installed) |
| CI | unchanged | The e2e job already runs the built suite on production and fixture builds; the new specs join automatically |
| `graphify update .` | see HANDOFF | |
