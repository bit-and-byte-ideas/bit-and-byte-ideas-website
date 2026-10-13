/**
 * The slug of a content detail page. Each entry has its own static route
 * (src/routes.ts, decision D-034), so the slug is the last path segment.
 * Prerendering also calls the loader for `<path>.data`, hence the suffix strip.
 * A slug read wrongly makes the loader 404, which fails the build.
 */
export function slugFromRequest(request: Request): string {
  const path = new URL(request.url).pathname.replace(/\.data$/, '').replace(/\/+$/, '');
  return path.split('/').pop() ?? '';
}
