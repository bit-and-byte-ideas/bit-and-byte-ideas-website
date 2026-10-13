import { test, expect } from '@playwright/test';

// Dev server: drafts and fixtures are included (docs/website/ARCHITECTURE.md, build modes).
const CALENDLY = 'https://calendly.com/carlos-barajas-bitandbyteideas/30min';

test.describe('Work index (dev, fixtures)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/work');
  });

  test('lists projects in display order: featured ranks, then most recent', async ({ page }) => {
    const titles = page.locator('.work-list-items h2');
    await expect(titles).toHaveText([
      '[Fixture] Client project: Lunar Greenhouse Supply',
      '[Fixture] Internal project: Imaginary invoice robot',
      '[Fixture] Concept: Weather board for a fictional ferry',
      '[Fixture] Draft: unfinished case study',
    ]);
  });

  test('each row shows kind, title link, summary, and industry; covers when present', async ({ page }) => {
    const first = page.locator('.work-list-items > li').first();
    await expect(first.getByText('Client project', { exact: true })).toBeVisible();
    await expect(first.getByRole('link', { name: '[Fixture] Client project: Lunar Greenhouse Supply' })).toHaveAttribute(
      'href',
      '/work/fixture-client-greenhouse',
    );
    await expect(first.getByText(/invented to exercise the gallery layout/)).toBeVisible();
    await expect(first.getByText(/Fictional: lunar greenhouses/)).toBeVisible();
    await expect(first.getByRole('img', { name: /desktop homepage screenshot/ })).toBeVisible();
    await expect(page.locator('.work-list-items > li').nth(2).getByText('Concept', { exact: true })).toBeVisible();
  });

  test('has exactly one H1 and no skipped heading levels', async ({ page }) => {
    await expect(page.locator('main h1')).toHaveCount(1);
    const levels = await page.locator('main h1, main h2, main h3, main h4').evaluateAll((nodes) =>
      nodes.map((node) => Number(node.tagName[1])),
    );
    levels.forEach((level, index) => {
      if (index > 0) expect(level).toBeLessThanOrEqual(levels[index - 1] + 1);
    });
  });

  test('a click anywhere on a row opens the project (whole row is the target)', async ({ page }) => {
    const row = page.locator('.project-row').first();
    const box = await row.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    // Click the screenshot's centre: the title link's stretched overlay must take it.
    const frame = await row.locator('.screenshot-frame').boundingBox();
    await page.mouse.click(frame!.x + frame!.width / 2, frame!.y + frame!.height / 2);
    await expect(page).toHaveURL(/\/work\/fixture-client-greenhouse$/);
  });

  test('keyboard: project links are reachable in order with a visible focus ring', async ({ page }) => {
    const order: string[] = [];
    for (let i = 0; i < 25 && order.length < 4; i += 1) {
      await page.keyboard.press('Tab');
      const href = await page.evaluate(() => document.activeElement?.getAttribute('href') ?? '');
      if (href.startsWith('/work/')) {
        order.push(href);
        const ring = await page.evaluate(() => {
          const element = document.activeElement as Element;
          return getComputedStyle(element, '::after').outlineStyle;
        });
        expect(ring).toBe('solid');
      }
    }
    expect(order).toEqual([
      '/work/fixture-client-greenhouse',
      '/work/fixture-internal-invoice-robot',
      '/work/fixture-concept-ferry-weather',
      '/work/fixture-draft-unfinished',
    ]);
  });
});

test.describe('Project page (dev, fixtures)', () => {
  test('client fixture shows every field, the four sections, and verified outcomes only', async ({ page }) => {
    await page.goto('/work/fixture-client-greenhouse');
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toHaveText('[Fixture] Client project: Lunar Greenhouse Supply');
    await expect(page.getByText('Client project', { exact: true })).toBeVisible();
    const details = page.getByRole('complementary', { name: 'Project details' });
    for (const text of [
      'Fictional: lunar greenhouses',
      'Website',
      'Website & Application Development',
      'Maintenance + Hosting',
      'React',
      'March 2026',
    ]) {
      await expect(details.getByText(text, { exact: true })).toBeVisible();
    }
    const live = details.getByRole('link', { name: /Visit the site/ });
    await expect(live).toHaveAttribute('href', 'https://example.com');
    await expect(live).toHaveAttribute('target', '_blank');
    await expect(live).toContainText('(opens in new tab)');
    const sections = page.locator('.case-study h2');
    await expect(sections).toHaveText(['Problem', 'Constraints', 'Approach', 'Solution', 'Outcomes']);
    await expect(page.getByText(/this sentence tests how a verified result is displayed/)).toBeVisible();
    await expect(page.getByText(/Nothing was measured/)).toHaveCount(0); // evidence never renders
    await expect(page.getByRole('img', { name: /mobile homepage screenshot/ })).toBeAttached();
  });

  test('concept fixture is labeled Concept and has no outcomes', async ({ page }) => {
    await page.goto('/work/fixture-concept-ferry-weather');
    await expect(page.getByText('Concept', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Outcomes' })).toHaveCount(0);
  });

  test('draft fixture shows the Draft banner', async ({ page }) => {
    await page.goto('/work/fixture-draft-unfinished');
    await expect(page.getByRole('note')).toHaveAttribute('data-content-status', 'draft');
    await expect(page.getByRole('note')).toContainText('Draft');
  });

  test('ends with the two site CTAs', async ({ page }) => {
    await page.goto('/work/fixture-internal-invoice-robot');
    const band = page.locator('.cta-band');
    await expect(band.getByRole('link')).toHaveCount(2);
    await expect(band.getByRole('link', { name: /Book a Call/ })).toHaveAttribute('href', CALENDLY);
    await expect(band.getByRole('link', { name: /Book a Call/ })).toHaveAttribute('target', '_blank');
    await expect(band.getByRole('link', { name: 'Get in Touch' })).toHaveAttribute('href', '/#contact');
  });

  test('links to the next project and back to all work', async ({ page }) => {
    await page.goto('/work/fixture-client-greenhouse');
    await expect(page.getByRole('navigation', { name: 'More work' }).getByRole('link')).toHaveAttribute(
      'href',
      '/work/fixture-internal-invoice-robot',
    );
    await page.getByRole('link', { name: 'All work' }).click();
    await expect(page).toHaveURL(/\/work$/);
  });

  test('unknown slugs show the branded not-found page', async ({ page }) => {
    await page.goto('/work/not-a-project');
    await expect(page.locator('h1')).toHaveText('This page took a wrong turn.');
  });
});
