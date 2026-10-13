// Post-build guard (decision D-008), last step of `pnpm build`:
// 1. validates every content entry, so invalid content fails the build;
// 2. fails if any excluded entry (draft, fixture in production, scheduled post)
//    or status-banner marker appears anywhere in build/client;
// 3. fails if build/client/media holds images of an entry this build excludes
//    (scripts/prune-build-media.ts runs first and should have removed them).
// With CONTENT_FIXTURES=1, fixtures are allowed but drafts never are.
// Run with Node 24 type stripping: node scripts/verify-build-content.ts
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';
import {
  findLeaks,
  leakMarkers,
  strayMedia,
  type OutputFile,
} from '../src/content/collections/build-guard.ts';
import { buildOutputMode, todayUtc } from '../src/content/collections/filter.ts';
import {
  diskImageCheck,
  fileExistsIn,
  readContentSources,
} from '../src/content/collections/fs-sources.ts';
import {
  buildCollections,
  formatIssue,
  includedEntries,
  type ContentEntry,
} from '../src/content/collections/validate.server.ts';

const SCANNED_EXTENSIONS = new Set(['.html', '.data', '.xml', '.json', '.txt', '.js']);

const root = process.cwd();
const outDir = resolve(root, 'build/client');
if (!existsSync(outDir)) {
  console.error('verify-build-content: build/client not found. Run `pnpm build` first.');
  process.exit(1);
}

const mode = buildOutputMode(process.env);
const today = todayUtc();
const result = buildCollections(readContentSources(root), {
  today,
  fileExists: fileExistsIn(root),
  checkImage: diskImageCheck(root),
});
if (result.issues.length > 0) {
  console.error(`verify-build-content: ${result.issues.length} content issue(s):`);
  for (const issue of result.issues) console.error(`  - ${formatIssue(issue)}`);
  process.exit(1);
}

const all: ContentEntry[] = [...result.work, ...result.blog];
const included = new Set<ContentEntry>([
  ...includedEntries(result.work, { mode, today }),
  ...includedEntries(result.blog, { mode, today }),
]);
const excluded = all.filter((entry) => !included.has(entry));

function outputFiles(dir: string): OutputFile[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return outputFiles(path);
    if (!SCANNED_EXTENSIONS.has(extname(entry.name))) return [];
    return [{ path: relative(root, path).split(sep).join('/'), text: readFileSync(path, 'utf8') }];
  });
}

/** `<collection>/<slug>` folders and loose files under build/client/media. */
function mediaPaths(): string[] {
  const mediaDir = join(outDir, 'media');
  if (!existsSync(mediaDir)) return [];
  return readdirSync(mediaDir, { withFileTypes: true }).flatMap((collection) =>
    collection.isDirectory()
      ? readdirSync(join(mediaDir, collection.name)).map((slug) => `${collection.name}/${slug}`)
      : [collection.name],
  );
}

const files = outputFiles(outDir);
const leaks = findLeaks(files, leakMarkers(excluded, mode)).map(
  (leak) => `${leak.file}: ${leak.label}`,
);
const includedMedia = new Set([...included].map((entry) => `${entry.collection}/${entry.slug}`));
for (const path of strayMedia(mediaPaths(), includedMedia)) {
  leaks.push(`build/client/media/${path}: media for an entry this build does not include`);
}
if (leaks.length > 0) {
  console.error(`verify-build-content: excluded content found in the ${mode} build:`);
  for (const leak of leaks) console.error(`  - ${leak}`);
  process.exit(1);
}

console.log(
  `verify-build-content: ${mode} build OK: ${files.length} files scanned; ` +
    `work ${result.work.filter((entry) => included.has(entry)).length}/${result.work.length} included, ` +
    `blog ${result.blog.filter((entry) => included.has(entry)).length}/${result.blog.length} included`,
);
if (mode === 'fixtures') {
  console.warn('verify-build-content: FIXTURE BUILD (CONTENT_FIXTURES=1): do not deploy');
}
