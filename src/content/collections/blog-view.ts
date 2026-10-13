// Turns validated article entries into the plain data /blog pages render.
// Pure, like work-view.ts: no Vite, no fs. Approval records never leave it.
import { authors } from '../authors.ts';
import { blogTags } from '../blog-tags.ts';
import { relatedArticles } from './related.ts';
import type { ArticleEntry } from './validate.server.ts';

export interface DateView {
  iso: string;
  label: string;
}

export interface ArticleSummary {
  slug: string;
  title: string;
  description: string;
  publishedOn: DateView | null;
  readingMinutes: number;
  tags: string[];
  status: 'draft' | 'published';
  fixture: boolean;
}

export interface ArticleDetail extends ArticleSummary {
  updatedOn: DateView | null;
  author: { name: string; role: string; url: string; bio: string };
  seo: { title?: string; description?: string };
}

const DAY = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "2026-01-15" → "January 15, 2026" (UTC, so the day never shifts by time zone). */
export function formatDate(value: string): string {
  return DAY.format(new Date(`${value}T00:00:00Z`));
}

const dateView = (value: string | undefined): DateView | null =>
  value ? { iso: value, label: formatDate(value) } : null;

/** Newest first; drafts (no publishedOn) last; slug breaks ties. */
export function orderArticles(entries: readonly ArticleEntry[]): ArticleEntry[] {
  return [...entries].sort((a, b) => {
    const dateA = a.data.publishedOn ?? '';
    const dateB = b.data.publishedOn ?? '';
    return dateB.localeCompare(dateA) || a.slug.localeCompare(b.slug);
  });
}

export function toArticleSummary(entry: ArticleEntry): ArticleSummary {
  const { data } = entry;
  return {
    slug: entry.slug,
    title: data.title,
    description: data.description,
    publishedOn: dateView(data.publishedOn),
    readingMinutes: entry.readingMinutes,
    tags: data.tags.map((tag) => blogTags[tag]),
    status: data.status,
    fixture: entry.fixture,
  };
}

export function toArticleDetail(entry: ArticleEntry): ArticleDetail {
  const { data } = entry;
  const author = authors[data.author];
  return {
    ...toArticleSummary(entry),
    updatedOn: dateView(data.updatedOn),
    author: { name: author.name, role: author.role, url: author.url, bio: author.bio },
    seo: { title: data.seo?.title, description: data.seo?.description },
  };
}

/** Related published articles (D-021); drafts have no date and never qualify. */
export function relatedSummaries(
  current: ArticleEntry,
  entries: readonly ArticleEntry[],
): ArticleSummary[] {
  const candidates = entries.flatMap((entry) =>
    entry.data.publishedOn
      ? [{ slug: entry.slug, tags: entry.data.tags, publishedOn: entry.data.publishedOn, entry }]
      : [],
  );
  const self = {
    slug: current.slug,
    tags: current.data.tags,
    publishedOn: current.data.publishedOn ?? '',
  };
  return relatedArticles(self, candidates).map(({ entry }) => toArticleSummary(entry));
}

