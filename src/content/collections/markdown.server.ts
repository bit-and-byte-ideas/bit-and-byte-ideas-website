// Build-time Markdown pipeline (decision D-007). Runs only in route loaders,
// scripts, and tests, never in the client bundle.
//
// Order matters: remark-rehype drops raw HTML, rehype-sanitize (GitHub schema)
// strips anything unsafe that remains, and only then do our own trusted
// transforms add heading ids and class-based syntax highlighting, so the
// sanitizer never has to allow them. No `style` attributes are produced, so
// the strict CSP (`style-src 'self'`) holds.
import GithubSlugger from 'github-slugger';
import type { Element, ElementContent, Root as HastRoot, RootContent } from 'hast';
import type { Root as MdastRoot } from 'mdast';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { hastText } from './hast-text.ts';

/** Fence languages authors may use (docs/website/CONTENT.md). */
export const CODE_LANGUAGES = [
  'ts',
  'tsx',
  'js',
  'go',
  'bash',
  'json',
  'yaml',
  'http',
  'sql',
  'css',
  'hcl',
  'dockerfile',
  'text',
] as const;

/** Allowed, but the highlighter has no grammar for them: rendered as plain text. */
const PLAIN_TEXT_LANGUAGES = ['text', 'hcl', 'http', 'dockerfile'];

export interface Heading {
  depth: 2 | 3 | 4;
  id: string;
  text: string;
}

export interface RenderedMarkdown {
  hast: HastRoot;
  headings: Heading[];
}

const parser = unified().use(remarkParse).use(remarkGfm);

const transformer = unified()
  .use(remarkRehype, { allowDangerousHtml: false })
  .use(rehypeSanitize)
  .use(rehypeHighlight, { detect: false, plainText: PLAIN_TEXT_LANGUAGES });

export function parseMarkdown(body: string): MdastRoot {
  return parser.parse(body);
}

export function renderMarkdown(tree: MdastRoot): RenderedMarkdown {
  const hast = transformer.runSync(structuredClone(tree)) as HastRoot;
  const headings = addHeadingIds(hast);
  unwrapLoneImages(hast);
  stripPositions(hast);
  return { hast, headings };
}

/**
 * Markdown wraps a standalone image in a paragraph; the renderer turns images
 * into <figure>, which may not sit inside <p>. Lift such images out.
 */
function unwrapLoneImages(parent: HastRoot | Element): void {
  parent.children = parent.children.map((child) => {
    if (child.type !== 'element') return child;
    if (child.tagName === 'p') {
      const meaningful = child.children.filter(
        (node) => !(node.type === 'text' && node.value.trim() === ''),
      );
      const [only] = meaningful;
      if (meaningful.length === 1 && only.type === 'element' && only.tagName === 'img') return only;
    }
    unwrapLoneImages(child);
    return child;
  }) as typeof parent.children;
}

function isElement(node: RootContent | ElementContent): node is Element {
  return node.type === 'element';
}

const HEADING_DEPTHS: Record<string, Heading['depth']> = { h2: 2, h3: 3, h4: 4 };

/** Stable, GitHub-style ids (duplicates get -1, -2, …) on H2–H4. */
function addHeadingIds(tree: HastRoot): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  const visit = (nodes: (RootContent | ElementContent)[]) => {
    for (const node of nodes) {
      if (!isElement(node)) continue;
      const depth = HEADING_DEPTHS[node.tagName];
      if (depth) {
        const text = hastText(node).trim();
        const id = slugger.slug(text);
        node.properties = { ...node.properties, id };
        headings.push({ depth, id, text });
      } else {
        visit(node.children);
      }
    }
  };
  visit(tree.children);
  return headings;
}

/** Source positions are only useful while validating; drop them from page data. */
function stripPositions(node: HastRoot | RootContent | ElementContent): void {
  delete node.position;
  if ('children' in node) for (const child of node.children) stripPositions(child);
}
