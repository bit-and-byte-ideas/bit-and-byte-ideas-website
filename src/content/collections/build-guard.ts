// Detects excluded content (drafts, fixtures in production, scheduled posts)
// that leaked into build output. Used by scripts/verify-build-content.ts.
//
// Markers are deliberately specific to avoid false positives: an entry's URL
// path always; its quoted slug only when multi-word; its title only when it
// has three or more words.
import type { ContentEntry } from './validate.server.ts';
import { FIXTURE_TITLE_PREFIX } from './schema.ts';

export interface LeakMarker {
  label: string;
  pattern: RegExp;
  /** `documents` = HTML, .data, XML, JSON, text. `all` also scans JavaScript. */
  scope: 'all' | 'documents';
}

export interface OutputFile {
  path: string;
  text: string;
}

export interface Leak {
  file: string;
  label: string;
}

const DOCUMENT_EXTENSIONS = ['.html', '.data', '.xml', '.json', '.txt'];

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

function reasonFor(entry: ContentEntry): string {
  if (entry.data.status === 'draft') return 'draft';
  return entry.fixture ? 'fixture' : 'scheduled';
}

export function leakMarkers(
  excluded: readonly ContentEntry[],
  mode: 'production' | 'fixtures',
): LeakMarker[] {
  const markers: LeakMarker[] = [];
  for (const entry of excluded) {
    const reason = reasonFor(entry);
    const slug = escapeRegExp(entry.slug);
    markers.push({
      label: `${reason} URL /${entry.collection}/${entry.slug}`,
      pattern: new RegExp(`/${entry.collection}/${slug}(?![A-Za-z0-9-])`),
      scope: 'all',
    });
    if (entry.slug.includes('-')) {
      markers.push({ label: `${reason} slug "${entry.slug}"`, pattern: new RegExp(`"${slug}"`), scope: 'all' });
    }
    const title = entry.data.title;
    if (title.trim().split(/\s+/).length >= 3) {
      for (const variant of new Set([title, escapeHtml(title), JSON.stringify(title).slice(1, -1)])) {
        markers.push({
          label: `${reason} title "${title}"`,
          pattern: new RegExp(escapeRegExp(variant)),
          scope: 'all',
        });
      }
    }
  }
  if (mode === 'production') {
    markers.push({
      label: `fixture title prefix "${FIXTURE_TITLE_PREFIX}"`,
      pattern: new RegExp(escapeRegExp(FIXTURE_TITLE_PREFIX)),
      scope: 'all',
    });
    markers.push({
      label: 'content status banner (data-content-status)',
      pattern: /data-content-status/,
      scope: 'documents',
    });
  } else {
    markers.push({
      label: 'draft status banner (data-content-status="draft")',
      pattern: /data-content-status="draft"/,
      scope: 'documents',
    });
  }
  return markers;
}

export function isDocument(path: string): boolean {
  return DOCUMENT_EXTENSIONS.some((extension) => path.endsWith(extension));
}

export function findLeaks(files: readonly OutputFile[], markers: readonly LeakMarker[]): Leak[] {
  const leaks: Leak[] = [];
  for (const file of files) {
    for (const marker of markers) {
      if (marker.scope === 'documents' && !isDocument(file.path)) continue;
      if (marker.pattern.test(file.text)) leaks.push({ file: file.path, label: marker.label });
    }
  }
  return leaks;
}

/**
 * Media paths under build/client/media (`<collection>/<slug>` folders, or loose
 * files) that no included entry owns. scripts/prune-build-media.ts removes them;
 * anything left is a leak.
 */
export function strayMedia(present: readonly string[], included: ReadonlySet<string>): string[] {
  return present.filter((path) => !included.has(path));
}
