import type { Nodes as MdastNodes, Root as MdastRoot } from 'mdast';
import { ALT_MIN_LENGTH } from './schema.ts';
import { CODE_LANGUAGES } from './markdown.server.ts';

export interface BodyProblem {
  message: string;
  /** 1-based line within the Markdown body. */
  line?: number;
}

export interface BodyRuleContext {
  collection: 'work' | 'blog';
  published: boolean;
}

/** Required H2 sections of a case study, in order (docs/website/CONTENT.md). */
export const CASE_STUDY_SECTIONS = ['Problem', 'Constraints', 'Approach', 'Solution'] as const;

/** `./images/name.png` or `images/name.png`: images live next to the entry. */
export const BODY_IMAGE_PATTERN = /^(?:\.\/)?images\/([A-Za-z0-9][A-Za-z0-9._-]*\.(?:png|jpe?g))$/i;

const SAFE_LINK = /^(?:https?:\/\/|mailto:|#|\/(?!\/))/i;
const TODO = /\bTODO\b/;

function plainText(node: MdastNodes): string {
  if ('value' in node && (node.type === 'text' || node.type === 'inlineCode')) return node.value;
  if ('children' in node) return node.children.map(plainText).join('');
  return '';
}

/** Rules frontmatter validation can't see: structure, safety, accessibility. */
export function checkBody(tree: MdastRoot, context: BodyRuleContext): BodyProblem[] {
  const problems: BodyProblem[] = [];
  const sections: { text: string; line?: number }[] = [];
  let previousDepth = 1; // the page title is the H1
  const languages = CODE_LANGUAGES as readonly string[];

  const visit = (node: MdastNodes) => {
    const line = node.position?.start.line;
    const report = (message: string) => problems.push({ message, line });

    switch (node.type) {
      case 'heading': {
        const text = plainText(node).trim();
        if (node.depth === 1) {
          report(`H1 "# ${text}" is not allowed in the body; the title is the H1 (use ##)`);
        } else if (node.depth > previousDepth + 1) {
          report(`heading "${'#'.repeat(node.depth)} ${text}" skips a level after an H${previousDepth}`);
        }
        previousDepth = node.depth;
        if (node.depth === 2) sections.push({ text, line });
        break;
      }
      case 'html':
        report(`raw HTML is not allowed (including comments): ${node.value.trim().slice(0, 40)}`);
        break;
      case 'footnoteDefinition':
      case 'footnoteReference':
        report('footnotes are not supported; link to the source inline instead');
        break;
      case 'image':
      case 'imageReference': {
        const alt = (node.alt ?? '').trim();
        if (alt.length < ALT_MIN_LENGTH) {
          report(`image needs alt text describing what it shows (at least ${ALT_MIN_LENGTH} characters)`);
        }
        if (node.type === 'image' && !BODY_IMAGE_PATTERN.test(node.url)) {
          report(`image "${node.url}" must be in this entry's images/ folder (./images/name.png)`);
        }
        break;
      }
      case 'code':
        if (!node.lang) {
          report('code block needs a language (```ts, ```go, … or ```text)');
        } else if (!languages.includes(node.lang)) {
          report(`code block language "${node.lang}" is not supported; use one of: ${languages.join(', ')}`);
        }
        break;
      case 'link':
      case 'definition':
        if (!SAFE_LINK.test(node.url)) {
          report(`link "${node.url}" must start with https://, http://, mailto:, / (site-relative), or #`);
        }
        break;
      case 'text':
        if (context.published && TODO.test(node.value)) {
          report('contains TODO; resolve every TODO before publishing');
        }
        break;
    }

    if ('children' in node) for (const child of node.children) visit(child);
  };
  visit(tree);

  if (context.collection === 'work') problems.push(...checkSections(sections, context.published));
  return problems;
}

function checkSections(
  sections: { text: string; line?: number }[],
  published: boolean,
): BodyProblem[] {
  const required: readonly string[] = CASE_STUDY_SECTIONS;
  const expected = required.map((name) => `## ${name}`).join(', ');
  const problems: BodyProblem[] = [];
  let cursor = 0;
  for (const section of sections) {
    const index = required.indexOf(section.text);
    if (index === -1) {
      problems.push({
        message: `unexpected section "## ${section.text}"; case studies use exactly: ${expected}`,
        line: section.line,
      });
    } else if (index < cursor) {
      problems.push({
        message: `section "## ${section.text}" is out of order; the order is: ${expected}`,
        line: section.line,
      });
    } else {
      cursor = index + 1;
    }
  }
  if (published) {
    const present = new Set(sections.map((section) => section.text));
    for (const name of required) {
      if (!present.has(name)) problems.push({ message: `missing section "## ${name}"` });
    }
  }
  return problems;
}
