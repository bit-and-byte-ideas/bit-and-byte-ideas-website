// WP-04 visual check: renders ScreenshotFrame markup (crop + natural) with the
// real token/component CSS and generated fixture variants from a fixture build
// served by `pnpm serve:built`. Markup mirrors src/components/screenshot-frame.tsx.
// Usage: node preview-frames.mjs <repoRoot> <baseUrl> <outDir>
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const [root, baseUrl, outDir] = process.argv.slice(2);
const { chromium } = createRequire(join(root, 'package.json'))('@playwright/test');
const manifest = JSON.parse(readFileSync(join(root, 'src/content/media-manifest.json'), 'utf8'));
const css = ['src/design/tokens.css', 'src/components/responsive-image.css', 'src/components/screenshot-frame.css']
  .map((file) => readFileSync(join(root, file), 'utf8').replace(/@import[^;]+;/g, ''))
  .join('\n');

function frame(key, alt, mode, caption, sizes) {
  const image = manifest.images[key];
  const set = (format) => image.variants.map((v) => `${baseUrl}${v[format]} ${v.width}w`).join(', ');
  const fallback = image.variants.filter((v) => v.width <= 1200).at(-1);
  return `<figure class="screenshot-frame screenshot-frame--${mode}"><div class="screenshot-frame-matte">
    <picture class="responsive-image"><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
    <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
    <img src="${baseUrl}${fallback.webp}" alt="${alt}" width="${image.width}" height="${image.height}" sizes="${sizes}"></picture>
  </div>${caption ? `<figcaption class="screenshot-frame-caption">${caption}</figcaption>` : ''}</figure>`;
}

const html = `<!doctype html><html><head><style>${css}
body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui;padding:48px 24px}
.grid{display:grid;gap:48px;max-width:1100px;margin:0 auto}
@media(min-width:900px){.grid{grid-template-columns:7fr 5fr;align-items:start}}
.natural-wrap{max-width:320px}
</style></head><body><div class="grid">
${frame('work/fixture-client-greenhouse/home-desktop.png', 'Desktop fixture placeholder', 'crop', '', '(min-width: 900px) 58vw, 100vw')}
<div class="natural-wrap">${frame('work/fixture-client-greenhouse/home-mobile.png', 'Mobile fixture placeholder', 'natural', 'Fixture: placeholder for the mobile layout.', '320px')}</div>
</div></body></html>`;

const browser = await chromium.launch();
for (const [name, width] of [['desktop', 1440], ['mobile', 375]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.setContent(html, { waitUntil: 'networkidle' });
  const shift = await page.evaluate(() => {
    const img = document.querySelector('.screenshot-frame--crop img');
    const box = img.getBoundingClientRect();
    return { width: Math.round(box.width), height: Math.round(box.height), ratio: (box.width / box.height).toFixed(3), current: img.currentSrc.split('/').pop(), overflow: document.documentElement.scrollWidth > innerWidth };
  });
  console.log(name, JSON.stringify(shift));
  await page.screenshot({ path: join(outDir, `frames-${name}.png`), fullPage: true });
  await page.close();
}
await browser.close();
