// Post-build step: moves every executable inline <script> in build/client/**/*.html
// into a same-origin file so the strict CSP (`script-src 'self'` in
// public/staticwebapp.config.json) allows React Router's hydration bootstrap.
//
// Each tag keeps its position and its type/async/id attributes. Parser-inserted
// external classic scripts run in document order and block parsing exactly like
// the inline ones they replace, so React's streaming helpers keep their order.
// Data blocks (JSON-LD) stay inline: CSP does not apply to them.
//
// Fails the build if any executable inline script is left behind.
// `--check` only verifies (no rewrite): exits 1 if any page still has one.
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../build/client');
const OUT_DIR = join(ROOT, 'assets', 'inline');
const PUBLIC_PREFIX = '/assets/inline/';

const SCRIPT_TAG = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const ATTRIBUTE = /([^\s=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
const EXECUTABLE_TYPES = new Set(['', 'text/javascript', 'application/javascript', 'module']);

/** @returns {Array<[string, string | null]>} attribute name/value pairs in source order */
function parseAttributes(source) {
  return [...source.matchAll(ATTRIBUTE)].map(([, name, double, single, bare]) => [
    name.toLowerCase(),
    double ?? single ?? bare ?? null,
  ]);
}

function isExecutableInline(attributes) {
  const names = new Map(attributes);
  if (names.has('src')) return false;
  const type = (names.get('type') ?? '').trim().toLowerCase();
  return EXECUTABLE_TYPES.has(type);
}

function serializeAttributes(attributes) {
  return attributes
    .map(([name, value]) =>
      value === null ? ` ${name}` : ` ${name}="${value.replaceAll('"', '&quot;')}"`,
    )
    .join('');
}

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

const checkOnly = process.argv.includes('--check');
const written = new Set();
let moved = 0;
const pages = htmlFiles(ROOT);

if (!checkOnly) mkdirSync(OUT_DIR, { recursive: true });

for (const page of checkOnly ? [] : pages) {
  const html = readFileSync(page, 'utf8');
  const rewritten = html.replace(SCRIPT_TAG, (tag, attributeSource, body) => {
    const attributes = parseAttributes(attributeSource);
    if (!isExecutableInline(attributes)) return tag;
    const name = `${createHash('sha256').update(body).digest('hex').slice(0, 16)}.js`;
    if (!written.has(name)) {
      writeFileSync(join(OUT_DIR, name), body);
      written.add(name);
    }
    moved += 1;
    return `<script${serializeAttributes(attributes)} src="${PUBLIC_PREFIX}${name}"></script>`;
  });
  if (rewritten !== html) writeFileSync(page, rewritten);
}

const leftovers = pages.flatMap((page) =>
  [...readFileSync(page, 'utf8').matchAll(SCRIPT_TAG)]
    .filter(([, attributeSource]) => isExecutableInline(parseAttributes(attributeSource)))
    .map(() => relative(ROOT, page)),
);
if (leftovers.length > 0) {
  console.error(
    `externalize-inline-scripts: ${leftovers.length} executable inline script(s) remain in: ${[
      ...new Set(leftovers),
    ].join(', ')}. The CSP (script-src 'self') would block them.`,
  );
  process.exit(1);
}

console.log(
  checkOnly
    ? `externalize-inline-scripts: ${pages.length} page(s) checked, no executable inline scripts`
    : `externalize-inline-scripts: moved ${moved} inline script(s) from ${pages.length} ` +
      `page(s) into ${written.size} file(s) under ${PUBLIC_PREFIX}`,
);
