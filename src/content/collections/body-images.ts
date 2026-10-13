import type { ElementContent, Root as HastRoot, RootContent } from 'hast';
import { BODY_IMAGE_PATTERN } from './body-rules.ts';
import type { ResolvedImage } from './media.ts';

/**
 * Responsive data for every image in rendered content, keyed by the `src` the
 * Markdown used (`./images/name.png`). Loaders return this map alongside the
 * hast, and the content renderer swaps each <img> for a ResponsiveImage.
 */
export function resolveBodyImages(
  tree: HastRoot,
  imageFor: (file: string) => ResolvedImage | undefined,
): Record<string, ResolvedImage> {
  const images: Record<string, ResolvedImage> = {};
  const visit = (nodes: (RootContent | ElementContent)[]) => {
    for (const node of nodes) {
      if (node.type !== 'element') continue;
      const src = node.properties['src'];
      if (node.tagName === 'img' && typeof src === 'string') {
        const file = BODY_IMAGE_PATTERN.exec(src)?.[1];
        const resolved = file ? imageFor(file) : undefined;
        if (resolved) images[src] = resolved;
      }
      visit(node.children);
    }
  };
  visit(tree.children);
  return images;
}
