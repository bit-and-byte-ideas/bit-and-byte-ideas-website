# Website Extension: Work Gallery + Technology Blog

Working documentation for extending bitandbyteideas.com with a customer work gallery
(`/work`) and a technology blog (`/blog`). The work is split into independently resumable
work packages so progress survives context limits and fresh sessions.

Started 2026-10-12 on branch `site-improvements` (identical to `main` at `4074b5e`).

## Documents

| Document | Owns | Read when |
| --- | --- | --- |
| [MANIFEST.yaml](MANIFEST.yaml) | **Authoritative status**, dependencies, acceptance summary, and next action for every work package | Every session, first |
| [HANDOFF.md](HANDOFF.md) | Compact current state, uncommitted work, exact next action, continuation prompt | Every session, second |
| [BRIEF.md](BRIEF.md) | Goals, audience, requirements, exclusions, assumptions, open questions | Scoping or when a requirement is unclear |
| [AUDIT.md](AUDIT.md) | Observed implementation, route inventory, commands, design baseline, known issues (`K#`) | Before touching an area for the first time |
| [DESIGN.md](DESIGN.md) | Visual rules, reusable components, taste-skill usage, planned UI extensions | Any UI work |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Routing, prerendering, content pipeline, validation, images, discovery, deployment | Any implementation work |
| [CONTENT.md](CONTENT.md) | Project and article schemas, templates, editorial workflow, missing-asset checklist, topic backlog | Authoring, or content model work |
| [DECISIONS.md](DECISIONS.md) | Dated decisions (`D#`) with rationale and consequences | Before changing an established approach |
| [VALIDATION.md](VALIDATION.md) | Checks run per session: passed / failed / not run, with evidence paths | Before marking anything done |
| [tasks/](tasks/) | One self-contained document per work package (`WP-##`) | When working that package |
| [evidence/](evidence/) | Screenshots, reports, and scripts produced by checks, one folder per session | When verifying claims |

Ownership rule: status lives only in `MANIFEST.yaml`. Task documents hold detailed
requirements and never restate status. Other documents link to sections rather than copy
them.

## Starting a fresh session

1. Read the repository instructions: `CLAUDE.md` (and `AGENTS.md` for Codex).
2. Read this file, then `MANIFEST.yaml`, then `HANDOFF.md`.
3. Inspect the repository state:
   ```bash
   git branch --show-current
   git status --short
   git log --oneline -5
   ```
4. Reconcile: if files, branch, or commits disagree with `HANDOFF.md` or the manifest,
   trust the repository, update the docs to match, and note the discrepancy in
   `VALIDATION.md`. Never discard unrelated work (for example the staged taste-skill
   install in `.agents/skills/` and `.claude/skills/`).
5. Pick the task the user named, otherwise the first manifest task whose `status` is
   `ready` and whose `depends_on` tasks are all `done`.
6. Open only that task's document and the files it lists under "Read first".
7. Set the task to `in_progress` in `MANIFEST.yaml` (and `current_task`) before editing
   code.

Copy-paste prompt for a new Claude Code session (no prior chat history needed):

```text
You are continuing the Bit & Byte Ideas website extension (work gallery + blog).
Follow docs/website/README.md "Starting a fresh session" exactly: read CLAUDE.md,
docs/website/README.md, docs/website/MANIFEST.yaml, and docs/website/HANDOFF.md; check
git branch/status; reconcile docs with the repository; then complete the task named in
HANDOFF.md "Next action" (or the next ready task in the manifest) using its document in
docs/website/tasks/. Checkpoint MANIFEST.yaml, VALIDATION.md, and HANDOFF.md after each
milestone. Do not mark a task done unless every acceptance criterion passes; report
passed / failed / not run honestly. Do not commit, push, or deploy unless I ask.
```

## During and after a session

- Checkpoint after meaningful milestones: update the task's `status`, `evidence`,
  `blockers`, and `next_action` in `MANIFEST.yaml`; append results to `VALIDATION.md`.
- Record any new or changed decision in `DECISIONS.md` before relying on it.
- If context is running low, stop starting new work and update `HANDOFF.md`.
- Put check output, screenshots, and scripts in `evidence/<YYYY-MM-DD>-<task-id>-<topic>/`.
- Before ending: update `HANDOFF.md` (branch, revision, uncommitted files, blockers, next
  task, next concrete action, continuation prompt).

## Status values

`todo` (dependencies not done) · `ready` (can start now) · `in_progress` · `blocked`
(needs an input or decision; see `blockers`) · `done` (all acceptance criteria verified).

Implementation status and production content are tracked separately: a package can be
`done` while real projects or articles are still missing. See `content_readiness` in the
manifest and the checklist in [CONTENT.md](CONTENT.md#missing-asset-checklist).
