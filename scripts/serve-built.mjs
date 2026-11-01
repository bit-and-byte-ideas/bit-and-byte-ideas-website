// Serves build/client/ the way Azure Static Web Apps does, so e2e tests run
// against the real production behavior: every response carries the
// globalHeaders from staticwebapp.config.json (including the CSP) and its
// mimeTypes, folder paths resolve to index.html, exact-match route redirects apply, and
// unknown paths get the responseOverrides 404 rewrite with a real 404 status.
// Dependency-free on purpose. Usage: pnpm build && pnpm serve:built
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../build/client');
const HOST = process.env.HOST ?? '127.0.0.1';
const PORT = Number(process.env.PORT ?? 4173);

const configPath = join(ROOT, 'staticwebapp.config.json');
if (!existsSync(configPath)) {
  console.error(`serve-built: ${configPath} not found. Run \`pnpm build\` first.`);
  process.exit(1);
}
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const globalHeaders = config.globalHeaders ?? {};
const notFound = config.responseOverrides?.['404'];
const configMimeTypes = config.mimeTypes ?? {};
const redirects = new Map(
  (config.routes ?? [])
    .filter((route) => route.redirect)
    .map((route) => [route.route, { location: route.redirect, status: route.statusCode ?? 302 }]),
);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.vcf': 'text/vcard',
};

/** Maps a URL path to a file inside ROOT, or null. Never escapes ROOT. */
function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const candidates = decoded.endsWith('/')
    ? [join(decoded, 'index.html')]
    : [decoded, join(decoded, 'index.html')];
  for (const candidate of candidates) {
    const file = normalize(join(ROOT, candidate));
    if (file !== ROOT && !file.startsWith(ROOT + sep)) return null;
    if (existsSync(file) && statSync(file).isFile()) return file;
  }
  return null;
}

function send(res, status, headers, body, method) {
  res.writeHead(status, { ...globalHeaders, ...headers });
  res.end(method === 'HEAD' ? undefined : body);
}

const server = createServer((req, res) => {
  const method = req.method ?? 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    send(res, 405, { Allow: 'GET, HEAD' }, '', method);
    return;
  }

  let pathname;
  try {
    pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
    decodeURIComponent(pathname);
  } catch {
    send(res, 400, {}, 'Bad request', method);
    return;
  }

  const redirect = redirects.get(pathname);
  if (redirect) {
    send(res, redirect.status, { Location: redirect.location }, '', method);
    return;
  }

  const file = resolveFile(pathname);
  if (file) {
    const extension = extname(file);
    const type = configMimeTypes[extension] ?? MIME_TYPES[extension] ?? 'application/octet-stream';
    send(res, 200, { 'Content-Type': type }, readFileSync(file), method);
    return;
  }

  const fallback = notFound?.rewrite ? resolveFile(notFound.rewrite) : null;
  if (fallback) {
    send(
      res,
      notFound.statusCode ?? 404,
      { 'Content-Type': MIME_TYPES['.html'] },
      readFileSync(fallback),
      method,
    );
    return;
  }
  send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Not found', method);
});

server.listen(PORT, HOST, () => {
  console.log(
    `serve-built: http://${HOST}:${PORT} (build/client with staticwebapp.config.json headers)`,
  );
});
