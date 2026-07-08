import { test, expect } from '@playwright/test';

// The inline Calendly widget was removed (dead code in the Angular app).
// "Book a Call" links directly to the external Calendly page everywhere.
test.describe('Booking — external Calendly link', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Book a Call nav link is visible', async ({ page }) => {
    const link = page.locator('.site-nav').getByRole('link', { name: /Book a Call/i });
    await expect(link).toBeVisible();
  });

  test('Book a Call nav link href points to external Calendly URL', async ({ page }) => {
    const link = page.locator('.site-nav').getByRole('link', { name: /Book a Call/i });
    await expect(link).toHaveAttribute(
      'href',
      'https://calendly.com/carlos-barajas-bitandbyteideas/30min',
    );
  });

  test('Book a Call nav link opens in a new tab', async ({ page }) => {
    const link = page.locator('.site-nav').getByRole('link', { name: /Book a Call/i });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('hero primary CTA is Book a Call linking to Calendly', async ({ page }) => {
    const cta = page.locator('.hero').getByRole('link', { name: 'Book a Call' });
    await expect(cta).toHaveAttribute(
      'href',
      'https://calendly.com/carlos-barajas-bitandbyteideas/30min',
    );
  });

  test('no #booking section present on the page', async ({ page }) => {
    await expect(page.locator('#booking')).toHaveCount(0);
  });
});
