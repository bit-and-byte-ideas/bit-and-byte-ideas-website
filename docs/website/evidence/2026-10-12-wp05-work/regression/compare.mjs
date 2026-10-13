// Pixel-compares WP-01 baseline screenshots with the same captures on the current build.
// Usage: node compare.mjs <repoRoot> <baselineDir> <currentDir>
import { createRequire } from 'node:module';
import { join } from 'node:path';
const [root, baseDir, currentDir] = process.argv.slice(2);
const sharp = createRequire(join(root, 'package.json'))('sharp');
const names = ['home', 'about', 'connect', '404'].flatMap((page) => ['mobile', 'tablet', 'desktop'].map((v) => `${page}-${v}.png`));
for (const name of names) {
  const [a, b] = await Promise.all([join(baseDir, name), join(currentDir, name)].map((file) => sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })));
  if (a.info.width !== b.info.width || a.info.height !== b.info.height) {
    console.log(`${name}: SIZE DIFFERS ${a.info.width}x${a.info.height} vs ${b.info.width}x${b.info.height}`);
    continue;
  }
  let differing = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    if (a.data[i] !== b.data[i] || a.data[i + 1] !== b.data[i + 1] || a.data[i + 2] !== b.data[i + 2]) differing += 1;
  }
  console.log(`${name}: ${a.info.width}x${a.info.height}, ${differing} differing pixels (${((differing / (a.data.length / 4)) * 100).toFixed(3)}%)`);
}
