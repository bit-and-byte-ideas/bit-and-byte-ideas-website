import { Link } from 'react-router';

/**
 * The branded 404 body. Rendered by the `*` route (routes/not-found.tsx) and
 * by content routes' error boundaries when a slug doesn't exist.
 */
export function NotFoundContent() {
  return (
    <section className="not-found" aria-labelledby="not-found-heading">
      <div className="container">
        <p className="section-label" aria-hidden="true">
          404
        </p>
        <h1 id="not-found-heading">This page took a wrong turn.</h1>
        <p>The page you're looking for doesn't exist or has moved.</p>
        <div className="cta-actions">
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
          <a href="/#services" className="btn btn-ghost">
            Explore Services
          </a>
        </div>
      </div>
    </section>
  );
}
