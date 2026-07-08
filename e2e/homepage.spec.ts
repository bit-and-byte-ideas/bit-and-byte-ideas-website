import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Bit.*Byte.*Ideas/i);
  });

  test('renders navigation with all links', async ({ page }) => {
    const nav = page.locator('.site-nav');
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Services' })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Get in Touch/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Book a Call/i })).toBeVisible();
  });

  test('nav Services link points to the services anchor', async ({ page }) => {
    const link = page.locator('.site-nav').getByRole('link', { name: 'Services' });
    await expect(link).toHaveAttribute('href', '/#services');
  });

  test('nav Book a Call link opens external Calendly URL', async ({ page }) => {
    const link = page.locator('.site-nav').getByRole('link', { name: /Book a Call/i });
    await expect(link).toHaveAttribute(
      'href',
      'https://calendly.com/carlos-barajas-bitandbyteideas/30min',
    );
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('renders hero h1 headline', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('We Build');
  });

  test('renders services section with 3 cards', async ({ page }) => {
    const section = page.locator('#services');
    await expect(section).toBeVisible();
    const cards = section.locator('.service-card');
    await expect(cards).toHaveCount(3);
  });

  test('services section contains all three service titles', async ({ page }) => {
    const section = page.locator('#services');
    await expect(section).toContainText('Static Website Development');
    await expect(section).toContainText('Web Application Development');
    await expect(section).toContainText('Maintenance + Hosting');
  });

  test('renders contact section with email address', async ({ page }) => {
    const contact = page.locator('#contact');
    await expect(contact).toBeVisible();
    await expect(contact).toContainText('bitandbyteideas.com');
  });

  test('renders footer with copyright', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(String(new Date().getFullYear()));
    await expect(footer).toContainText('Bit & Byte Ideas');
  });

  test('nav gains scrolled class after scrolling', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForFunction(() =>
      document.querySelector('.site-nav')?.classList.contains('scrolled'),
    );
    await expect(page.locator('.site-nav')).toHaveClass(/scrolled/);
  });
});
