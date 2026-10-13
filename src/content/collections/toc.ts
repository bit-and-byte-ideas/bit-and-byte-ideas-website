import type { Heading } from './markdown.server.ts';

export type TocSetting = 'auto' | 'show' | 'hide';

export interface TocItem {
  depth: 2 | 3;
  id: string;
  text: string;
}

/** H2 and H3 headings, in document order. */
export function tocItems(headings: readonly Heading[]): TocItem[] {
  return headings.flatMap((heading) =>
    heading.depth === 2 || heading.depth === 3
      ? [{ depth: heading.depth, id: heading.id, text: heading.text }]
      : [],
  );
}

export const AUTO_TOC_MIN_H2 = 3;

/** `auto` shows a TOC once an article has at least three H2s (D-022). */
export function showToc(headings: readonly Heading[], setting: TocSetting): boolean {
  if (setting === 'hide') return false;
  const items = tocItems(headings);
  if (setting === 'show') return items.length > 0;
  return items.filter((item) => item.depth === 2).length >= AUTO_TOC_MIN_H2;
}
