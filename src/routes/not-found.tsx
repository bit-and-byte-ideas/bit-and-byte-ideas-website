import type { MetaDescriptor } from 'react-router';
import { Link } from 'react-router';
import { pageMeta } from '../content/seo';

export function meta(): MetaDescriptor[] {
  return pageMeta({
    title: 'Page Not Found — Bit & Byte Ideas',
    description: "The page you're looking for doesn't exist.",
    path: '/404',
    noIndex: true,
  });
}

export default function NotFound() {
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
