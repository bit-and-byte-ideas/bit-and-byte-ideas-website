// Evidence capture for WP-02: loads the built site (served by `pnpm serve:built`
// with the production CSP), records hydration state and CSP violations, opens the
// mobile menu at 375x812, and saves a screenshot.
// Usage: node capture-mobile-menu.mjs <repoRoot> <baseUrl> <outPng> <outJson>
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';

const [repoRoot, baseUrl, outPng, outJson] = process.argv.slice(2);
const { chromium } = createRequire(join(repoRoot, 'package.json'))('@playwright/test');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
const violations = [];
page.on('console', (m) => { if (/Content Security Policy/i.test(m.text())) violations.push(m.text().slice(0, 200)); });
const response = await page.goto(baseUrl + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
const hydrated = await toggle.evaluate((el) => Object.keys(el).some((k) => k.startsWith('__reactProps')));
await toggle.click();
await page.waitForTimeout(400);
const result = {
  capturedAt: new Date().toISOString(),
  url: baseUrl + '/',
  cspHeader: response.headers()['content-security-policy'],
  hydrated,
  reactRouterContext: await page.evaluate(() => typeof window.__reactRouterContext !== 'undefined'),
  mobileMenuExpandedAfterClick: await toggle.getAttribute('aria-expanded'),
  cspViolationCount: violations.length,
  sampleViolations: violations.slice(0, 3),
};
await page.screenshot({ path: outPng });
writeFileSync(outJson, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
