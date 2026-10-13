import { test, expect, type Page } from '@playwright/test';
import { expectHydrated } from './built/helpers';

// Dev server: drafts and fixtures are included (docs/website/ARCHITECTURE.md, build modes).
const CALENDLY = 'https://calendly.com/carlos-barajas-bitandbyteideas/30min';
const LONG = '/blog/fixture-long-article';
const SHORT = '/blog/fixture-short-article';
const RELATED = '/blog/fixture-related-article';
const DRAFT = '/blog/fixture-draft-article';

async function expectNoSkippedHeadings(page: Page) {
  await expect(page.locator('main h1')).toHaveCount(1);
  const levels = await page
    .locator('main h1, main h2, main h3, main h4')
    .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName[1])));
  levels.forEach((level, index) => {
    if (index > 0) expect(level).toBeLessThanOrEqual(levels[index - 1] + 1);
  });
}

test.describe('Blog index (dev, fixtures)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('lists articles newest first, drafts last (AC-1)', async ({ page }) => {
    await expect(page.locator('main h1')).toHaveText('Engineering Notes');
    await expect(page.locator('.blog-list-items h2')).toHaveText([
      '[Fixture] A short article without a table of contents',
      '[Fixture] An article that shares tags for related links',
      '[Fixture] A long article that exercises every element',
      '[Fixture] Draft article that must never ship',
    ]);
  });

  test('each row has a title link, description, dated time, reading time, and topics (AC-1)', async ({ page }) => {
    const row = page.locator('.blog-list-items > li').nth(2);
    await expect(row.getByRole('heading', { level: 2 }).getByRole('link')).toHaveAttribute('href', LONG);
    await expect(row.getByText(/Development fixture for long-form typography/)).toBeVisible();
    await expect(row.locator('time')).toHaveAttribute('datetime', '2026-01-15');
    await expect(row.locator('time')).toHaveText('January 15, 2026');
    await expect(row.getByText(/^\d+ min read$/)).toBeVisible();
    await expect(row.locator('.article-card-tags')).toHaveText('Topics: React · Performance · Web development');
    // The draft has no date, and says so with a tag.
    const draft = page.locator('.blog-list-items > li').last();
    await expect(draft.locator('time')).toHaveCount(0);
    await expect(draft.getByText('Draft', { exact: true })).toBeVisible();
  });

  test('has one H1 and no skipped heading levels', async ({ page }) => {
    await expectNoSkippedHeadings(page);
  });

  test('a click anywhere on a row opens the article', async ({ page }) => {
    const row = page.locator('.article-card').first();
    const description = await row.locator('.article-card-description').boundingBox();
    await page.mouse.click(description!.x + 10, description!.y + description!.height / 2);
    await expect(page).toHaveURL(new RegExp(`${SHORT}$`));
  });

  test('keyboard: article links are reachable in order with a visible focus ring', async ({ page }) => {
    const order: string[] = [];
    for (let i = 0; i < 25 && order.length < 4; i += 1) {
      await page.keyboard.press('Tab');
      const href = await page.evaluate(() => document.activeElement?.getAttribute('href') ?? '');
      if (href.startsWith('/blog/')) {
        order.push(href);
        const ring = await page.evaluate(
          () => getComputedStyle(document.activeElement as Element, '::after').outlineStyle,
        );
        expect(ring).toBe('solid');
      }
    }
    expect(order).toEqual([SHORT, RELATED, LONG, DRAFT]);
  });
});

test.describe('Article page (dev, fixtures)', () => {
  test('header: one H1, description, byline to /about, dates, reading time, topics (AC-2)', async ({ page }) => {
    await page.goto('/blog');
    const minutes = await page.locator('.blog-list-items > li').nth(2).getByText(/min read$/).textContent();
    await page.goto(LONG);
    await expectNoSkippedHeadings(page);
    await expect(page.locator('main h1')).toHaveText('[Fixture] A long article that exercises every element');
    await expect(page.getByText(/^Development fixture for long-form typography/)).toBeVisible();
    const meta = page.locator('.article-meta');
    await expect(meta.getByRole('link', { name: 'Carlos Barajas' })).toHaveAttribute('href', '/about');
    await expect(meta.locator('time')).toHaveCount(2);
    await expect(meta.getByText('Published').locator('+ dd time')).toHaveAttribute('datetime', '2026-01-15');
    await expect(meta.getByText('Updated').locator('+ dd time')).toHaveAttribute('datetime', '2026-02-01');
    await expect(meta.getByText('Reading time').locator('+ dd')).toHaveText(minutes!);
    await expect(meta.getByText('Topics').locator('+ dd')).toHaveText('React · Performance · Web development');
  });

  test('"Updated" appears only when the article has an updated date (AC-2)', async ({ page }) => {
    await page.goto(SHORT);
    await expect(page.locator('.article-meta').getByText('Published')).toBeVisible();
    await expect(page.locator('.article-meta').getByText('Updated')).toHaveCount(0);
  });

  test('the long article has a TOC whose links land below the fixed nav (AC-3)', async ({ page }) => {
    await page.goto(LONG);
    const toc = page.getByRole('navigation', { name: 'On this page' });
    await expect(toc.getByRole('link')).toHaveText([
      'Headings and paragraphs',
      'A level-three heading',
      'Lists and quotes',
      'Code examples',
      'A table',
      'An image',
      'Closing notes',
    ]);
    // Dev only: Vite injects some route CSS at hydration, which shifts the page under a
    // smooth scroll already in flight (~29px). Built pages link all CSS up front and land
    // correctly even when clicked before hydration (e2e/built/blog.spec.ts covers that).
    await page.evaluate(() => document.fonts.ready);
    await expectHydrated(page);
    await toc.getByRole('link', { name: 'A table' }).click();
    await expect(page).toHaveURL(/#a-table$/);
    const navBottom = await page.locator('.site-nav').evaluate((nav) => nav.getBoundingClientRect().bottom);
    // Smooth scrolling: wait for the heading to settle just under the nav (scroll-margin-top).
    const top = () => page.locator('#a-table').evaluate((heading) => heading.getBoundingClientRect().top);
    await expect.poll(async () => {
      const value = await top();
      return value >= navBottom && value < navBottom + 48;
    }).toBe(true);
  });

  test('below 1100px the TOC is a collapsed disclosure above the body (AC-3)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(LONG);
    const toc = page.getByRole('navigation', { name: 'On this page' });
    await expect(toc.getByRole('link', { name: 'A table' })).toBeHidden();
    await toc.locator('summary').click();
    await expect(toc.getByRole('link', { name: 'A table' })).toBeVisible();
  });

  test('the short article has no TOC (AC-3)', async ({ page }) => {
    await page.goto(SHORT);
    await expect(page.getByRole('navigation', { name: 'On this page' })).toHaveCount(0);
  });

  test('code blocks are focusable, named by language, class-highlighted, and scroll inside (AC-4)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(LONG);
    for (const name of ['Code example: TypeScript', 'Code example: Go', 'Code example: Text']) {
      await expect(page.getByRole('group', { name })).toHaveAttribute('tabindex', '0');
    }
    const ts = page.getByRole('group', { name: 'Code example: TypeScript' });
    await expect(ts.locator('.hljs-keyword').first()).toBeVisible();
    await expect(page.locator('main [style]')).toHaveCount(0);
    const text = page.getByRole('group', { name: 'Code example: Text' });
    expect(await text.evaluate((pre) => pre.scrollWidth > pre.clientWidth)).toBe(true);
    await text.focus();
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => text.evaluate((pre) => pre.scrollLeft)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test('prose: underlined links, lists, quote, focusable table, captioned figure, 16px+ at 375px (AC-5)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(LONG);
    const body = page.locator('.content-body');
    const decoration = await body
      .getByRole('link', { name: 'link to the work index' })
      .evaluate((link) => getComputedStyle(link).textDecorationLine);
    expect(decoration).toContain('underline');
    await expect(body.locator('ul > li')).toHaveCount(3);
    await expect(body.locator('ol > li')).toHaveCount(3);
    await expect(body.locator('blockquote')).toBeVisible();
    const table = page.getByRole('group', { name: 'Table: Element, Purpose' });
    await expect(table).toHaveAttribute('tabindex', '0');
    await expect(table.getByRole('table')).toBeVisible();
    const figure = body.locator('figure');
    await expect(figure.getByRole('img', { name: /placeholder standing in for a diagram/ })).toBeVisible();
    await expect(figure.locator('figcaption')).toHaveText('Fixture caption: a placeholder, not a real diagram.');
    const size = await body.locator('p').first().evaluate((p) => parseFloat(getComputedStyle(p).fontSize));
    expect(size).toBeGreaterThanOrEqual(16);
  });

  test('the reading column never exceeds the prose measure (AC-5)', async ({ page }) => {
    await page.goto(LONG);
    const { width, max } = await page
      .locator('.content-body')
      .evaluate((body) => ({ width: body.getBoundingClientRect().width, max: parseFloat(getComputedStyle(body).maxWidth) }));
    expect(max).toBeGreaterThan(0);
    expect(width).toBeLessThanOrEqual(max);
  });

  test('section headings have permalinks that keep the heading name clean', async ({ page }) => {
    await page.goto(LONG);
    await expect(page.getByRole('heading', { level: 2, name: 'Code examples', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Link to section Code examples' })).toHaveAttribute(
      'href',
      '#code-examples',
    );
  });

  test('related articles follow D-021 and are absent when none qualify (AC-6)', async ({ page }) => {
    await page.goto(LONG);
    const related = page.getByRole('region', { name: 'Related articles' });
    await expect(related.getByRole('heading', { level: 3 })).toHaveText([
      '[Fixture] An article that shares tags for related links',
      '[Fixture] A short article without a table of contents',
    ]);
    await page.goto(RELATED);
    await expect(page.getByRole('region', { name: 'Related articles' }).getByRole('heading', { level: 3 })).toHaveText([
      '[Fixture] A long article that exercises every element',
    ]);
    await page.goto(DRAFT);
    await expect(page.getByRole('region', { name: 'Related articles' })).toHaveCount(0);
  });

  test('the author box links the profile', async ({ page }) => {
    await page.goto(SHORT);
    const author = page.getByRole('region', { name: 'About the author' });
    await expect(author.getByText('Founder & Engineer')).toBeVisible();
    await expect(author.getByRole('link', { name: /More about Carlos Barajas/ })).toHaveAttribute('href', '/about');
  });

  test('every article ends with the two site CTAs (AC-7)', async ({ page }) => {
    for (const path of [LONG, SHORT, DRAFT]) {
      await page.goto(path);
      const band = page.locator('.cta-band');
      await expect(band.getByRole('link')).toHaveCount(2);
      await expect(band.getByRole('link', { name: /Book a Call/ })).toHaveAttribute('href', CALENDLY);
      await expect(band.getByRole('link', { name: /Book a Call/ })).toHaveAttribute('target', '_blank');
      await expect(band.getByRole('link', { name: 'Get in Touch' })).toHaveAttribute('href', '/#contact');
    }
  });

  test('the draft fixture shows the Draft banner (AC-1)', async ({ page }) => {
    await page.goto(DRAFT);
    await expect(page.getByRole('note')).toHaveAttribute('data-content-status', 'draft');
    await expect(page.getByRole('note')).toContainText('Draft');
  });

  test('back link returns to the index', async ({ page }) => {
    await page.goto(SHORT);
    await page.getByRole('link', { name: 'All articles' }).click();
    await expect(page).toHaveURL(/\/blog$/);
  });

  test('unknown slugs show the branded not-found page', async ({ page }) => {
    await page.goto('/blog/not-an-article');
    await expect(page.locator('h1')).toHaveText('This page took a wrong turn.');
  });
});
