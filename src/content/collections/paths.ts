/// <reference types="node" />
// Content paths for src/routes.ts and react-router.config.ts, using the same
// validation and filtering as the loaders. With `ssr: false`, a route that has
// a loader must be prerendered for at least one path, so detail routes are
// registered only when this list is non-empty for their collection.
import { contentMode, todayUtc, type ContentMode } from './filter.ts';
import { diskImageCheck, fileExistsIn, readContentSources } from './fs-sources.ts';
import { buildCollections, ContentValidationError, includedEntries } from './validate.server.ts';

export interface ContentPathOptions {
  mode?: ContentMode;
  today?: string;
  root?: string;
  /** Collections whose routes exist (a path without a route would prerender as the 404 page). */
  collections?: readonly ('work' | 'blog')[];
}

export function listContentPaths(options: ContentPathOptions = {}): string[] {
  const root = options.root ?? process.cwd();
  const today = options.today ?? todayUtc();
  // Same rule as the loaders: `react-router dev` sets NODE_ENV=development (drafts and
  // fixtures included); `react-router build` sets production (fixtures with CONTENT_FIXTURES=1).
  const mode = options.mode ?? contentMode(process.env);
  const collections = options.collections ?? ['work', 'blog'];
  const result = buildCollections(readContentSources(root), {
    today,
    fileExists: fileExistsIn(root),
    checkImage: diskImageCheck(root),
  });
  if (result.issues.length > 0) throw new ContentValidationError(result.issues);
  return [
    ...(collections.includes('work') ? includedEntries(result.work, { mode, today }) : []).map(
      (entry) => `/work/${entry.slug}`,
    ),
    ...(collections.includes('blog') ? includedEntries(result.blog, { mode, today }) : []).map(
      (entry) => `/blog/${entry.slug}`,
    ),
  ];
}
