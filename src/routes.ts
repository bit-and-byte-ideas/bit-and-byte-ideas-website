import { type RouteConfig, index, route } from '@react-router/dev/routes';
import { listContentPaths } from './content/collections/paths.ts';

// One static route per included project (dev: drafts and fixtures too), all
// served by the same module, instead of a dynamic `work/:slug` route. Under
// `ssr: false`, Azure's 404 rewrite serves the prerendered /404 page for an
// unknown slug; with a `:slug` route the client would match that URL to a
// route whose data the page doesn't carry and fail hydration. With static
// routes an unknown slug matches `*` everywhere (AUDIT K14, decision D-034).
const workRoutes = listContentPaths({ collections: ['work'] }).map((path) =>
  route(path.slice(1), 'routes/work-project.tsx', { id: `work-project${path.slice('/work'.length)}` }),
);

export default [
  index('routes/home.tsx'),
  route('about', 'routes/about.tsx'),
  route('connect', 'routes/connect.tsx'),
  route('work', 'routes/work-index.tsx'),
  ...workRoutes,
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
