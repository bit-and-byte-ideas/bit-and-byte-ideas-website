#!/usr/bin/env bash
# Claude Code PreToolUse hook for Bash.
# Rejects `git commit ... --no-verify` (or short `-n`) so the local
# pre-commit hooks (commitlint + eslint + tsc) cannot be bypassed.
# Exit 2 = block tool call and surface stderr to the model.

set -eu

input="$(cat)"
cmd="$(printf '%s' "$input" | jq -r '.tool_input.command // ""')"

# Only inspect git commit invocations.
if ! printf '%s' "$cmd" | grep -qE '(^|[[:space:];&|(])git[[:space:]]+commit\b'; then
  exit 0
fi

# Keep each `git commit`'s own arguments, so flags on neighboring commands
# (`grep -n`, `sed -n`) don't count. Only a real separator ends them, so first
# neutralize what merely looks like one: join backslash-continued lines, remove
# fd redirects (`2>&1`), then in one left-to-right pass drop -m message text and
# heredoc bodies, and blank separators inside quotes, escapes, and substitutions.
# Message text or a body stays if a substitution in it runs `git commit`, because
# that nested commit runs for real.
# When unsure this errs toward seeing a flag, which blocks rather than bypasses.
flat="${cmd//\\$'\n'/ }"
args="$(printf '%s' "$flat" \
  | perl -0pe '
      s/\d*[<>]&\S*|&>>?/ /g;
      s{
        (?<flag>(?:^|(?<=\s))(?:-[A-Za-z]*m\s*|--message[=\s]\s*))
        (?<quoted>"(?:[^"\\]|\\.)*"|\x27[^\x27]*\x27)
        | (?<here><<-?\s*["\x27]?(?<tag>\w+)["\x27]?[^\n]*\n)(?:.*?\n)??\g{tag}(?=\n|$)
        | \\. | (?&quoted) | `[^`]*` | [<>\$](?<sub>\((?:[^()]++|(?&sub))*\))
      }{
        my ($text, $flag, $here) = ($&, $+{flag}, $+{here});
        my $nested = $text =~ /(?:\$\(|`).*\bgit\s+commit\b/s;
        !$nested && defined $flag ? $flag
          : !$nested && defined $here ? $here
          : do { $text =~ tr/;&|<>()\n/ /; $text }
      }gesx' \
  | grep -oE '(^|[[:space:];&|(])git[[:space:]]+commit\b[^;&|)]*' || true)"

# Match --no-verify anywhere, or short flag groups containing `n` (e.g. -n, -nm,
# -am -n) in the commit's arguments.
if printf '%s' "$cmd" | grep -qE -- '--no-verify\b' \
  || printf '%s\n' "$args" | grep -qE -- '[[:space:]]-[A-Za-z]*n[A-Za-z]*([[:space:]]|$)'; then
  cat >&2 <<'MSG'
Blocked: `git commit --no-verify` (or `-n`) is not allowed in this repo.
The pre-commit hooks (commitlint, eslint, tsc) are there to catch real problems.
Fix the underlying hook failure and commit again instead of skipping verification.
MSG
  exit 2
fi

exit 0
