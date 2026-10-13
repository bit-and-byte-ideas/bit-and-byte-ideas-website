// @vitest-environment node
import { findLeaks, leakMarkers, strayMedia } from './build-guard.ts';
import { articleData, articleSource, build, projectData, source, PROJECT_BODY } from './test-utils.ts';

const result = build([
  articleSource('weekly-draft-notes', articleData({ title: 'Notes we have not finished yet', status: 'draft' })),
  source(
    'src/content/fixtures/work/fixture-demo/index.md',
    projectData({ title: '[Fixture] Demo project for tests', fixture: true }),
    PROJECT_BODY,
  ),
]);
const [draft] = result.blog;
const [fixture] = result.work;

describe('leak markers', () => {
  it('builds valid entries for the guard to check', () => {
    expect(result.issues).toEqual([]);
  });

  it('flags a draft by URL, quoted slug, and title, in HTML-escaped form too', () => {
    const markers = leakMarkers([draft], 'production');
    const leaks = findLeaks(
      [
        { path: 'build/client/index.html', text: '<a href="/blog/weekly-draft-notes">x</a>' },
        { path: 'build/client/blog.data', text: '["slug","weekly-draft-notes"]' },
        { path: 'build/client/rss.xml', text: '<title>Notes we have not finished yet</title>' },
      ],
      markers,
    );
    expect(leaks.map((leak) => leak.label)).toEqual([
      'draft URL /blog/weekly-draft-notes',
      'draft slug "weekly-draft-notes"',
      'draft title "Notes we have not finished yet"',
    ]);
  });

  it('does not flag a published URL that merely starts with the draft slug', () => {
    const leaks = findLeaks(
      [{ path: 'build/client/index.html', text: '<a href="/blog/weekly-draft-notes-part-two">x</a>' }],
      leakMarkers([draft], 'production'),
    );
    expect(leaks).toEqual([]);
  });

  it('flags fixtures and status banners in production builds', () => {
    const markers = leakMarkers([fixture], 'production');
    const leaks = findLeaks(
      [
        { path: 'build/client/work/index.html', text: '<h2>[Fixture] Demo project for tests</h2>' },
        { path: 'build/client/about/index.html', text: '<div data-content-status="fixture"></div>' },
      ],
      markers,
    );
    expect(leaks.map((leak) => `${leak.file}: ${leak.label}`)).toEqual([
      'build/client/work/index.html: fixture title "[Fixture] Demo project for tests"',
      'build/client/work/index.html: fixture title prefix "[Fixture]"',
      'build/client/about/index.html: content status banner (data-content-status)',
    ]);
  });

  it('ignores the status-banner attribute name inside JavaScript bundles', () => {
    const leaks = findLeaks(
      [{ path: 'build/client/assets/banner.js', text: 'createElement("div",{"data-content-status":s})' }],
      leakMarkers([], 'production'),
    );
    expect(leaks).toEqual([]);
  });

  it('allows fixtures but still forbids drafts in fixture builds', () => {
    const markers = leakMarkers([draft], 'fixtures');
    const leaks = findLeaks(
      [
        { path: 'build/client/work/index.html', text: '[Fixture] Demo <div data-content-status="fixture">' },
        { path: 'build/client/blog/index.html', text: '<div data-content-status="draft"></div>' },
      ],
      markers,
    );
    expect(leaks.map((leak) => leak.label)).toEqual(['draft status banner (data-content-status="draft")']);
  });
});

describe('stray media', () => {
  it('reports media folders and loose files no included entry owns', () => {
    expect(
      strayMedia(
        ['work/kept-project', 'work/fixture-demo', 'blog/weekly-draft-notes', 'stray.webp'],
        new Set(['work/kept-project']),
      ),
    ).toEqual(['work/fixture-demo', 'blog/weekly-draft-notes', 'stray.webp']);
  });
});
