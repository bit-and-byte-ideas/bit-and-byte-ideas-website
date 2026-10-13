// Generates placeholder PNGs for development fixtures (src/content/fixtures/**)
// with Playwright: a flat panel with a dashed amber border reading
// "DEVELOPMENT FIXTURE", sized like a real capture (desktop 1440x900 @2x,
// mobile 390x844 @3x, article images 1600x900). They must never resemble a
// real website. Solid fills keep the committed PNGs small.
// Usage: node scripts/content-fixture-images.mjs [--force]
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { parse } from 'yaml';

const ROOT = resolve(import.meta.dirname, '..');
const FIXTURES = join(ROOT, 'src/content/fixtures');
const force = process.argv.includes('--force');

const SIZES = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 2 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 3 },
  article: { width: 1600, height: 900, deviceScaleFactor: 1 },
};

/** Every image a fixture references, with the size it should be generated at. */
function referencedImages() {
  const images = [];
  for (const collection of ['work', 'blog']) {
    const dir = join(FIXTURES, collection);
    if (!existsSync(dir)) continue;
    for (const slug of readdirSync(dir)) {
      const file = join(dir, slug, 'index.md');
      if (!existsSync(file)) continue;
      const raw = readFileSync(file, 'utf8');
      const [, yamlText = '', body = ''] = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw) ?? [];
      const data = parse(yamlText) ?? {};
      const add = (name, size) =>
        images.push({ label: `${collection}/${slug}/${name}`, path: join(dir, slug, 'images', name), size });
      for (const image of data.images ?? []) add(image.file, SIZES[image.viewport] ?? SIZES.desktop);
      if (data.cover?.file) add(data.cover.file, SIZES.article);
      for (const [, name] of body.matchAll(/!\[[^\]]*\]\((?:\.\/)?images\/([^)\s]+)\)/g)) {
        add(name, SIZES.article);
      }
    }
  }
  return images;
}

function placeholderHtml(label, size) {
  const pixels = `${size.width * size.deviceScaleFactor} x ${size.height * size.deviceScaleFactor}`;
  return `<!doctype html><html><body style="margin:0">
<div style="box-sizing:border-box;width:100vw;height:100vh;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:24px;padding:32px;text-align:center;
  font-family:monospace;color:#f8fafc;border:12px dashed #f59e0b;background:#1a2440">
  <div style="font-size:${Math.max(28, size.width / 18)}px;font-weight:700;letter-spacing:.08em">DEVELOPMENT FIXTURE</div>
  <div style="font-size:${Math.max(16, size.width / 60)}px">Not a real project or screenshot</div>
  <div style="font-size:${Math.max(14, size.width / 80)}px;color:#94a3b8">${label} - ${pixels}</div>
</div></body></html>`;
}

const pending = referencedImages().filter((image) => force || !existsSync(image.path));
if (pending.length === 0) {
  console.log('content-fixture-images: all fixture images exist (use --force to regenerate)');
  process.exit(0);
}

const browser = await chromium.launch();
for (const image of pending) {
  const page = await browser.newPage({
    viewport: { width: image.size.width, height: image.size.height },
    deviceScaleFactor: image.size.deviceScaleFactor,
  });
  await page.setContent(placeholderHtml(image.label, image.size));
  await page.screenshot({ path: image.path });
  await page.close();
  console.log(`content-fixture-images: wrote ${image.label}`);
}
await browser.close();
