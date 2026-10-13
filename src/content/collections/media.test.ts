// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readMediaManifest } from './fs-sources.ts';
import { imageDimensions } from './image-dimensions.ts';
import {
  manifestImageCheck,
  mediaFilePath,
  mediaKey,
  resolveImage,
  type MediaImage,
  type MediaManifest,
} from './media.ts';
import { articleSource, build, issueLines, projectData, projectSource } from './test-utils.ts';

const image: MediaImage = {
  source: 'src/content/work/example/images/cover.png',
  sourceHash: 'aaaaaaaaaaaaaaaa',
  width: 2880,
  height: 1800,
  variants: [480, 800, 1200, 1600, 2400].map((width) => ({
    width,
    height: (width * 1800) / 2880,
    avif: `/media/work/example/cover-${width}.aaaaaaaa.avif`,
    webp: `/media/work/example/cover-${width}.aaaaaaaa.webp`,
    avifBytes: 1,
    webpBytes: 1,
  })),
  og: { url: '/media/work/example/cover-og.aaaaaaaa.jpg', width: 1200, height: 630, bytes: 1 },
};
const manifest: MediaManifest = {
  version: 1,
  settings: 'x',
  images: { [mediaKey('work', 'example', 'cover.png')]: image },
};

describe('resolveImage', () => {
  it('builds AVIF and WebP srcsets with a WebP fallback no wider than 1200px', () => {
    const resolved = resolveImage(manifest, 'work/example/cover.png');
    expect(resolved).toMatchObject({
      width: 2880,
      height: 1800,
      src: '/media/work/example/cover-1200.aaaaaaaa.webp',
    });
    expect(resolved?.avifSrcSet).toBe(
      image.variants.map((variant) => `${variant.avif} ${variant.width}w`).join(', '),
    );
    expect(resolved?.webpSrcSet.split(', ')).toHaveLength(5);
    expect(resolved?.og?.url).toBe('/media/work/example/cover-og.aaaaaaaa.jpg');
  });

  it('returns undefined for unknown keys', () => {
    expect(resolveImage(manifest, 'work/other/cover.png')).toBeUndefined();
  });
});

describe('manifest image check (AC-3)', () => {
  const allFilesExist: (path: string) => boolean = () => true;
  const check = (hash: string, fileExists: (path: string) => boolean = allFilesExist) =>
    manifestImageCheck(manifest, () => hash, fileExists);

  it('passes when the source hash matches and every file exists', () => {
    expect(check('aaaaaaaaaaaaaaaa')({ key: 'work/example/cover.png', sourcePath: image.source })).toBeUndefined();
  });

  it('fails with a fix hint when the image is missing from the manifest', () => {
    // work/other/cover.png is not in the test manifest (only work/example/cover.png is).
    const lines = issueLines(build([projectSource('other')], allFilesExist, check('aaaaaaaaaaaaaaaa')));
    expect(lines).toEqual([
      'src/content/work/other/index.md: images[0].file image "cover.png" has no generated variants in src/content/media-manifest.json; run pnpm content:images',
    ]);
  });

  it('fails with a fix hint when the source changed after generation', () => {
    const data = projectData();
    const lines = issueLines(build([projectSource('example', data)], allFilesExist, check('bbbbbbbbbbbbbbbb')));
    expect(lines).toEqual([
      'src/content/work/example/index.md: images[0].file image "cover.png" changed since its variants were generated; run pnpm content:images',
    ]);
  });

  it('fails when a generated file is missing on disk', () => {
    const lines = issueLines(
      build(
        [projectSource('example')],
        (path) => !path.endsWith('cover-800.aaaaaaaa.webp'),
        check('aaaaaaaaaaaaaaaa', (path) => !path.endsWith('cover-800.aaaaaaaa.webp')),
      ),
    );
    expect(lines[0]).toContain('is missing the generated file public/media/work/example/cover-800.aaaaaaaa.webp');
  });

  it('checks body images too', () => {
    const body = 'Intro.\n\n![A diagram of the example flow](./images/diagram.png)\n';
    const lines = issueLines(
      build([articleSource('example', undefined, body)], allFilesExist, check('aaaaaaaaaaaaaaaa')),
    );
    expect(lines).toEqual([
      'src/content/blog/example/index.md: image "diagram.png" has no generated variants in src/content/media-manifest.json; run pnpm content:images',
    ]);
  });
});

// Dimensions are read from file headers (image-dimensions.ts), not with sharp,
// so this independently checks what sharp wrote and runs without its binary.
const dimensionsOf = (repoPath: string) => imageDimensions(readFileSync(join(process.cwd(), repoPath)));

describe('committed variants for fixtures (AC-2)', () => {
  const committed = readMediaManifest();
  const entries = Object.entries(committed.images);

  it('has an entry for every fixture image', () => {
    expect(entries.length).toBeGreaterThanOrEqual(6);
  });

  it.each(entries)('%s: files exist and match the manifest dimensions', (_key, entry) => {
    expect(dimensionsOf(entry.source)).toMatchObject({ width: entry.width, height: entry.height });
    let previousWidth = 0;
    for (const variant of entry.variants) {
      expect(variant.width).toBeGreaterThan(previousWidth);
      expect(variant.width).toBeLessThanOrEqual(entry.width);
      previousWidth = variant.width;
      for (const [url, format] of [
        [variant.avif, 'avif'],
        [variant.webp, 'webp'],
      ] as const) {
        expect(existsSync(join(process.cwd(), mediaFilePath(url)))).toBe(true);
        expect(dimensionsOf(mediaFilePath(url))).toEqual({
          format,
          width: variant.width,
          height: variant.height,
        });
      }
    }
    if (entry.og) {
      expect(dimensionsOf(mediaFilePath(entry.og.url))).toEqual({ format: 'jpeg', width: 1200, height: 630 });
    }
  });
});

describe('imageDimensions', () => {
  it('reads PNG sources', () => {
    expect(
      dimensionsOf('src/content/fixtures/work/fixture-client-greenhouse/images/home-mobile.png'),
    ).toEqual({ format: 'png', width: 1170, height: 2532 });
  });

  it('returns undefined for unknown data', () => {
    expect(imageDimensions(new TextEncoder().encode('not an image, just some text bytes'))).toBeUndefined();
  });
});
