// @vitest-environment node
import { resolveBodyImages } from './body-images.ts';
import { parseMarkdown, renderMarkdown } from './markdown.server.ts';
import type { ResolvedImage } from './media.ts';
import { build, clientApproval, projectData, projectSource } from './test-utils.ts';
import {
  formatYearMonth,
  nextProject,
  orderProjects,
  toWorkDetail,
  toWorkSummary,
} from './work-view.ts';

const resolved: ResolvedImage = {
  width: 2880,
  height: 1800,
  src: '/media/x.webp',
  avifSrcSet: '/media/x.avif 480w',
  webpSrcSet: '/media/x.webp 480w',
};
const imageFor = () => resolved;

function projects(...entries: [string, Record<string, unknown>][]) {
  const result = build(entries.map(([slug, overrides]) => projectSource(slug, projectData(overrides))));
  expect(result.issues).toEqual([]);
  return result.work;
}

describe('orderProjects', () => {
  it('puts featured ranks first, then the most recently completed, then title', () => {
    const ordered = orderProjects(
      projects(
        ['old', { completedOn: '2024-01', title: 'Old' }],
        ['second', { featured: 2, completedOn: '2020-01' }],
        ['new-b', { completedOn: '2026-01', title: 'B' }],
        ['first', { featured: 1, completedOn: '2019-01' }],
        ['new-a', { completedOn: '2026-01', title: 'A' }],
      ),
    );
    expect(ordered.map((entry) => entry.slug)).toEqual(['first', 'second', 'new-a', 'new-b', 'old']);
  });
});

describe('toWorkDetail', () => {
  const [entry] = projects([
    'client',
    {
      ...clientApproval(['name', 'screenshots', 'outcomes', 'live-link']),
      services: ['build', 'maintain'],
      liveUrl: 'https://example.com',
      completedOn: '2026-03',
      outcomes: [{ statement: 'Bookings moved online.', evidence: 'Owner email, 2026-03-20' }],
      images: [
        { file: 'cover.png', alt: 'Homepage of the example project', role: 'cover', viewport: 'desktop', capturedOn: '2026-01-10' },
        { file: 'phone.png', alt: 'Phone view of the booking flow', role: 'gallery', viewport: 'mobile', capturedOn: '2026-01-10', caption: 'Booking on a phone' },
      ],
    },
  ]);
  const detail = toWorkDetail(entry, imageFor);

  it('carries labels from the taxonomy and services.ts', () => {
    expect(detail).toMatchObject({
      kind: 'client',
      kindLabel: 'Client project',
      categoryLabel: 'Website',
      serviceLabels: ['Website & Application Development', 'Maintenance + Hosting'],
      liveUrl: 'https://example.com',
      completedOn: { iso: '2026-03', label: 'March 2026' },
    });
  });

  it('passes outcome statements but never their evidence or approval records', () => {
    expect(detail.outcomes).toEqual(['Bookings moved online.']);
    const serialized = JSON.stringify(detail);
    expect(serialized).not.toContain('Owner email');
    expect(serialized).not.toContain('Email thread');
    expect(serialized).not.toContain('publicApproval');
    expect(serialized).not.toContain('review');
  });

  it('splits the cover from gallery images', () => {
    expect(detail.cover).toMatchObject({ alt: 'Homepage of the example project', viewport: 'desktop' });
    expect(detail.gallery).toEqual([
      { image: resolved, alt: 'Phone view of the booking flow', caption: 'Booking on a phone', viewport: 'mobile' },
    ]);
  });

  it('drops images the manifest cannot resolve', () => {
    expect(toWorkSummary(entry, () => undefined).cover).toBeNull();
  });
});

describe('nextProject', () => {
  const ordered = orderProjects(
    projects(['a', { featured: 1, title: 'A' }], ['b', { featured: 2, title: 'B' }], ['c', { featured: 3, title: 'C' }]),
  );

  it('returns the next project and wraps around', () => {
    expect(nextProject(ordered, 'a')).toEqual({ slug: 'b', title: 'B' });
    expect(nextProject(ordered, 'c')).toEqual({ slug: 'a', title: 'A' });
  });

  it('returns null for a single project or an unknown slug', () => {
    expect(nextProject(ordered.slice(0, 1), 'a')).toBeNull();
    expect(nextProject(ordered, 'zzz')).toBeNull();
  });
});

describe('formatYearMonth', () => {
  it('formats in UTC so the month never shifts', () => {
    expect(formatYearMonth('2026-01')).toBe('January 2026');
    expect(formatYearMonth('2025-12')).toBe('December 2025');
  });
});

describe('body images', () => {
  it('lifts lone images out of paragraphs so figures never nest in <p>', () => {
    const { hast } = renderMarkdown(parseMarkdown('Text.\n\n![A diagram of the flow](./images/diagram.png)\n'));
    const tags = hast.children.flatMap((node) => (node.type === 'element' ? [node.tagName] : []));
    expect(tags).toEqual(['p', 'img']);
  });

  it('keeps inline images inside their paragraph', () => {
    const { hast } = renderMarkdown(parseMarkdown('Before ![An inline icon image](./images/icon.png) after.\n'));
    const tags = hast.children.flatMap((node) => (node.type === 'element' ? [node.tagName] : []));
    expect(tags).toEqual(['p']);
  });

  it('maps each Markdown src to its resolved image', () => {
    const { hast } = renderMarkdown(parseMarkdown('![A diagram of the flow](./images/diagram.png)\n'));
    const seen: string[] = [];
    const images = resolveBodyImages(hast, (file) => {
      seen.push(file);
      return resolved;
    });
    expect(seen).toEqual(['diagram.png']);
    expect(images).toEqual({ './images/diagram.png': resolved });
  });
});
