/**
 * Which entries a build includes (decision D-008):
 * - production: published, not fixtures, publishedOn not in the future
 * - fixtures (CONTENT_FIXTURES=1 production build, never deployed): adds fixtures, never drafts
 * - development (`pnpm dev`, tests): everything, drafts and fixtures included
 * Approval records are enforced by validation, so a published entry here is
 * already reviewed and approved.
 */
export type ContentMode = 'production' | 'fixtures' | 'development';

export interface Includable {
  status: 'draft' | 'published';
  fixture: boolean;
  /** Articles only; projects publish as soon as they are published. */
  publishedOn?: string;
}

export interface IncludeOptions {
  mode: ContentMode;
  /** YYYY-MM-DD (UTC) the build treats as today. */
  today: string;
}

type Env = Record<string, string | undefined>;

/** Mode for the running process: Vite/React Router builds set NODE_ENV=production. */
export function contentMode(env: Env): ContentMode {
  if (env['NODE_ENV'] !== 'production') return 'development';
  return env['CONTENT_FIXTURES'] === '1' ? 'fixtures' : 'production';
}

/** Mode for post-build scripts, which always check a production-style build. */
export function buildOutputMode(env: Env): Exclude<ContentMode, 'development'> {
  return env['CONTENT_FIXTURES'] === '1' ? 'fixtures' : 'production';
}

export function todayUtc(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function isScheduled(entry: Includable, today: string): boolean {
  return entry.status === 'published' && entry.publishedOn !== undefined && entry.publishedOn > today;
}

export function isIncluded(entry: Includable, { mode, today }: IncludeOptions): boolean {
  if (mode === 'development') return true;
  if (entry.status !== 'published' || isScheduled(entry, today)) return false;
  return mode === 'fixtures' || !entry.fixture;
}
