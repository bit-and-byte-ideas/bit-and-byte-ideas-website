// @vitest-environment node
import { slugFromRequest } from './request-slug.ts';

describe('slugFromRequest', () => {
  it.each([
    ['http://localhost/blog/an-article', 'an-article'],
    ['http://localhost/blog/an-article/', 'an-article'],
    ['http://localhost/blog/an-article.data', 'an-article'],
    ['http://localhost/work/a-project?x=1#top', 'a-project'],
  ])('%s → %s', (url, slug) => {
    expect(slugFromRequest(new Request(url))).toBe(slug);
  });
});
