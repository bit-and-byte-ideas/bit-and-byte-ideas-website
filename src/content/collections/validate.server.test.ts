// @vitest-environment node
import {
  ARTICLE_BODY,
  PROJECT_BODY,
  articleData,
  articleSource,
  build,
  clientApproval,
  issueLines,
  projectData,
  projectSource,
  source,
} from './test-utils.ts';

const WORK_FILE = 'src/content/work/example/index.md';
const BLOG_FILE = 'src/content/blog/example/index.md';

/** Asserts the build reports exactly one issue, matching `expected`. */
function expectOnlyIssue(lines: string[], expected: string) {
  expect(lines).toHaveLength(1);
  expect(lines[0]).toContain(expected);
}

describe('valid entries', () => {
  it('accepts a published project and article with no issues', () => {
    const result = build([projectSource('example'), articleSource('example')]);
    expect(issueLines(result)).toEqual([]);
    expect(result.work.map((entry) => entry.slug)).toEqual(['example']);
    expect(result.blog[0]).toMatchObject({ slug: 'example', fixture: false, readingMinutes: 1 });
  });

  it('allows drafts to be incomplete and contain TODO', () => {
    const draft = projectData({ status: 'draft', images: undefined, review: undefined });
    const result = build([projectSource('example', draft, '## Problem\n\nTODO: write this.\n')]);
    expect(issueLines(result)).toEqual([]);
  });

  it('accepts a fully approved client project with a live link and outcomes', () => {
    const data = projectData({
      ...clientApproval(['name', 'screenshots', 'live-link', 'outcomes']),
      liveUrl: 'https://example.com',
      outcomes: [{ statement: 'Bookings moved online.', evidence: 'Client email 2026-02-01' }],
    });
    expect(issueLines(build([projectSource('example', data)]))).toEqual([]);
  });
});

describe('frontmatter rules', () => {
  it('reports a missing required field', () => {
    const lines = issueLines(build([projectSource('example', projectData({ industry: undefined }))]));
    expectOnlyIssue(lines, `${WORK_FILE}: industry is required`);
  });

  it('rejects a slug field because the folder name is the slug', () => {
    const lines = issueLines(build([projectSource('example', projectData({ slug: 'other' }))]));
    expectOnlyIssue(lines, 'slug is not a frontmatter field: the folder name is the slug');
  });

  it('rejects unknown fields', () => {
    const lines = issueLines(build([articleSource('example', articleData({ subtitle: 'x' }))]));
    expectOnlyIssue(lines, 'subtitle is not a known field');
  });

  it('rejects a tag outside the vocabulary', () => {
    const data = articleData({ tags: ['react', 'reactjs'] });
    const lines = issueLines(build([articleSource('example', data)]));
    expectOnlyIssue(lines, `${BLOG_FILE}: tags[1] "reactjs" is not in src/content/blog-tags.ts`);
  });

  it('rejects an unknown author', () => {
    const lines = issueLines(build([articleSource('example', articleData({ author: 'someone' }))]));
    expectOnlyIssue(lines, 'author "someone" is not in src/content/authors.ts');
  });

  it('rejects impossible dates', () => {
    const lines = issueLines(build([articleSource('example', articleData({ publishedOn: '2026-02-30' }))]));
    expectOnlyIssue(lines, 'publishedOn is not a real calendar date');
  });

  it('rejects a non-https live URL', () => {
    const lines = issueLines(build([projectSource('example', projectData({ liveUrl: 'http://example.com' }))]));
    expectOnlyIssue(lines, 'liveUrl must be an https:// URL');
  });

  it('requires review on published entries', () => {
    const lines = issueLines(build([articleSource('example', articleData({ review: undefined }))]));
    expectOnlyIssue(lines, "review is required when status is published (Carlos's sign-off)");
  });

  it('requires publicApproval to publish client work', () => {
    const data = projectData({ kind: 'client', client: { name: 'Example Dental', anonymized: false } });
    const lines = issueLines(build([projectSource('example', data)]));
    expectOnlyIssue(lines, "publicApproval is required to publish client work (the client's written approval)");
  });

  it('requires evidence for every outcome', () => {
    const data = projectData({ outcomes: [{ statement: 'Faster pages.' }] });
    const lines = issueLines(build([projectSource('example', data)]));
    expectOnlyIssue(lines, 'outcomes[0].evidence is required');
  });

  it('forbids outcomes on concepts', () => {
    const data = projectData({
      kind: 'concept',
      outcomes: [{ statement: 'Faster pages.', evidence: 'Measured.' }],
    });
    const lines = issueLines(build([projectSource('example', data)]));
    expectOnlyIssue(lines, 'outcomes are not allowed for concepts');
  });

  it('requires live-link approval before showing a client live URL', () => {
    const data = projectData({ ...clientApproval(), liveUrl: 'https://example.com' });
    const lines = issueLines(build([projectSource('example', data)]));
    expectOnlyIssue(lines, 'liveUrl needs "live-link" in publicApproval.scope');
  });

  it('requires name approval unless the client is anonymized', () => {
    const data = projectData(clientApproval(['screenshots']));
    const lines = issueLines(build([projectSource('example', data)]));
    expectOnlyIssue(lines, 'client.name needs "name" in publicApproval.scope');
  });

  it('requires exactly one cover image', () => {
    const image = { file: 'a.png', alt: 'A gallery image of the example', role: 'gallery', viewport: 'desktop', capturedOn: '2026-01-10' };
    const lines = issueLines(build([projectSource('example', projectData({ images: [image] }))]));
    expectOnlyIssue(lines, 'images need exactly one image with role: cover (found 0)');
  });

  it('rejects updatedOn before publishedOn', () => {
    const lines = issueLines(build([articleSource('example', articleData({ updatedOn: '2026-01-01' }))]));
    expectOnlyIssue(lines, 'updatedOn is before publishedOn');
  });

  it('rejects completion dates in the future', () => {
    const lines = issueLines(build([projectSource('example', projectData({ completedOn: '2027-01' }))]));
    expectOnlyIssue(lines, 'completedOn is in the future');
  });

  it('rejects TODO anywhere in a published entry', () => {
    const data = projectData({ industry: 'TODO: pick one' });
    const lines = issueLines(build([projectSource('example', data)]));
    expectOnlyIssue(lines, 'industry contains TODO');
  });
});

describe('collection rules', () => {
  it('rejects folder names that are not valid slugs', () => {
    const lines = issueLines(build([projectSource('Bad_Slug')]));
    expectOnlyIssue(lines, 'folder name "Bad_Slug" is the slug');
  });

  it('rejects duplicate slugs, including across fixtures', () => {
    const fixture = source(
      'src/content/fixtures/work/example/index.md',
      projectData({ title: '[Fixture] Example', fixture: true }),
      PROJECT_BODY,
    );
    const lines = issueLines(build([projectSource('example'), fixture]));
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('slug "work/example" is also used by');
  });

  it('rejects duplicate featured ranks', () => {
    const lines = issueLines(
      build([
        projectSource('one', projectData({ featured: 1 })),
        projectSource('two', projectData({ featured: 1 })),
      ]),
    );
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('featured rank 1 is also used by');
  });

  it('only allows fixture: true under src/content/fixtures/', () => {
    const lines = issueLines(build([projectSource('example', projectData({ fixture: true }))]));
    expectOnlyIssue(lines, 'fixture is only allowed under src/content/fixtures/');
  });

  it('requires fixtures to be flagged and titled as fixtures', () => {
    const unflagged = source('src/content/fixtures/work/example/index.md', projectData(), PROJECT_BODY);
    const lines = issueLines(build([unflagged]));
    expect(lines).toEqual([
      'src/content/fixtures/work/example/index.md: fixture is required in src/content/fixtures/ (fixture: true)',
      'src/content/fixtures/work/example/index.md: title of a fixture must start with "[Fixture]"',
    ]);
  });

  it('exempts fixtures from approval records', () => {
    const data = projectData({ title: '[Fixture] Client', fixture: true, kind: 'client', review: undefined, client: { name: 'Fictional', anonymized: true } });
    const fixture = source('src/content/fixtures/work/example/index.md', data, PROJECT_BODY);
    expect(issueLines(build([fixture]))).toEqual([]);
  });

  it('reports images missing from the entry folder', () => {
    const lines = issueLines(build([projectSource('example')], () => false));
    expectOnlyIssue(lines, 'images[0].file image "cover.png" was not found in src/content/work/example/images/');
  });

  it('reports files outside the folder-per-entry layout', () => {
    const lines = issueLines(build([source('src/content/blog/stray.md', articleData(), ARTICLE_BODY)]));
    expectOnlyIssue(lines, 'content lives at src/content/{work,blog}/<slug>/index.md');
  });

  it('reports a missing frontmatter block', () => {
    const lines = issueLines(build([{ file: BLOG_FILE, raw: '# Just markdown\n' }]));
    expectOnlyIssue(lines, `${BLOG_FILE}:1: must start with a --- frontmatter block`);
  });

  it('reports duplicate frontmatter keys', () => {
    const raw = '---\ntitle: One\ntitle: Two\n---\n\nBody\n';
    const lines = issueLines(build([{ file: BLOG_FILE, raw }]));
    expectOnlyIssue(lines, 'invalid YAML');
  });
});

describe('body rules', () => {
  const article = (body: string) => issueLines(build([articleSource('example', articleData(), body)]));

  it('rejects raw HTML, reporting the line in the source file', () => {
    const body = 'Intro.\n\n<div>hi</div>\n';
    const line = articleSource('example', articleData(), body).raw.split('\n').indexOf('<div>hi</div>') + 1;
    expectOnlyIssue(article(body), `${BLOG_FILE}:${line}: raw HTML is not allowed`);
  });

  it('rejects HTML comments', () => {
    expectOnlyIssue(article('<!-- note -->\n\nText.\n'), 'raw HTML is not allowed (including comments)');
  });

  it('rejects an H1 in the body', () => {
    expectOnlyIssue(article('# Title\n\nText.\n'), 'H1 "# Title" is not allowed in the body');
  });

  it('rejects skipped heading levels', () => {
    expectOnlyIssue(article('## Section\n\n#### Too deep\n'), 'heading "#### Too deep" skips a level after an H2');
  });

  it('requires alt text on images', () => {
    expectOnlyIssue(article('![](./images/diagram.png)\n'), 'image needs alt text');
  });

  it('only allows images from the entry folder', () => {
    expectOnlyIssue(
      article('![A diagram from elsewhere](https://example.com/x.png)\n'),
      'image "https://example.com/x.png" must be in this entry\'s images/ folder',
    );
  });

  it('requires a language on code fences', () => {
    expectOnlyIssue(article('```\nplain\n```\n'), 'code block needs a language');
  });

  it('rejects unsupported code languages', () => {
    expectOnlyIssue(article('```rust\nfn main() {}\n```\n'), 'code block language "rust" is not supported');
  });

  it('rejects unsafe link protocols', () => {
    expectOnlyIssue(article('[click](javascript:alert(1))\n'), 'link "javascript:alert(1)" must start with');
  });

  it('rejects protocol-relative links', () => {
    expectOnlyIssue(article('[x](//evil.example)\n'), 'link "//evil.example" must start with');
  });

  it('rejects footnotes (reference and definition)', () => {
    const lines = article('Text.[^1]\n\n[^1]: Note.\n');
    expect(lines).toHaveLength(2);
    for (const line of lines) expect(line).toContain('footnotes are not supported');
  });

  it('rejects TODO in a published body but not in code', () => {
    expect(article('Text with `TODO` in code.\n\n```ts\n// TODO later\n```\n')).toEqual([]);
    expectOnlyIssue(article('TODO: finish.\n'), 'contains TODO');
  });

  it('requires the four case-study sections on published projects', () => {
    const body = '## Problem\n\nA.\n\n## Constraints\n\nB.\n\n## Solution\n\nD.\n';
    const lines = issueLines(build([projectSource('example', projectData(), body)]));
    expectOnlyIssue(lines, 'missing section "## Approach"');
  });

  it('rejects case-study sections out of order', () => {
    const body = '## Problem\n\nA.\n\n## Approach\n\nC.\n\n## Constraints\n\nB.\n\n## Solution\n\nD.\n';
    const lines = issueLines(build([projectSource('example', projectData(), body)]));
    expectOnlyIssue(lines, 'section "## Constraints" is out of order');
  });

  it('rejects extra case-study sections', () => {
    const body = `${PROJECT_BODY}\n## Results\n\nE.\n`;
    const lines = issueLines(build([projectSource('example', projectData(), body)]));
    expectOnlyIssue(lines, 'unexpected section "## Results"');
  });
});
