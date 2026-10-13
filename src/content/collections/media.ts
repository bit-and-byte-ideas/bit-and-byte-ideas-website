// Media manifest model (decision D-010): `pnpm content:images` writes optimized
// variants to public/media/ and records them in src/content/media-manifest.json.
// This module is pure so loaders, scripts, and tests share it; components only
// `import type` from here and receive ResolvedImage data from loaders.

export const MEDIA_MANIFEST_PATH = 'src/content/media-manifest.json';
/** URL prefix of generated files; on disk they live under public/media/. */
export const MEDIA_URL_PREFIX = '/media';

export interface MediaVariant {
  width: number;
  height: number;
  avif: string;
  webp: string;
  avifBytes: number;
  webpBytes: number;
}

export interface MediaOg {
  url: string;
  width: number;
  height: number;
  bytes: number;
}

export interface MediaImage {
  /** Repo-relative path of the original. */
  source: string;
  sourceHash: string;
  width: number;
  height: number;
  /** Ascending by width. */
  variants: MediaVariant[];
  /** 1200x630 share image; covers only. */
  og?: MediaOg;
}

export interface MediaManifest {
  version: 1;
  /** Fingerprint of the encoder settings; a change regenerates everything. */
  settings: string;
  images: Record<string, MediaImage>;
}

export const EMPTY_MEDIA_MANIFEST: MediaManifest = { version: 1, settings: '', images: {} };

export type MediaCollection = 'work' | 'blog';

/** `work/<slug>/<file>`: slugs are unique per collection, fixtures included. */
export function mediaKey(collection: MediaCollection, slug: string, file: string): string {
  return `${collection}/${slug}/${file}`;
}

/** What a component needs to render one responsive image. */
export interface ResolvedImage {
  width: number;
  height: number;
  /** WebP fallback for the <img> element. */
  src: string;
  avifSrcSet: string;
  webpSrcSet: string;
  og?: MediaOg;
}

const FALLBACK_MAX_WIDTH = 1200;

export function resolveImage(manifest: MediaManifest, key: string): ResolvedImage | undefined {
  const image = manifest.images[key];
  if (!image || image.variants.length === 0) return undefined;
  const fallback =
    image.variants.filter((variant) => variant.width <= FALLBACK_MAX_WIDTH).at(-1) ?? image.variants[0];
  return {
    width: image.width,
    height: image.height,
    src: fallback.webp,
    avifSrcSet: image.variants.map((variant) => `${variant.avif} ${variant.width}w`).join(', '),
    webpSrcSet: image.variants.map((variant) => `${variant.webp} ${variant.width}w`).join(', '),
    og: image.og,
  };
}

/** Repo-relative path of a generated file from its URL (e.g. public/media/...). */
export function mediaFilePath(url: string): string {
  return `public${url}`;
}

export interface ImageRef {
  key: string;
  /** Repo-relative path of the original. */
  sourcePath: string;
}

/** Returns a problem message for an image, or undefined when its variants are current. */
export type ImageCheck = (image: ImageRef) => string | undefined;

const FIX_HINT = 'run pnpm content:images';

export function manifestImageCheck(
  manifest: MediaManifest,
  hashOf: (repoRelativePath: string) => string,
  fileExists: (repoRelativePath: string) => boolean,
): ImageCheck {
  return ({ key, sourcePath }) => {
    const image = manifest.images[key];
    if (!image) return `has no generated variants in ${MEDIA_MANIFEST_PATH}; ${FIX_HINT}`;
    if (image.sourceHash !== hashOf(sourcePath)) {
      return `changed since its variants were generated; ${FIX_HINT}`;
    }
    const files = [...image.variants.flatMap((variant) => [variant.avif, variant.webp])];
    if (image.og) files.push(image.og.url);
    const missing = files.find((url) => !fileExists(mediaFilePath(url)));
    if (missing) return `is missing the generated file ${mediaFilePath(missing)}; ${FIX_HINT}`;
    return undefined;
  };
}
