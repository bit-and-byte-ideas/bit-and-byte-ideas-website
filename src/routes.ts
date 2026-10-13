import { type RouteConfig, index, route } from '@react-router/dev/routes';
import { listContentPaths } from './content/collections/paths.ts';

// One static route per included project or article (dev: drafts and fixtures
// too), each collection served by one module, instead of dynamic `work/:slug`
// and `blog/:slug` routes. Under
// `ssr: false`, Azure's 404 rewrite serves the prerendered /404 page for an
// unknown slug; with a `:slug` route the client would match that URL to a
// route whose data the page doesn't carry and fail hydration. With static
// routes an unknown slug matches `*` everywhere (AUDIT K14, decision D-034).
const workRoutes = listContentPaths({ collections: ['work'] }).map((path) =>
  route(path.slice(1), 'routes/work-project.tsx', { id: `work-project${path.slice('/work'.length)}` }),
);

const blogRoutes = listContentPaths({ collections: ['blog'] }).map((path) =>
  route(path.slice(1), 'routes/blog-article.tsx', { id: `blog-article${path.slice('/blog'.length)}` }),
);

export default [
  index('routes/home.tsx'),
  route('about', 'routes/about.tsx'),
  route('connect', 'routes/connect.tsx'),
  route('work', 'routes/work-index.tsx'),
  ...workRoutes,
  route('blog', 'routes/blog-index.tsx'),
  ...blogRoutes,
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
