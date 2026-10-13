import type { Nodes as MdastNodes } from 'mdast';

export const WORDS_PER_MINUTE = 225;

/** A word has at least one letter or digit; stray punctuation is not a word. */
const WORD = /[\p{L}\p{N}]/u;

/** Words a reader reads: prose and inline code, but not fenced code blocks (D-020). */
export function countWords(node: MdastNodes): number {
  if (node.type === 'code') return 0;
  if (node.type === 'text' || node.type === 'inlineCode') {
    return node.value.split(/\s+/).filter((token) => WORD.test(token)).length;
  }
  if ('children' in node) {
    return node.children.reduce((total, child) => total + countWords(child), 0);
  }
  return 0;
}

export function readingMinutes(words: number): number {
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
