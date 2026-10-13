// @vitest-environment node
import type { Element, Root, RootContent } from 'hast';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { parseMarkdown, renderMarkdown } from './markdown.server.ts';

function render(markdown: string) {
  return renderMarkdown(parseMarkdown(markdown));
}

function elements(node: Root | RootContent): Element[] {
  const own = node.type === 'element' ? [node] : [];
  const children = 'children' in node ? node.children.flatMap((child) => elements(child)) : [];
  return [...own, ...children];
}

function toHtml(tree: Root): string {
  return renderToStaticMarkup(toJsxRuntime(tree, { Fragment, jsx, jsxs }));
}

// Validation would reject all of this; the renderer must be safe on its own.
const ADVERSARIAL = `
<script>alert(1)</script>

<iframe src="https://evil.example"></iframe>

<img src="x" onerror="alert(1)">

<p style="color: red">styled</p>

[js link](javascript:alert(1))

[data link](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)

[vb link](vbscript:msgbox(1))

![js image](javascript:alert(1))

<a href="javascript:alert(1)" onclick="alert(1)">inline html link</a>
`;

describe('sanitization (validator bypassed)', () => {
  const { hast } = render(ADVERSARIAL);
  const nodes = elements(hast);
  const html = toHtml(hast);

  it('drops script, iframe, and raw HTML elements', () => {
    const tags = new Set(nodes.map((node) => node.tagName));
    for (const tag of ['script', 'iframe', 'div', 'style']) expect(tags.has(tag)).toBe(false);
    expect(html).not.toMatch(/<script|<iframe/i);
  });

  it('drops event handlers and style attributes', () => {
    const keys = nodes.flatMap((node) => Object.keys(node.properties));
    expect(keys.filter((key) => /^on/i.test(key) || key === 'style')).toEqual([]);
    expect(html).not.toMatch(/\son[a-z]+=|style=/i);
  });

  it('drops javascript:, data:, and vbscript: URLs', () => {
    const urls = nodes.flatMap((node) => [node.properties['href'], node.properties['src']]).filter(Boolean);
    expect(urls.filter((url) => /^(javascript|data|vbscript):/i.test(String(url)))).toEqual([]);
    expect(html).not.toMatch(/javascript:|vbscript:|data:text/i);
  });

  it('keeps the visible link text', () => {
    expect(html).toContain('js link');
    expect(html).toContain('data link');
  });
});

describe('headings', () => {
  it('assigns stable, unique GitHub-style ids to H2-H4 and reports them', () => {
    const { hast, headings } = render('## Setup\n\n## Setup\n\n### Details & notes\n\n#### Deep\n');
    expect(headings).toEqual([
      { depth: 2, id: 'setup', text: 'Setup' },
      { depth: 2, id: 'setup-1', text: 'Setup' },
      { depth: 3, id: 'details--notes', text: 'Details & notes' },
      { depth: 4, id: 'deep', text: 'Deep' },
    ]);
    expect(toHtml(hast)).toContain('<h2 id="setup-1">Setup</h2>');
  });

  it('is deterministic across renders', () => {
    expect(render('## One\n\n## Two\n').headings).toEqual(render('## One\n\n## Two\n').headings);
  });
});

describe('code highlighting', () => {
  it('highlights registered languages with classes only', () => {
    const { hast } = render('```ts\nconst answer: number = 42;\n```\n');
    const code = elements(hast).find((node) => node.tagName === 'code');
    expect(code?.properties['className']).toEqual(['hljs', 'language-ts']);
    const classes = elements(hast).flatMap((node) => (node.properties['className'] as string[]) ?? []);
    expect(classes).toContain('hljs-keyword');
    expect(toHtml(hast)).not.toContain('style=');
  });

  it('renders plain-text languages without highlighting', () => {
    const { hast } = render('```hcl\nresource "x" "y" {}\n```\n');
    const code = elements(hast).find((node) => node.tagName === 'code');
    expect(code?.properties['className']).toEqual(['language-hcl']);
  });
});

describe('output shape', () => {
  it('strips source positions from page data', () => {
    expect(JSON.stringify(render('## Title\n\nText with **bold**.\n').hast)).not.toContain('position');
  });

  it('renders GFM tables, strikethrough, and task lists', () => {
    const html = toHtml(render('| a | b |\n| - | - |\n| 1 | 2 |\n\n~~old~~\n\n- [x] done\n').hast);
    expect(html).toContain('<table>');
    expect(html).toContain('<del>old</del>');
    expect(html).toMatch(/<input[^>]*type="checkbox"/);
  });

  it('keeps entry-relative image paths for the image pipeline', () => {
    const { hast } = render('![A diagram of the flow](./images/diagram.png)\n');
    const image = elements(hast).find((node) => node.tagName === 'img');
    expect(image?.properties).toMatchObject({ src: './images/diagram.png', alt: 'A diagram of the flow' });
  });
});
