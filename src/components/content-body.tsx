import type { ComponentProps } from 'react';
import type { Element, Root } from 'hast';
import { toJsxRuntime, type Components, type ExtraProps } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { Link } from 'react-router';
import { hastText } from '../content/collections/hast-text.ts';
import type { ResolvedImage } from '../content/collections/media.ts';
import { contentLabels } from '../content/content-labels';
import { CodeBlock } from './code-block';
import { ResponsiveImage } from './responsive-image';
import './content-body.css';

const EXTERNAL = /^https?:\/\//i;

/** `passNode` hands every mapped component the hast `node`; it must not reach the DOM. */
function withoutNode<P extends ExtraProps>(props: P): Omit<P, 'node'> {
  const rest = { ...props };
  delete rest.node;
  return rest;
}

/** Off-site links open in a new tab with a cue; site links use client navigation. */
function ContentLink(props: ComponentProps<'a'> & ExtraProps) {
  const { href = '', children, ...rest } = withoutNode(props);
  if (EXTERNAL.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        <span aria-hidden="true"> ↗</span>
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    );
  }
  if (href.startsWith('/')) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

/** `language-ts` on the fenced block's <code> → "ts". */
function fenceLanguage(pre: Element | undefined): string {
  const code = pre?.children.find((child): child is Element => child.type === 'element');
  const classes = code?.properties.className;
  const match = Array.isArray(classes)
    ? classes.map(String).find((name) => name.startsWith('language-'))
    : undefined;
  return match ? match.slice('language-'.length) : 'text';
}

function ContentPre({ children, node }: ComponentProps<'pre'> & ExtraProps) {
  return <CodeBlock language={fenceLanguage(node)}>{children}</CodeBlock>;
}

/** Header cells of a GFM table, for the scroll container's accessible name. */
function tableColumns(table: Element | undefined): string[] {
  const head = table?.children.find(
    (child): child is Element => child.type === 'element' && child.tagName === 'thead',
  );
  if (!head) return [];
  const cells: string[] = [];
  const visit = (element: Element) => {
    for (const child of element.children) {
      if (child.type !== 'element') continue;
      if (child.tagName === 'th') cells.push(hastText(child).trim());
      else visit(child);
    }
  };
  visit(head);
  return cells.filter(Boolean);
}

/** Wide tables scroll inside a focusable container instead of widening the page. */
function ContentTable({ children, node, ...rest }: ComponentProps<'table'> & ExtraProps) {
  return (
    <div
      className="content-table"
      role="group"
      tabIndex={0}
      aria-label={contentLabels.table(tableColumns(node))}
    >
      <table {...rest}>{children}</table>
    </div>
  );
}

/**
 * Section heading with a permalink beside it (not inside it, so the heading's
 * accessible name stays the heading text).
 */
function anchoredHeading(Tag: 'h2' | 'h3') {
  return function AnchoredHeading({ children, node, id, ...rest }: ComponentProps<'h2'> & ExtraProps) {
    if (!id) return <Tag {...rest}>{children}</Tag>;
    const text = node ? hastText(node).trim() : '';
    return (
      <div className={`prose-heading prose-heading--${Tag}`}>
        <Tag id={id} {...rest}>
          {children}
        </Tag>
        <a className="prose-heading-anchor" href={`#${id}`}>
          <span aria-hidden="true">#</span>
          <span className="sr-only">{contentLabels.headingLink(text)}</span>
        </a>
      </div>
    );
  };
}

const AnchoredH2 = anchoredHeading('h2');
const AnchoredH3 = anchoredHeading('h3');

export interface ContentBodyProps {
  /** Sanitized hast from the build-time Markdown pipeline (markdown.server.ts). */
  tree: Root;
  /** Responsive data for body images, keyed by their Markdown src (body-images.ts). */
  images?: Record<string, ResolvedImage>;
  /** Permalinks beside H2/H3 (articles). Case studies have fixed section names and skip them. */
  headingAnchors?: boolean;
  className?: string;
}

/**
 * Renders Markdown content as React elements: no HTML strings and no
 * dangerouslySetInnerHTML. Images become ResponsiveImage figures (the Markdown
 * image title is the caption), fenced code becomes CodeBlock, and tables sit in
 * a focusable scroll container.
 */
export function ContentBody({ tree, images = {}, headingAnchors = false, className }: ContentBodyProps) {
  const components: Partial<Components> = {
    a: ContentLink,
    pre: ContentPre,
    table: ContentTable,
    img: ({ src, alt, title }) => {
      const image = typeof src === 'string' ? images[src] : undefined;
      if (!image) return null;
      return (
        <figure className="content-figure">
          <ResponsiveImage image={image} alt={alt ?? ''} sizes="(min-width: 800px) 68ch, 100vw" />
          {title && <figcaption className="content-figure-caption">{title}</figcaption>}
        </figure>
      );
    },
    ...(headingAnchors ? { h2: AnchoredH2, h3: AnchoredH3 } : {}),
  };
  return (
    <div className={className ? `content-body ${className}` : 'content-body'}>
      {toJsxRuntime(tree, { Fragment, jsx, jsxs, components, passNode: true })}
    </div>
  );
}
