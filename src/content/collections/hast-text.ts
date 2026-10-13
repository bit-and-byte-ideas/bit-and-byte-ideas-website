import type { ElementContent, Root, RootContent } from 'hast';

/** Plain text of a hast node. Pure, so client components can use it too. */
export function hastText(node: Root | RootContent | ElementContent): string {
  if (node.type === 'text') return node.value;
  if ('children' in node) return node.children.map((child) => hastText(child)).join('');
  return '';
}
