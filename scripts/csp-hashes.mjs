// Pins every inline <script> React Router emits into the CSP as a sha256 hash.
// Runs after `react-router build` as part of `pnpm build`.
//
// The prerendered HTML boots hydration through small inline scripts
// (window.__reactRouterContext, the stream controller and the
// `import "/assets/manifest-*.js"` module entry). A bare `script-src 'self'`
// blocks all of them, which silently leaves the site un-hydrated: no mobile
// menu, no client-side navigation, and every link click becomes a full page
// reload. Hash-allowlisting keeps 'unsafe-inline' out of the policy while
// letting exactly these build-generated scripts run.
//
// The hashes change whenever the bundle hashes change, so they are computed
// per build and written to build/client/staticwebapp.config.json (the copy
// Azure Static Web Apps actually deploys), never to the source config.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const OUT_DIR = resolve(import.meta.dirname, '../build/client');
const CONFIG = join(OUT_DIR, 'staticwebapp.config.json');

// Data blocks are never executed, so CSP ignores them.
const NON_EXECUTABLE = /type\s*=\s*["']?application\/(ld\+)?json/i;

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

const hashes = new Set();
for (const file of htmlFiles(OUT_DIR)) {
  const html = readFileSync(file, 'utf8');
  for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/i.test(attrs) || NON_EXECUTABLE.test(attrs) || body.length === 0) continue;
    hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
  }
}

const config = JSON.parse(readFileSync(CONFIG, 'utf8'));
const csp = config.globalHeaders?.['Content-Security-Policy'];
if (!csp || !/(^|;)\s*script-src\s/.test(csp)) {
  throw new Error(`${CONFIG}: Content-Security-Policy must declare a script-src directive`);
}

config.globalHeaders['Content-Security-Policy'] = csp
  .split(';')
  .map((directive) => {
    const trimmed = directive.trim();
    return trimmed.startsWith('script-src ')
      ? `${trimmed} ${[...hashes].sort().join(' ')}`
      : trimmed;
  })
  .join('; ');

writeFileSync(CONFIG, `${JSON.stringify(config, null, 2)}\n`);
console.log(`CSP script-src: pinned ${hashes.size} inline script hash(es)`);
