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
          Software Consulting — Est. 2024
        </div>
        <h1 className="hero-headline">
          We Build
          <br />
          Digital
          <br />
          <em>Products</em>
          <br />
          That Work.
        </h1>
        <div className="hero-sub-row">
          <p className="hero-description">
            From polished static sites to full-featured web applications, we craft digital solutions
            tailored to your business goals.
          </p>
          <div className="hero-ctas">
            <a href="#services" className="btn btn-primary">
              Explore Services
            </a>
            <a href="#contact" className="btn btn-ghost">
              Get in Touch
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
