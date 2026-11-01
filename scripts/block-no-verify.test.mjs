// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const hook = fileURLToPath(new URL('../.claude/hooks/block-no-verify.sh', import.meta.url));

function blocked(command) {
  const input = JSON.stringify({ tool_input: { command } });
  const { status } = spawnSync('bash', [hook], { input, encoding: 'utf8' });
  expect([0, 2]).toContain(status);
  return status === 2;
}

const bypasses = [
  // Flag placement
  'git commit --no-verify -m x',
  'git commit -m x --no-verify',
  'git commit -n -m x',
  'git commit -m x -n',
  'git commit -nm x',
  'git commit -nm "msg"',
  'git commit -nm"msg"',
  'git commit -am x -n',
  'git commit -an -m x',
  'git commit --amend -n',
  'git commit -F msg.txt -n',
  // Inside a larger command
  'git add . && git commit -n -m x',
  'cd sub; git commit -n -m x',
  '(cd sub && git commit -n -m x)',
  'grep -n x file; git commit -n -m y',
  'echo $(git commit -n -m x)',
  'bash -c "cd x && git commit -n -m y"',
  "sh -c 'cd x; git commit -n -m y'",
  // Separators in a value, not between commands
  'git commit -m "a; b" -n',
  "git commit -m 'a; b' -n",
  'git commit -m "a | b < c" -n',
  'git commit --message="a; b" -n',
  'git commit --message "a; b" -n',
  'git commit -m "line one\nline two" -n',
  'git commit -F "a;b" -n',
  'git commit --author="A; B" -n',
  "git commit --trailer 'x; y' -n",
  'git commit --author=a\\;b -n',
  // Substitutions
  'git commit -F <(printf message) -n',
  'git commit -F <(printf a; printf b) -n',
  'git commit -F $(mktemp; echo) -n',
  'git commit -F `echo a; echo b` -n',
  // Redirects
  'git commit -m x < /dev/null -n',
  'git commit -m x 2>&1 -n',
  'git commit -m x &>log -n',
  // Multi-line commands and heredocs
  'git commit \\\n  -n \\\n  -m x',
  'git commit -n <<EOF\nmsg\nEOF',
  'git commit -F - -n <<EOF\nmsg\nEOF',
  "git commit -F - <<EOF\nit's\nEOF\ngit commit -n -m y",
  'git commit -m "x <<EOF\ny" -n\nEOF',
];

const allowed = [
  'git commit -m x',
  'git commit -m "plain message"',
  'git commit -q -F - <<EOF\nmsg\nEOF',
  'git commit --amend --no-edit',
  // Flags on neighboring commands
  'git commit -m x && grep -n foo file',
  'git commit -m x; sed -n 1,5p file',
  'grep -nE foo file; git commit -m x',
  'sed -n 1,5p file && git commit -m x',
  'git commit -q -F - <<EOF\nbody\nEOF\ngit status; grep -nE foo bar',
  'git commit -m x 2>&1 | grep -n foo',
  'git commit -m "a; b" && grep -n x y',
  'git commit -F <(printf m) && grep -n x y',
  // Flags mentioned in message text
  'git commit -m "explain the -n flag"',
  "git commit -m 'explain the -n flag'",
  'git commit -F - <<EOF\nit\'s about -n\nEOF',
  'git commit -m "$(cat <<\'EOF\'\nbody with -n in it\nEOF\n)"',
  // Not a commit
  'git status',
  'grep -n foo file',
  "git log --grep='git commit' -n 5",
];

describe('block-no-verify hook', () => {
  it.each(bypasses)('blocks %j', (command) => {
    expect(blocked(command)).toBe(true);
  });

  it.each(allowed)('allows %j', (command) => {
    expect(blocked(command)).toBe(false);
  });
});
