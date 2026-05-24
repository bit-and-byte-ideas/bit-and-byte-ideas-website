import { test, expect } from '@playwright/test';

// The inline Calendly widget has been temporarily removed.
// "Book a Call" in the nav links directly to the external Calendly page.
test.describe('Booking — external Calendly link', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Book a Call nav link is visible', async ({ page }) => {
    const link = page.locator('nav').getByRole('link', { name: /Book a Call/i });
    await expect(link).toBeVisible();
  });

  test('Book a Call nav link href points to external Calendly URL', async ({ page }) => {
    const link = page.locator('nav').getByRole('link', { name: /Book a Call/i });
    await expect(link).toHaveAttribute(
      'href',
      'https://calendly.com/carlos-barajas-bitandbyteideas/30min',
    );
  });

  test('Book a Call nav link opens in a new tab', async ({ page }) => {
    const link = page.locator('nav').getByRole('link', { name: /Book a Call/i });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('no #booking section present on the page', async ({ page }) => {
    await expect(page.locator('#booking')).toHaveCount(0);
  });
});
