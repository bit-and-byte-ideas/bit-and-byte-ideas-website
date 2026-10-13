import { render, screen, within } from '@testing-library/react';
import type { Root } from 'hast';
import { MemoryRouter } from 'react-router';
import type { ArticleDetail, ArticleSummary } from '../content/collections/blog-view.ts';
import type { ResolvedImage } from '../content/collections/media.ts';
import { ArticleCard } from './article-card';
import { ArticleMeta } from './article-meta';
import { AuthorBox } from './author-box';
import { CodeBlock } from './code-block';
import { ContentBody } from './content-body';
import { RelatedArticles } from './related-articles';
import { TableOfContents } from './table-of-contents';

const withRouter = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>);

const summary: ArticleSummary = {
  slug: 'demo',
  title: 'Demo article',
  description: 'A description of the demo article for tests.',
  publishedOn: { iso: '2026-01-15', label: 'January 15, 2026' },
  readingMinutes: 4,
  tags: ['React', 'Performance'],
  status: 'published',
  fixture: false,
};

const detail: ArticleDetail = {
  ...summary,
  updatedOn: null,
  author: { name: 'Carlos Barajas', role: 'Founder & Engineer', url: '/about', bio: 'A one-line bio.' },
  seo: {},
};

const image: ResolvedImage = {
  width: 1600,
  height: 900,
  src: '/media/blog/demo/diagram-800.abcd1234.webp',
  avifSrcSet: '/media/blog/demo/diagram-800.abcd1234.avif 800w',
  webpSrcSet: '/media/blog/demo/diagram-800.abcd1234.webp 800w',
};

const el = (tagName: string, properties: Record<string, unknown>, children: Root['children'] = []) =>
  ({ type: 'element', tagName, properties, children }) as Root['children'][number];
const text = (value: string) => ({ type: 'text', value }) as Root['children'][number];

// The shape markdown.server.ts produces (verified against the pipeline in its tests).
const tree: Root = {
  type: 'root',
  children: [
    el('h2', { id: 'first-section' }, [text('First section')]),
    el('h3', { id: 'detail' }, [text('Detail')]),
    el('pre', {}, [
      el('code', { className: ['hljs', 'language-ts'] }, [
        el('span', { className: ['hljs-keyword'] }, [text('const')]),
        text(' x = 1;\n'),
      ]),
    ]),
    el('table', {}, [
      el('thead', {}, [el('tr', {}, [el('th', {}, [text('Element')]), el('th', {}, [text('Purpose')])])]),
      el('tbody', {}, [el('tr', {}, [el('td', {}, [text('Heading')]), el('td', {}, [text('Structure')])])]),
    ]),
    el('img', { src: './images/diagram.png', alt: 'A diagram of the demo', title: 'The caption' }),
  ],
};

describe('ContentBody (articles)', () => {
  it('renders fenced code as a focusable, named CodeBlock with class-based highlighting only', () => {
    const { container } = withRouter(<ContentBody tree={tree} />);
    const code = screen.getByRole('group', { name: 'Code example: TypeScript' });
    expect(code.tagName).toBe('PRE');
    expect(code).toHaveAttribute('tabindex', '0');
    expect(within(code).getByText('const')).toHaveClass('hljs-keyword');
    expect(container.querySelector('[style]')).toBeNull();
  });

  it('wraps tables in a focusable scroll container named after the columns', () => {
    withRouter(<ContentBody tree={tree} />);
    const wrapper = screen.getByRole('group', { name: 'Table: Element, Purpose' });
    expect(wrapper).toHaveAttribute('tabindex', '0');
    expect(within(wrapper).getByRole('table')).toBeInTheDocument();
  });

  it('turns the Markdown image title into a figcaption', () => {
    const { container } = withRouter(
      <ContentBody tree={tree} images={{ './images/diagram.png': image }} />,
    );
    const figure = container.querySelector('figure')!;
    expect(within(figure).getByAltText('A diagram of the demo')).toBeInTheDocument();
    expect(figure.querySelector('figcaption')).toHaveTextContent('The caption');
  });

  it('adds permalinks beside H2/H3 without changing the heading names', () => {
    withRouter(<ContentBody tree={tree} headingAnchors />);
    expect(screen.getByRole('heading', { level: 2, name: 'First section' })).toHaveAttribute('id', 'first-section');
    expect(screen.getByRole('heading', { level: 3, name: 'Detail' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Link to section First section' })).toHaveAttribute(
      'href',
      '#first-section',
    );
  });

  it('leaves headings plain unless asked (case studies)', () => {
    withRouter(<ContentBody tree={tree} />);
    expect(screen.queryByRole('link', { name: /Link to section/ })).toBeNull();
  });

  it('never leaks the hast node onto DOM attributes', () => {
    const { container } = withRouter(<ContentBody tree={tree} headingAnchors />);
    expect(container.querySelector('[node]')).toBeNull();
  });
});

describe('CodeBlock', () => {
  it('falls back to the fence name for unlisted languages', () => {
    render(
      <CodeBlock language="rust">
        <code>fn main() {'{}'}</code>
      </CodeBlock>,
    );
    expect(screen.getByRole('group', { name: 'Code example: rust' })).toBeInTheDocument();
  });
});

describe('ArticleCard', () => {
  it('links the title and shows date, reading time, description, and topics', () => {
    withRouter(<ArticleCard article={summary} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Demo article');
    expect(screen.getByRole('link', { name: 'Demo article' })).toHaveAttribute('href', '/blog/demo');
    expect(screen.getByText('January 15, 2026')).toHaveAttribute('datetime', '2026-01-15');
    expect(screen.getByText('4 min read')).toBeInTheDocument();
    expect(screen.getByText(summary.description)).toBeInTheDocument();
    expect(screen.getByText(/Topics:/).parentElement).toHaveTextContent('Topics: React · Performance');
  });

  it('uses H3 under a section heading and marks drafts without a date', () => {
    withRouter(
      <ArticleCard article={{ ...summary, status: 'draft', publishedOn: null }} headingLevel={3} />,
    );
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(screen.queryByRole('time')).toBeNull();
    expect(screen.getByText('Draft')).toHaveAttribute('data-content-status', 'draft');
  });
});

describe('ArticleMeta', () => {
  it('shows the byline linking /about, the dates, reading time, and topics', () => {
    withRouter(<ArticleMeta article={detail} />);
    expect(screen.getByRole('link', { name: 'Carlos Barajas' })).toHaveAttribute('href', '/about');
    expect(screen.getByText('January 15, 2026')).toHaveAttribute('datetime', '2026-01-15');
    expect(screen.queryByText('Updated')).toBeNull();
    expect(screen.getByText('4 min read')).toBeInTheDocument();
    expect(screen.getByText('Topics').nextElementSibling).toHaveTextContent('React · Performance');
  });

  it('adds "Updated" only when the article has an updated date', () => {
    withRouter(<ArticleMeta article={{ ...detail, updatedOn: { iso: '2026-02-01', label: 'February 1, 2026' } }} />);
    expect(screen.getByText('Updated').nextElementSibling).toHaveTextContent('February 1, 2026');
  });
});

describe('TableOfContents', () => {
  it('is a nav named "On this page" with H3s nested under their H2', () => {
    render(
      <TableOfContents
        items={[
          { depth: 2, id: 'one', text: 'One' },
          { depth: 3, id: 'one-a', text: 'One A' },
          { depth: 2, id: 'two', text: 'Two' },
        ]}
      />,
    );
    const nav = screen.getByRole('navigation', { name: 'On this page' });
    // Two copies (disclosure and rail); CSS shows exactly one per breakpoint.
    const lists = within(nav).getAllByRole('list').filter((list) => list.classList.contains('toc-list'));
    expect(lists).toHaveLength(2);
    const [first] = lists;
    const sub = within(first).getByRole('link', { name: 'One A' }).closest('ol');
    expect(sub).toHaveClass('toc-sublist');
    expect(within(first).getByRole('link', { name: 'Two' })).toHaveAttribute('href', '#two');
    expect(nav.querySelector('details')).not.toHaveAttribute('open');
  });
});

describe('RelatedArticles', () => {
  it('renders nothing when no article qualifies', () => {
    const { container } = withRouter(<RelatedArticles articles={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('lists related articles as H3 cards under one heading', () => {
    withRouter(<RelatedArticles articles={[summary, { ...summary, slug: 'other', title: 'Other' }]} />);
    const section = screen.getByRole('region', { name: 'Related articles' });
    expect(within(section).getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });
});

describe('AuthorBox', () => {
  it('names the author and links their profile', () => {
    withRouter(<AuthorBox author={detail.author} />);
    const section = screen.getByRole('region', { name: 'About the author' });
    expect(within(section).getByText('Founder & Engineer')).toBeInTheDocument();
    expect(within(section).getByText('A one-line bio.')).toBeInTheDocument();
    expect(within(section).getByRole('link', { name: /More about Carlos Barajas/ })).toHaveAttribute(
      'href',
      '/about',
    );
  });
});
