# WP-11: Repository documentation hygiene

## Purpose and scope

Fix documentation drift found in the audit so agents and contributors stop following
dead references: the deleted `docs/redesign/` and `docs/SEO/` records (K3), the
React Router version and prerender list (K4), and the mkdocs nav. Independent of the
feature work and low priority. Can run any time after WP-01.

## Prerequisites

WP-01 done. The CSP paragraph (K5) belongs to WP-02; skip it here if WP-02 hasn't run.

## Read first

- `docs/website/AUDIT.md` K3, K4, "Documentation drift"; `docs/website/DECISIONS.md`
  D-017, D-018
- `CLAUDE.md`, `AGENTS.md`, `README.md`, `PRODUCT.md`, `mkdocs.yml`, `docs/index.md`,
  `docs/architecture.md`, `docs/ux-content.md`, `docs/quality-operations.md`,
  `src/design/tokens.css` (header comment)
- History: `git show a804ef4^:docs/redesign/03-design-direction.md` (and siblings)

## Relevant decisions

D-017 (root DESIGN.md), D-018 (why this was deferred).

## Implementation areas

1. **Ask Carlos once** which option he wants for the deleted decision records, unless
   he has already answered in `HANDOFF.md`:
   - (a) Re-point every reference to `docs/website/DESIGN.md`, `docs/website/AUDIT.md`,
     and git history (**default** if no answer: the deletion in `a804ef4`/`c89bb38` was
     deliberate);
   - (b) Restore the files as a read-only archive under `docs/archive/redesign/` and
     point references there.
2. Update `CLAUDE.md` and `AGENTS.md` (the same edits in both): React Router v8, the
   prerender list, and the design-direction pointer. In the "Website extension" section
   added by WP-01, drop the closing sentence about the removed `docs/redesign/` records.
   Change only those sentences.
3. `mkdocs.yml`: remove missing nav entries; add a "Website extension" section for
   `docs/website/README.md`, `BRIEF.md`, `ARCHITECTURE.md`, `DESIGN.md`, `CONTENT.md`,
   and `DECISIONS.md`.
4. `docs/architecture.md`: add `/connect` to the route table, and fix the version.
5. `docs/quality-operations.md`: remove the `docs/SEO/README.md` reference.
6. `PRODUCT.md`, the `tokens.css` header comment, and the `react-router.config.ts`
   comment ("decision D3 in docs/redesign/00-overview.md"): re-point references.

## Acceptance criteria

- **AC-1** The drift grep in "Verification" returns nothing (or only `docs/archive/`
  paths under option b). It deliberately ignores `docs/website/` and `.impeccable/`
  (historical records).
- **AC-2** Every `mkdocs.yml` nav path exists (checked with a short script).
- **AC-3** `CLAUDE.md`/`AGENTS.md` diffs touch only the drifted sentences, plus nothing
  else.
- **AC-4** `pnpm lint`, `pnpm typecheck`, and `pnpm test` still pass (no code changed
  except the two comments).

## Verification

```bash
grep -rn "docs/redesign\|docs/SEO" --include='*.md' --include='*.yml' --include='*.css' --include='*.ts' . \
  | sed 's#^\./##' | grep -vE '^(node_modules|docs/website|docs/archive|\.agents|\.claude|\.impeccable)/'
python3 -c "import yaml,os; nav=yaml.safe_load(open('mkdocs.yml'))['nav']; \
w=lambda n: [p for i in n for p in (w(list(i.values())[0]) if isinstance(list(i.values())[0], list) else [list(i.values())[0]])]; \
missing=[p for p in w(nav) if not os.path.exists('docs/'+p)]; print('missing:', missing)"
git diff --stat
pnpm lint && pnpm typecheck && pnpm test
```

## Exclusions

No content changes to `docs/services-strategy.md` (historical record) or to
`.impeccable/critique/*` (historical). No code changes beyond the two comments. No edits
to unrelated `CLAUDE.md` rules.

## Prompt

```text
Continue the Bit & Byte Ideas website extension. Read CLAUDE.md, then
docs/website/README.md, docs/website/MANIFEST.yaml, and docs/website/HANDOFF.md; check
git branch/status and reconcile the docs with the repository. Then complete WP-11 using
docs/website/tasks/WP-11-docs-hygiene.md. Ask me once whether to re-point or archive the
deleted docs/redesign records unless HANDOFF.md already records my answer. Change only
drifted sentences in CLAUDE.md and AGENTS.md. Set WP-11 to in_progress before editing,
checkpoint the manifest, VALIDATION.md, and HANDOFF.md, and mark it done only when every
acceptance criterion passes. Do not commit, push, or deploy unless I ask.
```
