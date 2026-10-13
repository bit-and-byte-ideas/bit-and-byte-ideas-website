import { test, expect } from '@playwright/test';
import { expectHydrated, isFixtureBuild, recordedCspViolations, trackCspViolations } from './helpers';

// Runs against whichever build is in build/client: the production build (no
// real content yet, so /work shows its empty state) or a CONTENT_FIXTURES=1
// build (fixture projects prerendered). CI runs both.

test.describe('Work in the production build', () => {
  test.skip(isFixtureBuild, 'production-build checks; this is a fixture build');

  test('/work shows the deliberate empty state and is not indexed', async ({ page }) => {
    const response = await page.goto('/work');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText('Selected Work');
    await expect(page.getByRole('heading', { level: 2, name: 'Case studies are on the way' })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(page.locator('a[href^="/work/"]')).toHaveCount(0);
  });

  test('fixture and draft project URLs return 404', async ({ request }) => {
    for (const slug of ['fixture-client-greenhouse', 'fixture-draft-unfinished']) {
      expect((await request.get(`/work/${slug}`)).status()).toBe(404);
    }
  });
});

test.describe('Work in a fixture build', () => {
  test.skip(!isFixtureBuild, 'fixture-build checks; run after CONTENT_FIXTURES=1 pnpm build');

  test('direct load and refresh of a project return 200 with full content', async ({ page }) => {
    const violations = await trackCspViolations(page);
    for (let load = 0; load < 2; load += 1) {
      const response = load === 0 ? await page.goto('/work/fixture-client-greenhouse') : await page.reload();
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveText('[Fixture] Client project: Lunar Greenhouse Supply');
      await expect(page.locator('.case-study h2')).toHaveText(['Problem', 'Constraints', 'Approach', 'Solution', 'Outcomes']);
    }
    await expectHydrated(page);
    expect(await recordedCspViolations(page)).toEqual([]);
    expect(violations).toEqual([]);
  });

  test('unknown and draft slugs return 404 and keep the branded page after hydration', async ({ page }) => {
    for (const path of ['/work/not-a-project', '/work/fixture-draft-unfinished']) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expectHydrated(page);
      await expect(page.locator('h1')).toHaveText('This page took a wrong turn.');
    }
  });

  test('client navigation: index → project → back, with hydration on', async ({ page }) => {
    await page.goto('/work');
    await expectHydrated(page);
    await page.evaluate(() => {
      (window as unknown as { __navMarker: string }).__navMarker = 'kept';
    });
    await page.getByRole('link', { name: '[Fixture] Internal project: Imaginary invoice robot' }).click();
    await expect(page).toHaveURL(/\/work\/fixture-internal-invoice-robot$/);
    await expect(page.locator('h1')).toHaveText('[Fixture] Internal project: Imaginary invoice robot');
    await page.goBack();
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.locator('h1')).toHaveText('Selected Work');
    expect(await page.evaluate(() => (window as unknown as { __navMarker?: string }).__navMarker)).toBe('kept');
  });

  test('project data files are served with the configured MIME type', async ({ request }) => {
    const response = await request.get('/work/fixture-client-greenhouse.data');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('text/x-script');
  });
});
