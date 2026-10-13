// Turns raw Markdown sources into validated entries for both collections.
// Pure: callers supply the sources (Vite glob, node:fs, or test strings) and a
// file-existence check, so the same rules run in loaders, scripts, and tests.
import type { Root as MdastRoot } from 'mdast';
import type { z } from 'zod';
import { BODY_IMAGE_PATTERN, checkBody } from './body-rules.ts';
import { isIncluded, isScheduled, type IncludeOptions, type Includable } from './filter.ts';
import { parseFrontmatter } from './frontmatter.ts';
import { parseMarkdown } from './markdown.server.ts';
import { mediaKey, type ImageCheck } from './media.ts';
import { countWords, readingMinutes } from './reading-time.ts';
import {
  articleSchema,
  FIXTURE_TITLE_PREFIX,
  projectSchema,
  SLUG_MAX_LENGTH,
  SLUG_PATTERN,
  type ArticleFrontmatter,
  type ProjectFrontmatter,
} from './schema.ts';

export type CollectionName = 'work' | 'blog';

export interface ContentSource {
  /** Repo-relative path, e.g. src/content/blog/my-post/index.md (a leading / is ignored). */
  file: string;
  raw: string;
}

export interface ContentIssue {
  file: string;
  line?: number;
  /** Frontmatter field, e.g. `tags[1]` or `review.approvedOn`. */
  path?: string;
  message: string;
}

interface EntryBase {
  slug: string;
  /** Repo-relative path of index.md. */
  file: string;
  /** Repo-relative folder holding index.md and images/. */
  dir: string;
  fixture: boolean;
  body: string;
  readingMinutes: number;
}

export interface ProjectEntry extends EntryBase {
  collection: 'work';
  data: ProjectFrontmatter;
}

export interface ArticleEntry extends EntryBase {
  collection: 'blog';
  data: ArticleFrontmatter;
}

export type ContentEntry = ProjectEntry | ArticleEntry;

export interface Collections {
  work: ProjectEntry[];
  blog: ArticleEntry[];
}

export interface BuildResult extends Collections {
  issues: ContentIssue[];
}

export interface BuildOptions {
  /** YYYY-MM-DD (UTC). */
  today: string;
  fileExists: (repoRelativePath: string) => boolean;
  /** Media-manifest check for each referenced image that exists (see media.ts). */
  checkImage: ImageCheck;
}

const SOURCE_PATH = /^src\/content\/(fixtures\/)?(work|blog)\/([^/]+)\/index\.md$/;
const TODO = /\bTODO\b/;

export function formatIssue(issue: ContentIssue): string {
  const location = issue.line === undefined ? issue.file : `${issue.file}:${issue.line}`;
  return `${location}: ${issue.path ? `${issue.path} ` : ''}${issue.message}`;
}

export class ContentValidationError extends Error {
  readonly issues: ContentIssue[];

  constructor(issues: ContentIssue[]) {
    super(
      `Content validation failed with ${issues.length} issue(s):\n` +
        issues.map((issue) => `  - ${formatIssue(issue)}`).join('\n'),
    );
    this.name = 'ContentValidationError';
    this.issues = issues;
  }
}

function formatPath(path: readonly PropertyKey[]): string {
  return path
    .map((segment, index) =>
      typeof segment === 'number' ? `[${segment}]` : `${index === 0 ? '' : '.'}${String(segment)}`,
    )
    .join('');
}

function zodIssues(file: string, error: z.ZodError): ContentIssue[] {
  return error.issues.flatMap((issue): ContentIssue[] => {
    if (issue.code === 'unrecognized_keys') {
      return issue.keys.map((key) => ({
        file,
        path: formatPath([...issue.path, key]),
        message:
          key === 'slug'
            ? 'is not a frontmatter field: the folder name is the slug'
            : 'is not a known field (see docs/website/CONTENT.md#schemas)',
      }));
    }
    const path = formatPath(issue.path) || undefined;
    if (issue.code === 'invalid_type' && issue.input === undefined) {
      return [{ file, path, message: 'is required' }];
    }
    return [{ file, path, message: issue.message }];
  });
}

function* stringLeaves(value: unknown, path: PropertyKey[] = []): Generator<[string, string]> {
  if (typeof value === 'string') yield [formatPath(path), value];
  else if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) yield* stringLeaves(item, [...path, index]);
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) yield* stringLeaves(item, [...path, key]);
  }
}

function bodyImages(node: MdastRoot | MdastRoot['children'][number]): string[] {
  const own =
    node.type === 'image' ? [BODY_IMAGE_PATTERN.exec(node.url)?.[1]].filter(Boolean) : [];
  const nested = 'children' in node ? node.children.flatMap((child) => bodyImages(child)) : [];
  return [...(own as string[]), ...nested];
}

function frontmatterImages(
  collection: CollectionName,
  data: Record<string, unknown>,
): { name: string; path: string }[] {
  if (collection === 'work') {
    const images = Array.isArray(data['images']) ? data['images'] : [];
    return images.flatMap((image, index) =>
      image && typeof image === 'object' && typeof image.file === 'string'
        ? [{ name: image.file as string, path: `images[${index}].file` }]
        : [],
    );
  }
  const cover = data['cover'] as { file?: unknown } | undefined;
  return typeof cover?.file === 'string' ? [{ name: cover.file, path: 'cover.file' }] : [];
}

function futureDateIssues(
  file: string,
  data: ProjectFrontmatter | ArticleFrontmatter,
  today: string,
): ContentIssue[] {
  const checks: [string, string | undefined, string][] = [
    ['updatedOn', data.updatedOn, today],
    ['review.approvedOn', data.review?.approvedOn, today],
  ];
  if ('completedOn' in data) checks.push(['completedOn', data.completedOn, today.slice(0, 7)]);
  if ('publicApproval' in data) {
    checks.push(['publicApproval.approvedOn', data.publicApproval?.approvedOn, today]);
  }
  return checks
    .filter(([, value, limit]) => value !== undefined && value > limit)
    .map(([path]) => ({ file, path, message: `is in the future (today is ${today} UTC)` }));
}

/** Validates every source; entries are only returned for sources with no issues. */
export function buildCollections(
  sources: readonly ContentSource[],
  options: BuildOptions,
): BuildResult {
  const issues: ContentIssue[] = [];
  const work: ProjectEntry[] = [];
  const blog: ArticleEntry[] = [];
  const slugOwners = new Map<string, string[]>();

  const ordered = sources
    .map((source) => ({ ...source, file: source.file.replace(/^\/+/, '') }))
    .sort((a, b) => a.file.localeCompare(b.file));

  for (const { file, raw } of ordered) {
    const match = SOURCE_PATH.exec(file);
    if (!match) {
      issues.push({
        file,
        message:
          'content lives at src/content/{work,blog}/<slug>/index.md (fixtures under src/content/fixtures/)',
      });
      continue;
    }
    const [, fixtureDir, collectionName, slug] = match;
    const collection = collectionName as CollectionName;
    const dir = file.slice(0, -'/index.md'.length);
    const entryIssues: ContentIssue[] = [];
    const add = (message: string, extra: Partial<ContentIssue> = {}) =>
      entryIssues.push({ file, message, ...extra });

    slugOwners.set(`${collection}/${slug}`, [
      ...(slugOwners.get(`${collection}/${slug}`) ?? []),
      file,
    ]);
    if (!SLUG_PATTERN.test(slug) || slug.length > SLUG_MAX_LENGTH) {
      add(
        `folder name "${slug}" is the slug: use lowercase a-z, 0-9 and single hyphens, at most ${SLUG_MAX_LENGTH} characters`,
      );
    }

    const frontmatter = parseFrontmatter(raw);
    if (!frontmatter.ok) {
      add(frontmatter.message, { line: frontmatter.line });
      issues.push(...entryIssues);
      continue;
    }
    const { data: rawData, body, bodyStartLine } = frontmatter;

    const parsed =
      collection === 'work'
        ? projectSchema.safeParse(rawData, { reportInput: true })
        : articleSchema.safeParse(rawData, { reportInput: true });
    if (!parsed.success) entryIssues.push(...zodIssues(file, parsed.error));

    const inFixtures = fixtureDir !== undefined;
    if (inFixtures && rawData['fixture'] !== true) {
      add('is required in src/content/fixtures/ (fixture: true)', { path: 'fixture' });
    }
    if (!inFixtures && rawData['fixture'] === true) {
      add('is only allowed under src/content/fixtures/', { path: 'fixture' });
    }
    const title = rawData['title'];
    if (inFixtures && typeof title === 'string' && !title.startsWith(FIXTURE_TITLE_PREFIX)) {
      add(`of a fixture must start with "${FIXTURE_TITLE_PREFIX}"`, { path: 'title' });
    }

    const published = rawData['status'] === 'published';
    const tree = parseMarkdown(body);
    for (const problem of checkBody(tree, { collection, published })) {
      add(problem.message, {
        line: problem.line === undefined ? undefined : bodyStartLine + problem.line - 1,
      });
    }
    if (published) {
      for (const [path, value] of stringLeaves(rawData)) {
        if (TODO.test(value)) add('contains TODO; resolve every TODO before publishing', { path });
      }
    }

    const images = [
      ...frontmatterImages(collection, rawData),
      ...bodyImages(tree).map((name) => ({ name, path: undefined })),
    ];
    for (const { name, path } of images) {
      const sourcePath = `${dir}/images/${name}`;
      if (!options.fileExists(sourcePath)) {
        add(`image "${name}" was not found in ${dir}/images/`, { path });
        continue;
      }
      const problem = options.checkImage({ key: mediaKey(collection, slug, name), sourcePath });
      if (problem) add(`image "${name}" ${problem}`, { path });
    }

    if (parsed.success) entryIssues.push(...futureDateIssues(file, parsed.data, options.today));

    if (entryIssues.length > 0 || !parsed.success) {
      issues.push(...entryIssues);
      continue;
    }

    const base = {
      slug,
      file,
      dir,
      fixture: inFixtures,
      body,
      readingMinutes: readingMinutes(countWords(tree)),
    };
    if (collection === 'work') {
      work.push({ ...base, collection, data: parsed.data as ProjectFrontmatter });
    } else {
      blog.push({ ...base, collection, data: parsed.data as ArticleFrontmatter });
    }
  }

  for (const [key, files] of slugOwners) {
    if (files.length < 2) continue;
    for (const file of files) {
      issues.push({
        file,
        message: `slug "${key}" is also used by ${files.filter((other) => other !== file).join(', ')}`,
      });
    }
  }

  const ranks = new Map<number, string[]>();
  for (const project of work) {
    if (project.data.featured === undefined) continue;
    ranks.set(project.data.featured, [...(ranks.get(project.data.featured) ?? []), project.file]);
  }
  for (const [rank, files] of ranks) {
    if (files.length < 2) continue;
    for (const file of files) {
      issues.push({
        file,
        path: 'featured',
        message: `rank ${rank} is also used by ${files.filter((other) => other !== file).join(', ')}`,
      });
    }
  }

  return { work, blog, issues };
}

function includable(entry: ContentEntry): Includable {
  return {
    status: entry.data.status,
    fixture: entry.fixture,
    publishedOn: entry.collection === 'blog' ? entry.data.publishedOn : undefined,
  };
}

export function includedEntries<T extends ContentEntry>(entries: readonly T[], options: IncludeOptions): T[] {
  return entries.filter((entry) => isIncluded(includable(entry), options));
}

/** Published articles held back because publishedOn is after the build date. */
export function scheduledEntries<T extends ContentEntry>(entries: readonly T[], today: string): T[] {
  return entries.filter((entry) => isScheduled(includable(entry), today));
}
