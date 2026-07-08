// Generates build/client/sitemap.xml with an honest lastmod (SEO H2).
// Runs as the last step of `pnpm build`; the output directory must exist.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_URL = 'https://www.bitandbyteideas.com';
const OUT = resolve(import.meta.dirname, '../build/client/sitemap.xml');

const routes = [
  { path: '/', priority: '1.0' },
  { path: '/about', priority: '0.8' },
];

const lastmod = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    ({ path, priority }) => `  <url>
    <loc>${BASE_URL}${path === '/' ? '/' : path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(OUT, xml);
console.log(`sitemap.xml written (${routes.length} routes, lastmod ${lastmod})`);
