// WP-06 evidence: full-page screenshots at 375/768/1024/1440 plus layout and
// semantics probes for the given paths, against a build served by `pnpm serve:built`.
// Usage: node capture-work.mjs <repoRoot> <baseUrl> <outDir> <label> <path> [<path>...]
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';

const [root, baseUrl, outDir, label, ...paths] = process.argv.slice(2);
const { chromium } = createRequire(join(root, 'package.json'))('@playwright/test');
const widths = [375, 768, 1024, 1440];
const browser = await chromium.launch();
const report = [];
for (const path of paths) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const response = await page.goto(baseUrl + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // Lazy images only load near the viewport: scroll through, then back to the top.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForLoadState('networkidle');
    const probe = await page.evaluate(() => ({
      title: document.title,
      robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null,
      h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
      headings: [...document.querySelectorAll('main h1, main h2, main h3, main h4')].map((h) => Number(h.tagName[1])),
      overflow: document.documentElement.scrollWidth > innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      imagesMissingDims: [...document.querySelectorAll('main img')].filter((i) => !i.getAttribute('width')).length,
      styleAttributes: document.querySelectorAll('main [style]').length,
      proseFontPx: (() => { const p = document.querySelector('.content-body p'); return p ? parseFloat(getComputedStyle(p).fontSize) : null; })(),
      proseWidth: (() => { const b = document.querySelector('.content-body'); return b ? [Math.round(b.getBoundingClientRect().width), parseFloat(getComputedStyle(b).maxWidth)] : null; })(),
      tocVisible: (() => { const n = document.querySelector('nav.toc'); return n ? [...n.querySelectorAll('a')].filter((a) => a.offsetParent).length : 0; })(),
      smallTargets: [...document.querySelectorAll('main a, main button')]
        .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 44 && !el.closest('.content-body') && !el.matches('.project-row-link, .article-card-link, .toc a'); })
        .map((el) => el.textContent.trim().slice(0, 30)),
      statusMarkers: document.querySelectorAll('[data-content-status]').length,
    }));
    const skipped = probe.headings.some((level, i) => i > 0 && level > probe.headings[i - 1] + 1);
    report.push({ path, width, status: response.status(), ...probe, skippedHeadingLevel: skipped });
    const slug = path === '/' ? 'home' : path.replace(/^\//, '').replaceAll('/', '_');
    await page.screenshot({ path: join(outDir, `${label}-${slug}-${width}.png`), fullPage: true });
    await page.close();
  }
}
await browser.close();
writeFileSync(join(outDir, `${label}-report.json`), JSON.stringify(report, null, 2));
for (const r of report) {
  console.log(`${r.status} ${r.path} @${r.width}: h1=${r.h1.length} skipped=${r.skippedHeadingLevel} overflow=${r.overflow} noDims=${r.imagesMissingDims} small=${JSON.stringify(r.smallTargets)} robots=${r.robots} status=${r.statusMarkers}`);
}
