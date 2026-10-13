// Builders for in-memory content sources used by the collection tests. Each
// starts from a valid published entry; tests override one thing at a time.
import { stringify } from 'yaml';
import type { ImageCheck } from './media.ts';
import {
  buildCollections,
  formatIssue,
  type BuildResult,
  type ContentSource,
} from './validate.server.ts';

export const TODAY = '2026-10-12';

export const PROJECT_BODY = `## Problem

Problem text.

## Constraints

Constraints text.

## Approach

Approach text.

## Solution

Solution text.
`;

export const ARTICLE_BODY = `Opening paragraph.

## A section

Section text.
`;

type Data = Record<string, unknown>;

function merge(base: Data, overrides: Data): Data {
  const merged: Data = { ...base, ...overrides };
  for (const [key, value] of Object.entries(merged)) if (value === undefined) delete merged[key];
  return merged;
}

export function projectData(overrides: Data = {}): Data {
  return merge(
    {
      title: 'Example project',
      summary: 'A summary comfortably longer than the fifty-character minimum for cards.',
      kind: 'internal',
      status: 'published',
      category: 'website',
      services: ['build'],
      industry: 'Testing',
      technologies: ['TypeScript'],
      completedOn: '2026-01',
      images: [
        {
          file: 'cover.png',
          alt: 'Homepage of the example project above the fold',
          role: 'cover',
          viewport: 'desktop',
          capturedOn: '2026-01-10',
        },
      ],
      review: { approvedBy: 'Carlos Barajas', approvedOn: '2026-01-20' },
    },
    overrides,
  );
}

export function clientApproval(scope: string[] = ['name', 'description', 'screenshots']): Data {
  return {
    kind: 'client',
    client: { name: 'Example Dental', anonymized: false },
    publicApproval: {
      approvedBy: 'Pat Example, Owner',
      approvedOn: '2026-01-15',
      scope,
      reference: 'Email thread, 2026-01-15',
    },
  };
}

export function articleData(overrides: Data = {}): Data {
  return merge(
    {
      title: 'Example article',
      description: 'A description comfortably longer than the fifty-character minimum.',
      status: 'published',
      author: 'carlos-barajas',
      publishedOn: '2026-02-01',
      tags: ['react'],
      review: { approvedBy: 'Carlos Barajas', approvedOn: '2026-01-30' },
    },
    overrides,
  );
}

export function source(file: string, data: Data, body: string): ContentSource {
  return { file, raw: `---\n${stringify(data)}---\n\n${body}` };
}

export const projectSource = (slug: string, data: Data = projectData(), body = PROJECT_BODY) =>
  source(`src/content/work/${slug}/index.md`, data, body);

export const articleSource = (slug: string, data: Data = articleData(), body = ARTICLE_BODY) =>
  source(`src/content/blog/${slug}/index.md`, data, body);

export function build(
  sources: ContentSource[],
  fileExists: (path: string) => boolean = () => true,
  checkImage: ImageCheck = () => undefined,
): BuildResult {
  return buildCollections(sources, { today: TODAY, fileExists, checkImage });
}

/** Formatted issue lines, for readable assertions. */
export function issueLines(result: BuildResult): string[] {
  return result.issues.map(formatIssue);
}
