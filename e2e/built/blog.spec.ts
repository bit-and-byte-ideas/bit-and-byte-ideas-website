import { test, expect } from '@playwright/test';
import { expectHydrated, isFixtureBuild, recordedCspViolations, trackCspViolations } from './helpers';

// Runs against whichever build is in build/client: the production build (no
// real articles yet, so /blog shows its empty state) or a CONTENT_FIXTURES=1
// build (fixture articles prerendered, the draft never). CI runs both.

const LONG = '/blog/fixture-long-article';

test.describe('Blog in the production build', () => {
  test.skip(isFixtureBuild, 'production-build checks; this is a fixture build');

  test('/blog shows the deliberate empty state and is not indexed (AC-8)', async ({ page }) => {
    const response = await page.goto('/blog');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText('Engineering Notes');
    await expect(page.getByRole('heading', { level: 2, name: 'Articles are on the way' })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(page.locator('a[href^="/blog/"]')).toHaveCount(0);
    await expect(page.locator('.cta-band').getByRole('link')).toHaveCount(2);
  });

  test('fixture and draft article URLs return 404 (AC-8)', async ({ request }) => {
    for (const slug of ['fixture-long-article', 'fixture-draft-article']) {
      expect((await request.get(`/blog/${slug}`)).status()).toBe(404);
    }
  });
});

test.describe('Blog in a fixture build', () => {
  test.skip(!isFixtureBuild, 'fixture-build checks; run after CONTENT_FIXTURES=1 pnpm build');

  test('direct load and refresh of an article return 200 with full content (AC-9)', async ({ page }) => {
    const violations = await trackCspViolations(page);
    for (let load = 0; load < 2; load += 1) {
      const response = load === 0 ? await page.goto(LONG) : await page.reload();
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveText('[Fixture] A long article that exercises every element');
      await expect(page.getByRole('group', { name: 'Code example: TypeScript' })).toBeVisible();
      await expect(page.locator('main [style]')).toHaveCount(0);
    }
    await expectHydrated(page);
    expect(await recordedCspViolations(page)).toEqual([]);
    expect(violations).toEqual([]);
  });

  test('unknown and draft slugs return 404 and keep the branded page after hydration (AC-9)', async ({
    page,
  }) => {
    for (const path of ['/blog/not-an-article', '/blog/fixture-draft-article']) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expectHydrated(page);
      await expect(page.locator('h1')).toHaveText('This page took a wrong turn.');
    }
  });

  test('the index lists the published fixtures only, newest first', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('.blog-list-items h2')).toHaveText([
      '[Fixture] A short article without a table of contents',
      '[Fixture] An article that shares tags for related links',
      '[Fixture] A long article that exercises every element',
    ]);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  });

  test('client navigation: index → article → back, with hydration on', async ({ page }) => {
    await page.goto('/blog');
    await expectHydrated(page);
    await page.evaluate(() => {
      (window as unknown as { __navMarker: string }).__navMarker = 'kept';
    });
    await page.getByRole('link', { name: '[Fixture] A long article that exercises every element' }).click();
    await expect(page).toHaveURL(new RegExp(`${LONG}$`));
    await expect(page.locator('h1')).toHaveText('[Fixture] A long article that exercises every element');
    await expect(page.getByRole('navigation', { name: 'On this page' })).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/blog$/);
    expect(await page.evaluate(() => (window as unknown as { __navMarker?: string }).__navMarker)).toBe('kept');
  });

  test('a TOC link clicked before hydration still lands below the fixed nav (AC-3)', async ({ page }) => {
    // Hold the scripts back so the click happens on the static HTML and hydration
    // (React Router's ScrollRestoration) runs during the smooth scroll.
    await page.route('**/*.js', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 900));
      await route.continue();
    });
    await page.goto(LONG, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.toc-rail').getByRole('link', { name: 'A table' }).click();
    await expectHydrated(page);
    const navBottom = await page.locator('.site-nav').evaluate((nav) => nav.getBoundingClientRect().bottom);
    await expect
      .poll(async () => {
        const top = await page.locator('#a-table').evaluate((heading) => heading.getBoundingClientRect().top);
        return top >= navBottom && top < navBottom + 48;
      })
      .toBe(true);
  });

  test('article data files are served with the configured MIME type', async ({ request }) => {
    const response = await request.get(`${LONG}.data`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('text/x-script');
  });
});
