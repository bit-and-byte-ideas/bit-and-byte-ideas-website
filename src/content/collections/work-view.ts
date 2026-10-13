// Turns validated project entries into the plain data /work pages render.
// Pure: images come through `imageFor` (load.server.ts `entryImage` in routes),
// so this runs in tests without Vite. Only what a page shows leaves the
// loader; outcome `evidence` and approval records never do.
import type { ResolvedImage } from './media.ts';
import type { ProjectEntry } from './validate.server.ts';
import {
  workCategories,
  workKindLabels,
  workServiceLabel,
  type WorkKind,
} from '../work-taxonomy.ts';

export type ImageFor = (file: string) => ResolvedImage | undefined;

export interface WorkImage {
  image: ResolvedImage;
  alt: string;
  caption?: string;
  viewport: 'desktop' | 'mobile';
}

export interface WorkSummary {
  slug: string;
  title: string;
  summary: string;
  kind: WorkKind;
  kindLabel: string;
  industry: string;
  categoryLabel: string;
  serviceLabels: string[];
  cover: WorkImage | null;
  status: 'draft' | 'published';
  fixture: boolean;
}

export interface WorkDetail extends WorkSummary {
  technologies: string[];
  completedOn: { iso: string; label: string } | null;
  liveUrl: string | null;
  outcomes: string[];
  gallery: WorkImage[];
  seo: { title?: string; description?: string };
}

export interface WorkLink {
  slug: string;
  title: string;
}

/** Featured rank first (1 = first), then most recently completed, then title. */
export function orderProjects(entries: readonly ProjectEntry[]): ProjectEntry[] {
  return [...entries].sort((a, b) => {
    const rankA = a.data.featured ?? Number.POSITIVE_INFINITY;
    const rankB = b.data.featured ?? Number.POSITIVE_INFINITY;
    if (rankA !== rankB) return rankA - rankB;
    const completed = (b.data.completedOn ?? '').localeCompare(a.data.completedOn ?? '');
    return completed || a.data.title.localeCompare(b.data.title);
  });
}

const MONTH = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** "2026-03" → "March 2026" (UTC, so the label never shifts by time zone). */
export function formatYearMonth(value: string): string {
  const [year, month] = value.split('-').map(Number);
  return MONTH.format(new Date(Date.UTC(year, month - 1, 1)));
}

function toWorkImage(
  image: ProjectEntry['data']['images'][number],
  imageFor: ImageFor,
): WorkImage | null {
  const resolved = imageFor(image.file);
  if (!resolved) return null;
  return { image: resolved, alt: image.alt, caption: image.caption, viewport: image.viewport };
}

export function toWorkSummary(entry: ProjectEntry, imageFor: ImageFor): WorkSummary {
  const { data } = entry;
  const cover = data.images.find((image) => image.role === 'cover');
  return {
    slug: entry.slug,
    title: data.title,
    summary: data.summary,
    kind: data.kind,
    kindLabel: workKindLabels[data.kind],
    industry: data.industry,
    categoryLabel: workCategories[data.category],
    serviceLabels: data.services.map(workServiceLabel),
    cover: cover ? toWorkImage(cover, imageFor) : null,
    status: data.status,
    fixture: entry.fixture,
  };
}

export function toWorkDetail(entry: ProjectEntry, imageFor: ImageFor): WorkDetail {
  const { data } = entry;
  return {
    ...toWorkSummary(entry, imageFor),
    technologies: data.technologies,
    completedOn: data.completedOn
      ? { iso: data.completedOn, label: formatYearMonth(data.completedOn) }
      : null,
    liveUrl: data.liveUrl ?? null,
    outcomes: (data.outcomes ?? []).map((outcome) => outcome.statement),
    gallery: data.images
      .filter((image) => image.role === 'gallery')
      .flatMap((image) => toWorkImage(image, imageFor) ?? []),
    seo: { title: data.seo?.title, description: data.seo?.description },
  };
}

/** The project after `slug` in display order, wrapping around; null when it is the only one. */
export function nextProject(ordered: readonly ProjectEntry[], slug: string): WorkLink | null {
  if (ordered.length < 2) return null;
  const index = ordered.findIndex((entry) => entry.slug === slug);
  if (index === -1) return null;
  const next = ordered[(index + 1) % ordered.length];
  return { slug: next.slug, title: next.data.title };
}
