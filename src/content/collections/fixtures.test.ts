// @vitest-environment node
// The real fixtures under src/content/fixtures/, loaded both ways: through the
// Vite glob used by route loaders, and through node:fs used by scripts.
import { getArticle, getProject, loadContent, renderEntry } from './load.server.ts';
import { diskImageCheck, fileExistsIn, readContentSources } from './fs-sources.ts';
import { listContentPaths } from './paths.ts';
import { relatedArticles } from './related.ts';
import { showToc } from './toc.ts';
import { todayUtc } from './filter.ts';
import { buildCollections, formatIssue } from './validate.server.ts';

const TODAY = '2026-10-12';

describe('repository content', () => {
  it('validates every source on disk with no issues', () => {
    const result = buildCollections(readContentSources(), {
      today: todayUtc(),
      fileExists: fileExistsIn(),
      checkImage: diskImageCheck(),
    });
    expect(result.issues.map(formatIssue)).toEqual([]);
  });

  it('marks every fixture as a fixture with a [Fixture] title', () => {
    for (const entry of [...loadContent().work, ...loadContent().blog].filter((item) => item.fixture)) {
      expect(entry.data.title.startsWith('[Fixture]')).toBe(true);
      expect(entry.data.fixture).toBe(true);
    }
  });
});

describe('loader (Vite glob, development mode under Vitest)', () => {
  it('includes drafts and fixtures in development', () => {
    const content = loadContent();
    expect(content.mode).toBe('development');
    expect(content.work.map((entry) => entry.slug).sort()).toEqual([
      'fixture-client-greenhouse',
      'fixture-concept-ferry-weather',
      'fixture-draft-unfinished',
      'fixture-internal-invoice-robot',
    ]);
    expect(content.blog).toHaveLength(4);
  });

  it('renders the long fixture with a table of contents and every element', () => {
    const article = getArticle('fixture-long-article');
    expect(article).toBeDefined();
    const { headings } = renderEntry(article!);
    expect(showToc(headings, article!.data.toc)).toBe(true);
    expect(headings.filter((heading) => heading.depth === 2).map((heading) => heading.id)).toEqual([
      'headings-and-paragraphs',
      'lists-and-quotes',
      'code-examples',
      'a-table',
      'an-image',
    ]);
    expect(article!.readingMinutes).toBeGreaterThanOrEqual(2);
  });

  it('keeps the short fixture below the table-of-contents threshold', () => {
    const article = getArticle('fixture-short-article')!;
    expect(showToc(renderEntry(article).headings, article.data.toc)).toBe(false);
  });

  it('ranks related fixtures by shared tags', () => {
    const current = getArticle('fixture-long-article')!;
    const published = loadContent().blog.filter((entry) => entry.data.publishedOn);
    const related = relatedArticles(
      { slug: current.slug, tags: current.data.tags, publishedOn: current.data.publishedOn! },
      published.map((entry) => ({ slug: entry.slug, tags: entry.data.tags, publishedOn: entry.data.publishedOn! })),
    );
    expect(related.map((entry) => entry.slug)).toEqual(['fixture-related-article', 'fixture-short-article']);
  });

  it('returns undefined for unknown slugs', () => {
    expect(getProject('does-not-exist')).toBeUndefined();
  });
});

describe('prerender paths (node:fs)', () => {
  it('lists nothing for production while only fixtures exist', () => {
    expect(listContentPaths({ mode: 'production', today: TODAY })).toEqual([]);
  });

  it('lists published fixtures, never drafts, for fixture builds', () => {
    expect(listContentPaths({ mode: 'fixtures', today: TODAY }).sort()).toEqual([
      '/blog/fixture-long-article',
      '/blog/fixture-related-article',
      '/blog/fixture-short-article',
      '/work/fixture-client-greenhouse',
      '/work/fixture-concept-ferry-weather',
      '/work/fixture-internal-invoice-robot',
    ]);
  });
});
