// @vitest-environment node
import { buildOutputMode, contentMode, isIncluded, isScheduled, todayUtc, type Includable } from './filter.ts';

const TODAY = '2026-10-12';
const published: Includable = { status: 'published', fixture: false, publishedOn: '2026-01-01' };
const draft: Includable = { ...published, status: 'draft' };
const fixture: Includable = { ...published, fixture: true };
const draftFixture: Includable = { ...fixture, status: 'draft' };
const scheduled: Includable = { ...published, publishedOn: '2026-12-01' };
const project: Includable = { status: 'published', fixture: false };

describe('isIncluded', () => {
  it.each([
    ['published', published, true],
    ['draft', draft, false],
    ['fixture', fixture, false],
    ['draft fixture', draftFixture, false],
    ['scheduled', scheduled, false],
    ['published project (no date)', project, true],
  ])('production: %s → %s', (_name, entry, expected) => {
    expect(isIncluded(entry, { mode: 'production', today: TODAY })).toBe(expected);
  });

  it.each([
    ['published', published, true],
    ['draft', draft, false],
    ['fixture', fixture, true],
    ['draft fixture', draftFixture, false],
    ['scheduled', scheduled, false],
  ])('fixtures: %s → %s', (_name, entry, expected) => {
    expect(isIncluded(entry, { mode: 'fixtures', today: TODAY })).toBe(expected);
  });

  it.each([published, draft, fixture, draftFixture, scheduled])('development includes everything', (entry) => {
    expect(isIncluded(entry, { mode: 'development', today: TODAY })).toBe(true);
  });

  it('includes an article published today', () => {
    expect(isIncluded({ ...published, publishedOn: TODAY }, { mode: 'production', today: TODAY })).toBe(true);
    expect(isScheduled({ ...published, publishedOn: TODAY }, TODAY)).toBe(false);
  });
});

describe('modes', () => {
  it('derives the mode from NODE_ENV and CONTENT_FIXTURES', () => {
    expect(contentMode({ NODE_ENV: 'development' })).toBe('development');
    expect(contentMode({ NODE_ENV: 'test', CONTENT_FIXTURES: '1' })).toBe('development');
    expect(contentMode({ NODE_ENV: 'production' })).toBe('production');
    expect(contentMode({ NODE_ENV: 'production', CONTENT_FIXTURES: '1' })).toBe('fixtures');
  });

  it('treats post-build checks as production unless fixtures are requested', () => {
    expect(buildOutputMode({})).toBe('production');
    expect(buildOutputMode({ CONTENT_FIXTURES: '1' })).toBe('fixtures');
    expect(buildOutputMode({ CONTENT_FIXTURES: 'true' })).toBe('production');
  });

  it('formats today as a UTC date', () => {
    expect(todayUtc(new Date('2026-10-13T02:30:00Z'))).toBe('2026-10-13');
  });
});
