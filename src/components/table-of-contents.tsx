import type { TocItem } from '../content/collections/toc.ts';
import { blogPage } from '../content/blog-page';
import './table-of-contents.css';

interface TocSection {
  item: TocItem;
  children: TocItem[];
}

/** H3s nest under the H2 before them (the body rules forbid skipping a level). */
function nest(items: readonly TocItem[]): TocSection[] {
  const sections: TocSection[] = [];
  for (const item of items) {
    const parent = sections.at(-1);
    if (item.depth === 3 && parent) parent.children.push(item);
    else sections.push({ item, children: [] });
  }
  return sections;
}

function TocList({ items }: { items: readonly TocItem[] }) {
  return (
    <ol role="list" className="toc-list">
      {nest(items).map(({ item, children }) => (
        <li key={item.id}>
          <a href={`#${item.id}`}>{item.text}</a>
          {children.length > 0 && (
            <ol role="list" className="toc-sublist">
              {children.map((child) => (
                <li key={child.id}>
                  <a href={`#${child.id}`}>{child.text}</a>
                </li>
              ))}
            </ol>
          )}
        </li>
      ))}
    </ol>
  );
}

/**
 * Plain anchor links to the article's H2/H3 headings (D-022): no scroll-spy,
 * works without JavaScript. Below 1100px it is a disclosure above the body,
 * collapsed by default; at 1100px and up it is an open, sticky left rail. CSS
 * shows exactly one of the two, so assistive tech only ever meets one list.
 */
export function TableOfContents({ items }: { items: readonly TocItem[] }) {
  return (
    <nav className="toc" aria-label={blogPage.tocLabel}>
      <details className="toc-disclosure">
        <summary className="toc-summary">
          <span className="toc-summary-text">{blogPage.tocLabel}</span>
          <span className="toc-marker" aria-hidden="true" />
        </summary>
        <TocList items={items} />
      </details>
      <div className="toc-rail">
        <p className="toc-title" aria-hidden="true">
          {blogPage.tocLabel}
        </p>
        <TocList items={items} />
      </div>
    </nav>
  );
}
