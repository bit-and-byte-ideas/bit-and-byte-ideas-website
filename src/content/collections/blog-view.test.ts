// @vitest-environment node
import { formatDate, orderArticles, relatedSummaries, toArticleDetail, toArticleSummary } from './blog-view.ts';
import { articleData, articleSource, build } from './test-utils.ts';

function articles(...entries: [string, Record<string, unknown>][]) {
  const result = build(entries.map(([slug, overrides]) => articleSource(slug, articleData(overrides))));
  expect(result.issues).toEqual([]);
  return result.blog;
}

const draft = { status: 'draft', publishedOn: undefined, review: undefined };

describe('formatDate', () => {
  it('formats in UTC so the day never shifts', () => {
    expect(formatDate('2026-01-01')).toBe('January 1, 2026');
    expect(formatDate('2026-12-31')).toBe('December 31, 2026');
  });
});

describe('orderArticles', () => {
  it('lists newest first, drafts last, slug breaking ties', () => {
    const ordered = orderArticles(
      articles(
        ['old', { publishedOn: '2025-05-01' }],
        ['unfinished', draft],
        ['new-b', { publishedOn: '2026-03-01' }],
        ['new-a', { publishedOn: '2026-03-01' }],
      ),
    );
    expect(ordered.map((entry) => entry.slug)).toEqual(['new-a', 'new-b', 'old', 'unfinished']);
  });
});

describe('toArticleSummary / toArticleDetail', () => {
  const [entry] = articles([
    'example',
    {
      tags: ['react', 'web-development'],
      updatedOn: '2026-03-02',
      seo: { title: 'Short title' },
    },
  ]);

  it('maps tags to labels and dates to views', () => {
    const summary = toArticleSummary(entry);
    expect(summary).toMatchObject({
      slug: 'example',
      tags: ['React', 'Web development'],
      publishedOn: { iso: '2026-02-01', label: 'February 1, 2026' },
      readingMinutes: 1,
      status: 'published',
      fixture: false,
    });
  });

  it('carries the author, the updated date, and SEO overrides, but no approval records', () => {
    const detail = toArticleDetail(entry);
    expect(detail.author).toEqual({
      name: 'Carlos Barajas',
      role: 'Founder & Engineer',
      url: '/about',
      bio: expect.stringContaining('Bit & Byte Ideas'),
    });
    expect(detail.updatedOn).toEqual({ iso: '2026-03-02', label: 'March 2, 2026' });
    expect(detail.seo).toEqual({ title: 'Short title', description: undefined });
    expect(JSON.stringify(detail)).not.toContain('approvedBy');
  });

  it('has no dates for a draft', () => {
    const [unfinished] = articles(['unfinished', draft]);
    expect(toArticleDetail(unfinished)).toMatchObject({ publishedOn: null, updatedOn: null });
  });
});

describe('relatedSummaries', () => {
  const all = articles(
    ['current', { tags: ['react', 'performance'] }],
    ['two-shared', { tags: ['react', 'performance'], publishedOn: '2025-01-01' }],
    ['one-shared-new', { tags: ['react'], publishedOn: '2026-05-01' }],
    ['one-shared-old', { tags: ['performance'], publishedOn: '2025-06-01' }],
    ['one-shared-oldest', { tags: ['performance'], publishedOn: '2024-06-01' }],
    ['unrelated', { tags: ['go'] }],
    ['draft-shared', { ...draft, tags: ['react', 'performance'] }],
  );
  const current = all.find((entry) => entry.slug === 'current')!;

  it('ranks by shared tags, then newest, up to three, never drafts or itself (D-021)', () => {
    expect(relatedSummaries(current, all).map((summary) => summary.slug)).toEqual([
      'two-shared',
      'one-shared-new',
      'one-shared-old',
    ]);
  });

  it('is empty when nothing shares a tag', () => {
    const lonely = all.find((entry) => entry.slug === 'unrelated')!;
    expect(relatedSummaries(lonely, all)).toEqual([]);
  });
});
