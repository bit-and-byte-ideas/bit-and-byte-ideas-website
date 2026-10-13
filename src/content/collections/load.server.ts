/// <reference types="node" />
// Content access for route loaders (build time under `ssr: false`, and the dev
// server). Sources come through Vite's glob so edits hot-reload in `pnpm dev`.
// Invalid content throws, which fails the build.
import { contentMode, todayUtc, type ContentMode } from './filter.ts';
import { fileExistsIn, hashFileIn } from './fs-sources.ts';
import { parseMarkdown, renderMarkdown, type RenderedMarkdown } from './markdown.server.ts';
import {
  EMPTY_MEDIA_MANIFEST,
  manifestImageCheck,
  resolveImage,
  type MediaManifest,
  type ResolvedImage,
} from './media.ts';
import {
  buildCollections,
  ContentValidationError,
  includedEntries,
  scheduledEntries,
  type ArticleEntry,
  type ContentEntry,
  type ProjectEntry,
} from './validate.server.ts';

const sources = import.meta.glob<string>(
  [
    '/src/content/work/*/index.md',
    '/src/content/blog/*/index.md',
    '/src/content/fixtures/work/*/index.md',
    '/src/content/fixtures/blog/*/index.md',
  ],
  { query: '?raw', import: 'default', eager: true },
);

// Through the glob (not node:fs) so regenerating images hot-reloads in dev.
const manifestModules = import.meta.glob<MediaManifest>('/src/content/media-manifest.json', {
  import: 'default',
  eager: true,
});
const mediaManifest = Object.values(manifestModules)[0] ?? EMPTY_MEDIA_MANIFEST;

export interface LoadedContent {
  mode: ContentMode;
  today: string;
  /** Entries this build includes, in source order. */
  work: ProjectEntry[];
  blog: ArticleEntry[];
  /** Published but dated after today: excluded from this build. */
  scheduled: ContentEntry[];
}

let cache: LoadedContent | undefined;

export function loadContent(): LoadedContent {
  if (cache) return cache;
  const today = todayUtc();
  const mode = contentMode(process.env);
  const root = process.cwd();
  const fileExists = fileExistsIn(root);
  const result = buildCollections(
    Object.entries(sources).map(([file, raw]) => ({ file, raw })),
    {
      today,
      fileExists,
      checkImage: manifestImageCheck(mediaManifest, hashFileIn(root), fileExists),
    },
  );
  if (result.issues.length > 0) throw new ContentValidationError(result.issues);

  const options = { mode, today };
  const scheduled = [...scheduledEntries(result.work, today), ...scheduledEntries(result.blog, today)];
  if (mode !== 'development') {
    for (const entry of scheduled) {
      console.warn(`content: ${entry.file} is dated after ${today} (UTC); excluded from this build`);
    }
  }
  cache = {
    mode,
    today,
    work: includedEntries(result.work, options),
    blog: includedEntries(result.blog, options),
    scheduled,
  };
  return cache;
}

export function getProject(slug: string): ProjectEntry | undefined {
  return loadContent().work.find((entry) => entry.slug === slug);
}

export function getArticle(slug: string): ArticleEntry | undefined {
  return loadContent().blog.find((entry) => entry.slug === slug);
}

/** Sanitized hast plus heading ids for an entry's body. */
export function renderEntry(entry: ContentEntry): RenderedMarkdown {
  return renderMarkdown(parseMarkdown(entry.body));
}

/** Responsive image data for a file in an entry's images/ folder (from the manifest). */
export function entryImage(entry: ContentEntry, file: string): ResolvedImage | undefined {
  return resolveImage(mediaManifest, `${entry.collection}/${entry.slug}/${file}`);
}
