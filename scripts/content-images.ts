// Generates responsive image variants for content (decision D-010).
// Usage: pnpm content:images [--check] [--prune] [--report]
//
// For every original in src/content/{work,blog}/<slug>/images/ (fixtures too):
// AVIF + WebP at 480/800/1200/1600/2400 px (never wider than the source) and,
// for cover images, a 1200x630 top-cropped JPEG share image, written to
// public/media/<collection>/<slug>/ with the source hash in each file name.
// Metadata goes to src/content/media-manifest.json. Unchanged sources are
// skipped, so a second run writes nothing. Outputs are committed; CI and
// `pnpm build` never run sharp.
//
//   --check   verify only (no sharp, no writes); exit 1 if anything is stale
//   --prune   delete outputs and manifest entries whose original is gone
//   --report  print a size table from the manifest
// Run with Node 24 type stripping: node scripts/content-images.ts
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, relative, sep } from 'node:path';
import { parseFrontmatter } from '../src/content/collections/frontmatter.ts';
import { CONTENT_DIRS, hashBytes, readMediaManifest } from '../src/content/collections/fs-sources.ts';
import {
  MEDIA_MANIFEST_PATH,
  MEDIA_URL_PREFIX,
  mediaFilePath,
  mediaKey,
  type MediaCollection,
  type MediaImage,
  type MediaManifest,
} from '../src/content/collections/media.ts';

const WIDTHS = [480, 800, 1200, 1600, 2400];
const AVIF = { quality: 60, effort: 4, chromaSubsampling: '4:4:4' } as const;
const WEBP = { quality: 82, effort: 4 } as const;
const OG = { width: 1200, height: 630, quality: 82 } as const;
const SETTINGS = hashBytes(new TextEncoder().encode(JSON.stringify({ WIDTHS, AVIF, WEBP, OG })));
const MAX_SOURCE_BYTES = 3 * 1024 * 1024;
const MIN_COVER_WIDTH = 1600;

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');
const prune = args.has('--prune');

interface SourceImage {
  key: string;
  collection: MediaCollection;
  slug: string;
  file: string;
  sourcePath: string;
  cover: boolean;
  bytes: Buffer;
  hash: string;
}

const repoPath = (absolute: string) => relative(root, absolute).split(sep).join('/');

/** Cover image file names for an entry, read from its frontmatter. */
function coverFiles(entryDir: string, collection: MediaCollection): Set<string> {
  const indexPath = join(entryDir, 'index.md');
  if (!existsSync(indexPath)) return new Set();
  const parsed = parseFrontmatter(readFileSync(indexPath, 'utf8'));
  if (!parsed.ok) return new Set();
  if (collection === 'work') {
    const images = Array.isArray(parsed.data['images']) ? parsed.data['images'] : [];
    return new Set(
      images
        .filter((image) => image?.role === 'cover' && typeof image.file === 'string')
        .map((image) => image.file as string),
    );
  }
  const cover = parsed.data['cover'] as { file?: unknown } | undefined;
  return new Set(typeof cover?.file === 'string' ? [cover.file] : []);
}

function discoverSources(): SourceImage[] {
  const sources: SourceImage[] = [];
  for (const contentDir of CONTENT_DIRS) {
    const absoluteDir = join(root, contentDir);
    if (!existsSync(absoluteDir)) continue;
    const collection: MediaCollection = contentDir.endsWith('work') ? 'work' : 'blog';
    for (const entry of readdirSync(absoluteDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const imagesDir = join(absoluteDir, entry.name, 'images');
      if (!existsSync(imagesDir)) continue;
      const covers = coverFiles(join(absoluteDir, entry.name), collection);
      for (const file of readdirSync(imagesDir).sort()) {
        if (!/\.(png|jpe?g)$/i.test(file)) continue;
        const absolute = join(imagesDir, file);
        const bytes = readFileSync(absolute);
        sources.push({
          key: mediaKey(collection, entry.name, file),
          collection,
          slug: entry.name,
          file,
          sourcePath: repoPath(absolute),
          cover: covers.has(file),
          bytes,
          hash: hashBytes(bytes),
        });
      }
    }
  }
  return sources.sort((a, b) => a.key.localeCompare(b.key));
}

function outputUrls(image: MediaImage): string[] {
  const urls = image.variants.flatMap((variant) => [variant.avif, variant.webp]);
  return image.og ? [...urls, image.og.url] : urls;
}

function isCurrent(source: SourceImage, existing: MediaImage | undefined, manifest: MediaManifest): boolean {
  return (
    manifest.settings === SETTINGS &&
    existing !== undefined &&
    existing.sourceHash === source.hash &&
    Boolean(existing.og) === source.cover &&
    outputUrls(existing).every((url) => existsSync(join(root, mediaFilePath(url))))
  );
}

/** Widths no larger than the source; the source width itself tops up the set (capped). */
function variantWidths(sourceWidth: number): number[] {
  const widths = WIDTHS.filter((width) => width < sourceWidth);
  const top = Math.min(sourceWidth, WIDTHS[WIDTHS.length - 1]);
  return widths.includes(top) ? widths : [...widths, top];
}

async function generate(source: SourceImage): Promise<MediaImage> {
  const { default: sharp } = await import('sharp');
  const metadata = await sharp(source.bytes).metadata();
  const width = metadata.autoOrient?.width ?? metadata.width;
  const height = metadata.autoOrient?.height ?? metadata.height;
  if (!width || !height) throw new Error(`${source.sourcePath}: could not read image dimensions`);

  const outDir = join(root, 'public', 'media', source.collection, source.slug);
  mkdirSync(outDir, { recursive: true });
  const base = basename(source.file, extname(source.file));
  const tag = source.hash.slice(0, 8);
  const url = (name: string) => `${MEDIA_URL_PREFIX}/${source.collection}/${source.slug}/${name}`;

  const variants = [];
  for (const target of variantWidths(width)) {
    const resized = sharp(source.bytes).rotate().resize({ width: target, withoutEnlargement: true });
    const avifName = `${base}-${target}.${tag}.avif`;
    const webpName = `${base}-${target}.${tag}.webp`;
    const avif = await resized.clone().avif(AVIF).toFile(join(outDir, avifName));
    const webp = await resized.clone().webp(WEBP).toFile(join(outDir, webpName));
    variants.push({
      width: webp.width,
      height: webp.height,
      avif: url(avifName),
      webp: url(webpName),
      avifBytes: avif.size,
      webpBytes: webp.size,
    });
  }

  let og: MediaImage['og'];
  if (source.cover) {
    const ogName = `${base}-og.${tag}.jpg`;
    const info = await sharp(source.bytes)
      .rotate()
      .resize({ width: OG.width, height: OG.height, fit: 'cover', position: 'top' })
      .jpeg({ quality: OG.quality, mozjpeg: true })
      .toFile(join(outDir, ogName));
    og = { url: url(ogName), width: info.width, height: info.height, bytes: info.size };
  }
  return { source: source.sourcePath, sourceHash: source.hash, width, height, variants, og };
}

function removeOutputs(image: MediaImage) {
  for (const url of outputUrls(image)) rmSync(join(root, mediaFilePath(url)), { force: true });
}

function mediaFilesOnDisk(dir = join(root, 'public', 'media')): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? mediaFilesOnDisk(path) : [repoPath(path)];
  });
}

function removeEmptyDirs(dir = join(root, 'public', 'media')) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) removeEmptyDirs(join(dir, entry.name));
  }
  if (readdirSync(dir).length === 0) rmSync(dir, { recursive: true });
}

function serialize(manifest: MediaManifest): string {
  const images = Object.fromEntries(
    Object.keys(manifest.images)
      .sort()
      .map((key) => [key, manifest.images[key]]),
  );
  return `${JSON.stringify({ version: 1, settings: manifest.settings, images }, null, 2)}\n`;
}

function report(manifest: MediaManifest) {
  const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;
  console.log('| Image | Source | Width | AVIF | WebP |');
  console.log('| --- | --- | --- | --- | --- |');
  let avifTotal = 0;
  let webpTotal = 0;
  let ogTotal = 0;
  for (const [key, image] of Object.entries(manifest.images)) {
    for (const variant of image.variants) {
      avifTotal += variant.avifBytes;
      webpTotal += variant.webpBytes;
      console.log(
        `| ${key} | ${image.width}x${image.height} | ${variant.width} | ${kb(variant.avifBytes)} | ${kb(variant.webpBytes)} |`,
      );
    }
    if (image.og) {
      ogTotal += image.og.bytes;
      console.log(`| ${key} | ${image.width}x${image.height} | og ${image.og.width}x${image.og.height} | | ${kb(image.og.bytes)} (JPEG) |`);
    }
  }
  console.log(`\nTotals: AVIF ${kb(avifTotal)}, WebP ${kb(webpTotal)}, OG JPEG ${kb(ogTotal)}`);
}

const manifest = readMediaManifest(root);
if (args.has('--report')) {
  report(manifest);
  process.exit(0);
}

const sources = discoverSources();
const sourceKeys = new Set(sources.map((source) => source.key));
const problems: string[] = [];
const next: MediaManifest = { version: 1, settings: SETTINGS, images: {} };
let generated = 0;

for (const source of sources) {
  if (source.bytes.length > MAX_SOURCE_BYTES) {
    console.warn(`  warning: ${source.sourcePath} is over 3 MB; consider a smaller original`);
  }
  const existing = manifest.images[source.key];
  if (isCurrent(source, existing, manifest)) {
    next.images[source.key] = existing;
    continue;
  }
  if (checkOnly) {
    problems.push(`${source.sourcePath}: variants are missing or stale; run pnpm content:images`);
    // Keep its current outputs accounted for, so they aren't also reported as strays.
    if (existing) next.images[source.key] = existing;
    continue;
  }
  if (existing) removeOutputs(existing);
  const image = await generate(source);
  if (source.cover && image.width < MIN_COVER_WIDTH) {
    console.warn(`  warning: ${source.sourcePath} is a cover under ${MIN_COVER_WIDTH}px wide`);
  }
  next.images[source.key] = image;
  generated += 1;
  console.log(`  generated ${source.key} (${image.variants.length} widths${image.og ? ' + og' : ''})`);
}

const orphanKeys = Object.keys(manifest.images).filter((key) => !sourceKeys.has(key));
for (const key of orphanKeys) {
  if (prune && !checkOnly) {
    removeOutputs(manifest.images[key]);
    console.log(`  pruned ${key}`);
  } else {
    if (!prune) next.images[key] = manifest.images[key];
    problems.push(`${key}: original is gone; run pnpm content:images --prune`);
  }
}

const referenced = new Set(
  Object.values(next.images).flatMap((image) => outputUrls(image).map(mediaFilePath)),
);
const strayFiles = mediaFilesOnDisk().filter((file) => !referenced.has(file));
for (const file of strayFiles) {
  if (prune && !checkOnly) {
    rmSync(join(root, file));
    console.log(`  pruned ${file}`);
  } else {
    problems.push(`${file}: not in the manifest; run pnpm content:images --prune`);
  }
}

if (checkOnly) {
  if (problems.length > 0) {
    console.error(`content:images --check: ${problems.length} problem(s):`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }
  console.log(`content:images --check: ${sources.length} image(s) up to date`);
  process.exit(0);
}

if (prune) removeEmptyDirs();
const manifestPath = join(root, MEDIA_MANIFEST_PATH);
const serialized = serialize(next);
const previous = existsSync(manifestPath) ? readFileSync(manifestPath, 'utf8') : '';
if (serialized !== previous) {
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, serialized);
}
for (const problem of problems) console.warn(`  warning: ${problem}`);
console.log(
  `content:images: ${generated} generated, ${sources.length - generated} unchanged` +
    `${serialized === previous ? ', manifest unchanged' : `, wrote ${MEDIA_MANIFEST_PATH}`}`,
);
