// Post-build step (before verify-build-content): public/ is copied verbatim
// into build/client/, so build/client/media/ starts with the variants of every
// entry, drafts and fixtures included. Remove each media/<collection>/<slug>/
// folder (and anything else under media/) that this build does not include.
// Run with Node 24 type stripping: node scripts/prune-build-media.ts
import { existsSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
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
} from '../src/content/collections/validate.server.ts';

const root = process.cwd();
const mediaDir = resolve(root, 'build/client/media');
if (!existsSync(mediaDir)) {
  console.log('prune-build-media: no build/client/media; nothing to prune');
  process.exit(0);
}

const mode = buildOutputMode(process.env);
const today = todayUtc();
const result = buildCollections(readContentSources(root), {
  today,
  fileExists: fileExistsIn(root),
  checkImage: diskImageCheck(root),
});
if (result.issues.length > 0) {
  console.error(`prune-build-media: ${result.issues.length} content issue(s):`);
  for (const issue of result.issues) console.error(`  - ${formatIssue(issue)}`);
  process.exit(1);
}

const keep = new Set(
  [...includedEntries(result.work, { mode, today }), ...includedEntries(result.blog, { mode, today })].map(
    (entry) => `${entry.collection}/${entry.slug}`,
  ),
);

let removed = 0;
for (const collection of readdirSync(mediaDir, { withFileTypes: true })) {
  const collectionDir = join(mediaDir, collection.name);
  if (!collection.isDirectory()) {
    rmSync(collectionDir);
    removed += 1;
    continue;
  }
  for (const slug of readdirSync(collectionDir)) {
    if (keep.has(`${collection.name}/${slug}`)) continue;
    rmSync(join(collectionDir, slug), { recursive: true });
    removed += 1;
  }
  if (readdirSync(collectionDir).length === 0) rmSync(collectionDir, { recursive: true });
}
if (readdirSync(mediaDir).length === 0) rmSync(mediaDir, { recursive: true });

console.log(
  `prune-build-media: ${mode} build keeps media for ${keep.size} entr${keep.size === 1 ? 'y' : 'ies'}; removed ${removed} folder(s)`,
);
