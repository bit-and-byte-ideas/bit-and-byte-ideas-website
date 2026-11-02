import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { expectHydrated, recordedCspViolations, trackCspViolations } from './helpers';

// Runs against the production build served with the real Static Web Apps
// headers (scripts/serve-built.mjs). A strict `script-src 'self'` CSP must
// not stop React from hydrating.

const swaConfig = JSON.parse(
  readFileSync(new URL('../../public/staticwebapp.config.json', import.meta.url), 'utf8'),
) as { globalHeaders: Record<string, string> };
const productionCsp = swaConfig.globalHeaders['Content-Security-Policy'];

const pages = ['/', '/about', '/connect', '/404'];

// Matches <script> tags that execute inline code: no src, and not a data
// block such as JSON-LD.
const executableInlineScript = /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/g;

test.describe('Production build under the production CSP', () => {
  for (const path of pages) {
    test(`${path} carries the configured CSP header`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.headers()['content-security-policy']).toBe(productionCsp);
    });

    test(`${path} carries the hardening headers and referrer policy`, async ({ request }) => {
      const response = await request.get(path);
      const headers = response.headers();
      expect(headers['cross-origin-opener-policy']).toBe('same-origin');
      expect(headers['strict-transport-security']).toBe(
        'max-age=31536000; includeSubDomains; preload',
      );
      expect(await response.text()).toContain(
        '<meta name="referrer" content="strict-origin-when-cross-origin"',
      );
    });

    test(`${path} has no executable inline scripts`, async ({ request }) => {
      const html = await (await request.get(path)).text();
      expect(html.match(executableInlineScript) ?? []).toEqual([]);
    });

    test(`${path} hydrates with zero CSP violations`, async ({ page }) => {
      const consoleViolations = await trackCspViolations(page);
      await page.goto(path);
      await expectHydrated(page);
      expect(await recordedCspViolations(page)).toEqual([]);
      expect(consoleViolations).toEqual([]);
    });
  }

  test('mobile menu opens, navigates, and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expectHydrated(page);
    const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.locator('#mobile-menu').getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('Escape closes the mobile menu and returns focus to the toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expectHydrated(page);
    const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });

  test('nav picks up its scrolled state', async ({ page }) => {
    await page.goto('/');
    await expectHydrated(page);
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
    await expect(page.locator('.site-nav')).toHaveClass(/scrolled/);
  });

  test('nav links navigate client-side without a full reload', async ({ page }) => {
    await page.goto('/');
    await expectHydrated(page);
    await page.evaluate(() => {
      (window as unknown as { __navMarker: string }).__navMarker = 'kept';
    });
    await page.locator('.site-nav').getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator('h1')).toContainText(/shipped/i);
    const marker = await page.evaluate(
      () => (window as unknown as { __navMarker?: string }).__navMarker,
    );
    expect(marker).toBe('kept');
  });

  test('unknown paths return a real 404 with the branded page', async ({ page }) => {
    const response = await page.goto('/does-not-exist');
    expect(response?.status()).toBe(404);
    await expectHydrated(page);
    await expect(page.locator('h1')).toHaveText('This page took a wrong turn.');
  });
});
