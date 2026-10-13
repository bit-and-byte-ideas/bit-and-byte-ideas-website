import { useId } from 'react';
import { site } from '../content/site';
import './cta-band.css';

/**
 * Closing call to action for content pages, with the site's two CTA labels
 * only: "Book a Call" (Calendly, new tab) and "Get in Touch" (/#contact).
 */
export function CtaBand({ label, heading }: { label: string; heading: string }) {
  const headingId = useId();
  return (
    <section className="cta-band" aria-labelledby={headingId}>
      <div className="container">
        <p className="section-label">{label}</p>
        <h2 id={headingId} className="cta-band-heading">
          {heading}
        </h2>
        <div className="cta-actions">
          <a href={site.calendlyUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
            Book a Call
            <span className="sr-only"> (opens in new tab)</span>
          </a>
          <a href="/#contact" className="btn btn-ghost">
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
