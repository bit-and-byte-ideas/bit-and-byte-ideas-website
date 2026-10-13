// Baseline audit capture: responsive screenshots, layout/semantics probes,
// and a CSP hydration experiment against the static build served locally.
// Usage: node baseline.mjs <repoRoot> <baseUrl> <outDir>
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [repoRoot, baseUrl, outDir] = process.argv.slice(2);
const require = createRequire(join(repoRoot, 'package.json'));
const { chromium } = require('@playwright/test');

mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];
const pages = ['/', '/about/', '/connect/', '/404/'];
const prodCsp = JSON.parse(readFileSync(join(repoRoot, 'public/staticwebapp.config.json'), 'utf8'))
  .globalHeaders['Content-Security-Policy'];

const browser = await chromium.launch();
const report = { baseUrl, capturedAt: new Date().toISOString(), probes: [], csp: {} };

for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const path of pages) {
    await page.goto(baseUrl + path, { waitUntil: 'networkidle' });
    const slug = path === '/' ? 'home' : path.replaceAll('/', '');
    await page.screenshot({ path: join(outDir, `${slug}-${vp.name}.png`), fullPage: vp.name !== 'desktop' ? false : true });
    const probe = await page.evaluate(() => ({
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      headings: [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => `${h.tagName}:${h.textContent.trim().replace(/\s+/g, ' ').slice(0, 50)}`),
      imagesMissingDims: [...document.querySelectorAll('img')].filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).map((i) => i.src),
      imagesMissingAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).map((i) => i.src),
      smallTouchTargets: [...document.querySelectorAll('a,button,summary')]
        .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.height < 44 && r.width < 44); })
        .map((el) => el.textContent.trim().slice(0, 30) || el.getAttribute('aria-label')),
    }));
    report.probes.push({ viewport: vp.name, path, ...probe });
  }
  await context.close();
}

// CSP experiment: same build, with and without the production CSP header.
async function hydrationCheck(withCsp) {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  const violations = [];
  page.on('console', (m) => { if (/Content Security Policy|Refused/i.test(m.text())) violations.push(m.text().slice(0, 160)); });
  if (withCsp) {
    await page.route('**/*', async (route) => {
      const response = await route.fetch();
      const headers = { ...response.headers() };
      if ((headers['content-type'] || '').includes('text/html')) headers['content-security-policy'] = prodCsp;
      await route.fulfill({ response, headers });
    });
  }
  await page.goto(baseUrl + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
  await toggle.click();
  await page.waitForTimeout(400);
  const result = {
    reactRouterContext: await page.evaluate(() => typeof window.__reactRouterContext !== 'undefined'),
    mobileMenuExpandedAfterClick: await toggle.getAttribute('aria-expanded'),
    cspViolationCount: violations.length,
    sampleViolations: violations.slice(0, 3),
  };
  await page.screenshot({ path: join(outDir, `csp-${withCsp ? 'enforced' : 'absent'}-mobile-menu.png`) });
  await context.close();
  return result;
}
report.csp.withoutHeader = await hydrationCheck(false);
report.csp.withProductionHeader = await hydrationCheck(true);

await browser.close();
writeFileSync(join(outDir, 'baseline-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.csp, null, 2));
for (const p of report.probes) {
  console.log(p.viewport, p.path, 'overflow=' + p.horizontalOverflow, 'noDims=' + p.imagesMissingDims.length, 'noAlt=' + p.imagesMissingAlt.length, 'small=' + JSON.stringify(p.smallTouchTargets));
}
