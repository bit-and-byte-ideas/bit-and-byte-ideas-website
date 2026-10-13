// @vitest-environment node
import { parseMarkdown } from './markdown.server.ts';
import { countWords, readingMinutes, WORDS_PER_MINUTE } from './reading-time.ts';
import { relatedArticles } from './related.ts';
import { showToc, tocItems } from './toc.ts';
import type { Heading } from './markdown.server.ts';

const words = (count: number) => Array.from({ length: count }, (_, index) => `word${index}`).join(' ');

describe('reading time (D-020)', () => {
  it('counts prose and inline code but not fenced code', () => {
    const tree = parseMarkdown('Three words here `and inline`.\n\n```ts\nconst ignored = "all of this";\n```\n');
    expect(countWords(tree)).toBe(5);
  });

  it('rounds up at 225 words per minute, minimum one minute', () => {
    expect(readingMinutes(0)).toBe(1);
    expect(readingMinutes(WORDS_PER_MINUTE)).toBe(1);
    expect(readingMinutes(WORDS_PER_MINUTE + 1)).toBe(2);
    expect(readingMinutes(countWords(parseMarkdown(words(900))))).toBe(4);
  });
});

describe('table of contents (D-022)', () => {
  const heading = (depth: Heading['depth'], id: string): Heading => ({ depth, id, text: id });
  const three = [heading(2, 'a'), heading(3, 'a1'), heading(4, 'a1x'), heading(2, 'b'), heading(2, 'c')];

  it('lists H2 and H3 only, in order', () => {
    expect(tocItems(three).map((item) => item.id)).toEqual(['a', 'a1', 'b', 'c']);
  });

  it('shows automatically from three H2s', () => {
    expect(showToc(three, 'auto')).toBe(true);
    expect(showToc(three.slice(0, 4), 'auto')).toBe(false);
  });

  it('respects show and hide', () => {
    expect(showToc([heading(2, 'only')], 'show')).toBe(true);
    expect(showToc([], 'show')).toBe(false);
    expect(showToc(three, 'hide')).toBe(false);
  });
});

describe('related articles (D-021)', () => {
  const article = (slug: string, tags: string[], publishedOn: string) => ({ slug, tags, publishedOn });
  const current = article('current', ['react', 'performance', 'web-development'], '2026-01-15');
  const candidates = [
    current,
    article('one-shared-new', ['react'], '2026-05-01'),
    article('two-shared', ['performance', 'web-development'], '2026-02-10'),
    article('one-shared-old', ['performance'], '2025-01-01'),
    article('no-shared', ['go'], '2026-06-01'),
    article('one-shared-new-b', ['web-development'], '2026-05-01'),
  ];

  it('ranks by shared tags, then newest, then slug; excludes self and unrelated', () => {
    expect(relatedArticles(current, candidates).map((entry) => entry.slug)).toEqual([
      'two-shared',
      'one-shared-new',
      'one-shared-new-b',
    ]);
  });

  it('returns nothing when no article shares a tag', () => {
    expect(relatedArticles(article('x', ['security'], '2026-01-01'), candidates)).toEqual([]);
  });
});
