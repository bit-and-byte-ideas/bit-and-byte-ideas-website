import { site } from '../content/site';
import './hero.css';

export function Hero() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="atmosphere" aria-hidden="true" />
      <div className="hero-icon-bg" aria-hidden="true">
        <img src="/assets/bandb-icon-600.webp" alt="" width="600" height="900" />
      </div>
      <div className="container hero-content">
        <div className="hero-label">
          <span className="label-dot" aria-hidden="true" />
          {site.heroEyebrow}
        </div>
        <h1 className="hero-headline">
          We Build
          <br />
          Custom
          <br />
          <em>Websites</em>
          <br />
          &amp; Web Apps.
          <span className="caret" aria-hidden="true" />
        </h1>
        <div className="hero-sub-row">
          <p className="hero-description">
            From polished static sites to full-featured web apps — custom-built in San Diego for
            small businesses across the United States.
          </p>
          <div className="hero-ctas">
            <a href={site.calendlyUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Book a Call
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <a href="#services" className="btn btn-ghost">
              Explore Services
            </a>
          </div>
        </div>
      </div>
      <div className="hero-scroll-indicator" aria-hidden="true">
        <span className="scroll-line" />
        <span className="scroll-text">scroll</span>
      </div>
    </section>
  );
}
