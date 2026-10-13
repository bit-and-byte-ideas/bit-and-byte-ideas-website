// Captures a consistent, authentic screenshot of a page into an entry's images/
// folder (docs/website/CONTENT.md). Only capture a site whose owner approved it,
// and record that approval (publicApproval) before committing the image: this
// repository is public.
//
// Usage: pnpm content:capture <url> <work|blog>/<slug> <name>
//          [--viewport desktop|mobile] [--full-page] [--force] [--out <dir>]
//   desktop: 1440x900 at 2x (2880x1800); mobile: 390x844 at 3x (1170x2532)
// Run with Node 24 type stripping: node scripts/content-capture.ts
import { existsSync, mkdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
} as const;

function fail(message: string): never {
  console.error(`content:capture: ${message}`);
  console.error(
    'usage: pnpm content:capture <url> <work|blog>/<slug> <name> [--viewport desktop|mobile] [--full-page] [--force] [--out <dir>]',
  );
  process.exit(1);
}

const argv = process.argv.slice(2);
const flags = new Set(argv.filter((arg) => arg.startsWith('--')));
const option = (name: string) => {
  const index = argv.indexOf(name);
  return index === -1 ? undefined : argv[index + 1];
};
const optionValues = new Set([option('--viewport'), option('--out')].filter(Boolean));
const [url, target, name] = argv.filter((arg) => !arg.startsWith('--') && !optionValues.has(arg));

if (!url || !target || !name) fail('missing arguments');
let parsedUrl: URL;
try {
  parsedUrl = new URL(url);
} catch {
  fail(`"${url}" is not a URL`);
}
if (!['https:', 'http:'].includes(parsedUrl.protocol)) fail('only http(s) URLs can be captured');

const match = /^(work|blog)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(target);
if (!match) fail(`"${target}" must be work/<slug> or blog/<slug> (fixtures never use real screenshots)`);
const [, collection, slug] = match;
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) fail(`name "${name}" must be lowercase kebab-case`);

const viewportName = option('--viewport') ?? 'desktop';
if (viewportName !== 'desktop' && viewportName !== 'mobile') fail('--viewport must be desktop or mobile');

const root = process.cwd();
const outDir = option('--out')
  ? resolve(option('--out')!)
  : join(root, 'src', 'content', collection, slug, 'images');
if (!option('--out') && !existsSync(join(root, 'src', 'content', collection, slug, 'index.md'))) {
  fail(`src/content/${collection}/${slug}/index.md does not exist; create the entry first`);
}
const outFile = join(outDir, `${name}.png`);
/** Repo-relative inside the repo, absolute elsewhere (for --out). */
const shown = (path: string) => (path.startsWith(root) ? relative(root, path) : path);
if (existsSync(outFile) && !flags.has('--force')) fail(`${shown(outFile)} exists; pass --force to replace it`);

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ ...VIEWPORTS[viewportName], reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(parsedUrl.href, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.screenshot({ path: outFile, fullPage: flags.has('--full-page'), animations: 'disabled' });
} finally {
  await browser.close();
}

console.log(`content:capture: wrote ${shown(outFile)} (${viewportName})`);
console.log('  Before committing: record the owner\'s approval (publicApproval) - this repository is public.');
console.log('  Next: reference the file in index.md (images: or ![alt](./images/...)), then run pnpm content:images.');
