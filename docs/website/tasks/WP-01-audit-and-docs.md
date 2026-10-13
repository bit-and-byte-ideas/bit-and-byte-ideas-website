# WP-01: Repository audit, brief, and documentation foundation

## Purpose and scope

Establish the facts and the working documentation system before any implementation:
audit the repo and the live site, record the design baseline and known issues, define
the content model and architecture, and create resumable work packages.

## Prerequisites

None.

## Read first

`CLAUDE.md`, `AGENTS.md`, `PRODUCT.md`, `README.md`, `docs/*.md`, `src/**`,
`public/**`, `scripts/generate-sitemap.mjs`, `react-router.config.ts`, `e2e/**`,
`.github/workflows/*.yaml`, `.agents/skills/*/SKILL.md` (headers and relevant sections).

## Relevant decisions

D-001, D-002, D-015, D-017, D-018, D-019.

## Implementation areas

`docs/website/**` (all documents, templates, evidence), plus a pointer section in
`CLAUDE.md` and `AGENTS.md`.

## Acceptance criteria

- **AC-1** All eleven documents listed in `README.md` exist and are populated with
  observed facts (no placeholders).
- **AC-2** `MANIFEST.yaml` lists every package with id, title, status, dependencies,
  document path, deliverables, acceptance criteria, validation commands, evidence,
  blockers, and next action, and separates implementation from content readiness.
- **AC-3** Every task document has purpose and scope, prerequisites and read-first files,
  decisions, implementation areas, acceptance criteria, verification, exclusions, and a
  copy-paste prompt.
- **AC-4** Baseline checks were run and recorded in `VALIDATION.md` as passed / failed /
  not run.
- **AC-5** `CLAUDE.md` and `AGENTS.md` gain a concise pointer without changing any
  existing instruction.
- **AC-6** No source code, configuration, or content outside `docs/website/` changed
  (except AC-5).

## Verification

```bash
ls docs/website docs/website/tasks docs/website/templates
python3 -c "import yaml,sys; d=yaml.safe_load(open('docs/website/MANIFEST.yaml')); print(len(d['tasks']), 'tasks')"
git diff --stat -- CLAUDE.md AGENTS.md
git status --short
```

## Exclusions

No implementation, no fixes to known issues (they are assigned to packages), no
commits.

## Prompt

```text
WP-01 is complete. Do not redo it. Read docs/website/README.md and follow
"Starting a fresh session" to pick the next task.
```
