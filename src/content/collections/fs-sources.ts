/// <reference types="node" />
// Reads content sources with node:fs for code that runs outside Vite:
// scripts/*.ts and react-router.config.ts. Every .md file under the content
// folders is returned, so misplaced files are reported instead of ignored.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import {
  EMPTY_MEDIA_MANIFEST,
  manifestImageCheck,
  MEDIA_MANIFEST_PATH,
  type ImageCheck,
  type MediaManifest,
} from './media.ts';
import type { ContentSource } from './validate.server.ts';

export const CONTENT_DIRS = [
  'src/content/work',
  'src/content/blog',
  'src/content/fixtures/work',
  'src/content/fixtures/blog',
] as const;

function markdownFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.name.endsWith('.md') ? [path] : [];
  });
}

export function readContentSources(root: string = process.cwd()): ContentSource[] {
  return CONTENT_DIRS.flatMap((dir) => markdownFiles(join(root, dir))).map((path) => ({
    file: relative(root, path).split(sep).join('/'),
    raw: readFileSync(path, 'utf8'),
  }));
}

export function fileExistsIn(root: string = process.cwd()): (repoRelativePath: string) => boolean {
  return (repoRelativePath) => existsSync(join(root, repoRelativePath));
}

/** Content hash recorded in the media manifest: first 16 hex chars of SHA-256. */
export function hashBytes(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex').slice(0, 16);
}

export function hashFileIn(root: string = process.cwd()): (repoRelativePath: string) => string {
  return (repoRelativePath) => hashBytes(readFileSync(join(root, repoRelativePath)));
}

export function readMediaManifest(root: string = process.cwd()): MediaManifest {
  const path = join(root, MEDIA_MANIFEST_PATH);
  if (!existsSync(path)) return EMPTY_MEDIA_MANIFEST;
  return JSON.parse(readFileSync(path, 'utf8')) as MediaManifest;
}

/** Image check against the manifest and files on disk, for scripts and config. */
export function diskImageCheck(root: string = process.cwd()): ImageCheck {
  return manifestImageCheck(readMediaManifest(root), hashFileIn(root), fileExistsIn(root));
}
