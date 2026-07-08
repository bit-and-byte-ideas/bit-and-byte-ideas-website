import { site } from '../content/site';
import './hero.css';

export function Hero() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="dot-grid" aria-hidden="true" />
      <div className="hero-icon-bg" aria-hidden="true">
        <img src="/assets/BandBIdeas-Icon-small.png" alt="" width="600" height="600" />
      </div>
      <div className="container hero-content">
        <div className="hero-label">
          <span className="label-dot" aria-hidden="true" />
          software consulting — est. 2024
        </div>
        <h1 className="hero-headline">
          We Build
          <br />
          Digital
          <br />
          <em>Products</em>
          <br />
          That Work.
          <span className="caret" aria-hidden="true" />
        </h1>
        <div className="hero-sub-row">
          <p className="hero-description">
            From polished static sites to full-featured web applications, we craft digital solutions
            tailored to your business goals.
          </p>
          <div className="hero-ctas">
            <a href={site.calendlyUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Book a Call
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
