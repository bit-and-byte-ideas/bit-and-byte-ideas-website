import { test, expect } from '@playwright/test';

// Inject a minimal Calendly stub before Angular boots so tests are not
// dependent on Calendly's CDN. This tests *our* initialization logic:
// that afterNextRender fires, detects window.Calendly, and calls
// initInlineWidget with the correct arguments.
async function injectCalendlyStub(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    (window as unknown as { Calendly: unknown }).Calendly = {
      initInlineWidget({ url, parentElement }: { url: string; parentElement: Element }) {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.title = 'Calendly Scheduler';
        parentElement.appendChild(iframe);
      },
    };
  });
}

test.describe('Booking / Calendly widget', () => {
  test('booking section is present and accessible', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#booking');
    await expect(section).toBeVisible();
    await expect(section.locator('h2')).toContainText("Let's Talk About");
  });

  test('booking section has correct aria-labelledby wiring', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('section#booking');
    await expect(section).toHaveAttribute('aria-labelledby', 'booking-heading');
    await expect(page.locator('#booking-heading')).toBeVisible();
  });

  test('Calendly container div is rendered', async ({ page }) => {
    await page.goto('/');
    const widget = page.locator('.calendly-inline-widget');
    await expect(widget).toBeVisible();
  });

  test('Calendly widget loads and renders an iframe [critical]', async ({ page }) => {
    await injectCalendlyStub(page);
    await page.goto('/');
    await page.locator('#booking').scrollIntoViewIfNeeded();

    // afterNextRender fires after Angular's first render cycle and calls
    // initInlineWidget, which (via our stub) appends an <iframe>.
    const iframe = page.locator('.calendly-inline-widget iframe').first();
    await expect(iframe).toBeVisible({ timeout: 10_000 });
  });

  test('Calendly iframe src contains the correct Calendly URL slug', async ({ page }) => {
    await injectCalendlyStub(page);
    await page.goto('/');
    await page.locator('#booking').scrollIntoViewIfNeeded();

    const iframe = page.locator('.calendly-inline-widget iframe').first();
    await expect(iframe).toBeVisible({ timeout: 10_000 });

    const src = await iframe.getAttribute('src');
    expect(src).toMatch(/calendly\.com\/carlos-barajas-bitandbyteideas/);
  });

  test('Calendly initInlineWidget receives the correct background and text color params', async ({
    page,
  }) => {
    await injectCalendlyStub(page);
    await page.goto('/');
    await page.locator('#booking').scrollIntoViewIfNeeded();

    const iframe = page.locator('.calendly-inline-widget iframe').first();
    await expect(iframe).toBeVisible({ timeout: 10_000 });

    const src = await iframe.getAttribute('src');
    expect(src).toContain('background_color=111827');
    expect(src).toContain('text_color=f8fafc');
    expect(src).toContain('primary_color=22c55e');
  });
});
