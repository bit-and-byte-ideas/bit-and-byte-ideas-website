import { test, expect } from '@playwright/test';

test.describe('Site journey', () => {
  test('navigates from home to the about page via the nav', async ({ page }) => {
    await page.goto('/');
    await page.locator('.site-nav').getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator('h1')).toContainText(/been/i);
  });

  test('unknown routes render the branded 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page).toHaveTitle(/not found/i);
    await expect(page.locator('h1')).toContainText(/wrong turn/i);
    await page.getByRole('link', { name: 'Back to Home' }).click();
    await expect(page.locator('h1')).toContainText('We Build');
  });

  test('skip link jumps to main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute('href', '#main-content');
  });

  test('mobile menu opens, navigates, and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
    // Retry the click until hydration has attached the handler — the button
    // exists in the prerendered HTML before React takes over.
    await expect(async () => {
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true', { timeout: 500 });
    }).toPass();
    const menu = page.locator('#mobile-menu');
    await expect(menu.getByRole('link', { name: 'About' })).toBeVisible();
    await menu.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('services card CTA anchors to the contact section', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('.service-card').first().getByRole('link', { name: 'Get in Touch' });
    await cta.click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#contact')).toBeInViewport();
  });
});
