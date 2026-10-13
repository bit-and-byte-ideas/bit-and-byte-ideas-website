// @vitest-environment node
// Route loaders and meta for /blog, run against the repository fixtures
// (Vitest loads content in development mode: drafts and fixtures included).
import type { LoaderFunctionArgs } from 'react-router';
import { countWords, readingMinutes } from '../content/collections/reading-time.ts';
import { getArticle } from '../content/collections/load.server.ts';
import { parseMarkdown } from '../content/collections/markdown.server.ts';
import { loader as articleLoader, meta as articleMeta } from './blog-article';
import { loader as indexLoader, meta as indexMeta } from './blog-index';

const argsFor = (path: string) =>
  ({ request: new Request(`http://localhost${path}`), params: {}, context: {} }) as unknown as LoaderFunctionArgs;

const robots = (descriptors: ReturnType<typeof indexMeta>) =>
  descriptors.find((descriptor) => 'name' in descriptor && descriptor.name === 'robots');

describe('/blog loader', () => {
  it('lists every included article newest first, drafts last', () => {
    expect(indexLoader().articles.map((article) => article.slug)).toEqual([
      'fixture-short-article',
      'fixture-related-article',
      'fixture-long-article',
      'fixture-draft-article',
    ]);
  });

  it('is noindex while only fixtures and drafts exist', () => {
    const loaderData = indexLoader();
    expect(robots(indexMeta({ loaderData } as Parameters<typeof indexMeta>[0]))).toBeDefined();
  });
});

describe('/blog/<slug> loader', () => {
  it('returns the long fixture with a nested TOC, related articles, and its author', () => {
    const result = articleLoader(argsFor('/blog/fixture-long-article'));
    expect(result.article.title).toBe('[Fixture] A long article that exercises every element');
    expect(result.article.author.url).toBe('/about');
    expect(result.article.updatedOn?.iso).toBe('2026-02-01');
    expect(result.toc.filter((item) => item.depth === 2)).toHaveLength(5);
    expect(result.toc.filter((item) => item.depth === 3).map((item) => item.id)).toEqual([
      'a-level-three-heading',
      'closing-notes',
    ]);
    expect(result.related.map((article) => article.slug)).toEqual([
      'fixture-related-article',
      'fixture-short-article',
    ]);
    expect(Object.keys(result.bodyImages)).toEqual(['./images/diagram.png']);
  });

  it('reports the D-020 reading time', () => {
    const entry = getArticle('fixture-long-article')!;
    const expected = readingMinutes(countWords(parseMarkdown(entry.body)));
    expect(articleLoader(argsFor('/blog/fixture-long-article')).article.readingMinutes).toBe(expected);
  });

  it('has no TOC for the short fixture, and reads the slug from .data requests', () => {
    const result = articleLoader(argsFor('/blog/fixture-short-article.data'));
    expect(result.article.slug).toBe('fixture-short-article');
    expect(result.toc).toEqual([]);
  });

  it('serves the draft in development, without dates or related articles', () => {
    const result = articleLoader(argsFor('/blog/fixture-draft-article'));
    expect(result.article.status).toBe('draft');
    expect(result.article.publishedOn).toBeNull();
    expect(result.related).toEqual([]);
  });

  it('throws a 404 for an unknown slug', () => {
    let thrown: unknown;
    try {
      articleLoader(argsFor('/blog/not-an-article'));
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toMatchObject({ init: { status: 404 } });
  });

  it('marks fixtures noindex and uses the not-found meta without data', () => {
    const loaderData = articleLoader(argsFor('/blog/fixture-short-article'));
    const withData = articleMeta({ loaderData } as Parameters<typeof articleMeta>[0]);
    expect(withData.find((descriptor) => 'title' in descriptor)).toEqual({
      title: '[Fixture] A short article without a table of contents — Bit & Byte Ideas',
    });
    expect(robots(withData)).toBeDefined();
    const notFound = articleMeta({ loaderData: undefined } as Parameters<typeof articleMeta>[0]);
    expect(notFound.find((descriptor) => 'title' in descriptor)).toEqual({
      title: 'Page Not Found — Bit & Byte Ideas',
    });
  });
});
