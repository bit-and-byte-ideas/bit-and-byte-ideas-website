import { expect, type Page } from '@playwright/test';

/** Collects CSP violations from the console and from securitypolicyviolation events. */
export async function trackCspViolations(page: Page): Promise<string[]> {
  const consoleViolations: string[] = [];
  page.on('console', (message) => {
    if (/Content Security Policy/i.test(message.text())) consoleViolations.push(message.text());
  });
  await page.addInitScript(() => {
    const record: string[] = [];
    (window as unknown as { __cspViolations: string[] }).__cspViolations = record;
    document.addEventListener('securitypolicyviolation', (event) => {
      record.push(`${event.effectiveDirective} ${event.blockedURI || 'inline'}`);
    });
  });
  return consoleViolations;
}

export async function recordedCspViolations(page: Page): Promise<string[]> {
  return page.evaluate(() => (window as unknown as { __cspViolations: string[] }).__cspViolations);
}

// React attaches __reactProps* keys to DOM nodes it owns once hydration runs.
// The menu toggle is display:none on desktop, hence includeHidden.
export async function expectHydrated(page: Page) {
  const toggle = page.getByRole('button', { name: 'Toggle navigation menu', includeHidden: true });
  await expect
    .poll(() =>
      toggle.evaluate((element) =>
        Object.keys(element).some((key) => key.startsWith('__reactProps')),
      ),
    )
    .toBe(true);
}
