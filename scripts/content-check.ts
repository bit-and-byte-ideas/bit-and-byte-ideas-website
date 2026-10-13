// Validates every project and article and reports what each build mode would
// include. Exit 1 on any issue. Usage: pnpm content:check
// Run with Node 24 type stripping: node scripts/content-check.ts
import { todayUtc, type ContentMode } from '../src/content/collections/filter.ts';
import {
  diskImageCheck,
  fileExistsIn,
  readContentSources,
} from '../src/content/collections/fs-sources.ts';
import {
  buildCollections,
  formatIssue,
  includedEntries,
  scheduledEntries,
  type ContentEntry,
} from '../src/content/collections/validate.server.ts';

const root = process.cwd();
const today = todayUtc();
const sources = readContentSources(root);
const result = buildCollections(sources, {
  today,
  fileExists: fileExistsIn(root),
  checkImage: diskImageCheck(root),
});

const modes: ContentMode[] = ['production', 'fixtures', 'development'];

function describe(name: string, entries: ContentEntry[]): string {
  const fixtures = entries.filter((entry) => entry.fixture).length;
  const drafts = entries.filter((entry) => entry.data.status === 'draft').length;
  const counts = modes
    .map((mode) => `${mode} ${includedEntries(entries, { mode, today }).length}`)
    .join(', ');
  return `  ${name}: ${entries.length} valid (${entries.length - fixtures} real, ${fixtures} fixtures, ${drafts} drafts); included in ${counts}`;
}

console.log(`content:check (${sources.length} source files, today ${today} UTC)`);
console.log(describe('work', result.work));
console.log(describe('blog', result.blog));
for (const entry of scheduledEntries([...result.work, ...result.blog], today)) {
  console.warn(`  warning: ${entry.file} is dated after today; production builds exclude it until then`);
}

if (result.issues.length > 0) {
  console.error(`\n${result.issues.length} issue(s):`);
  for (const issue of result.issues) console.error(`  - ${formatIssue(issue)}`);
  process.exit(1);
}
console.log('  0 issues');
