import { services } from '../content/services';

export function Services() {
  return (
    <section id="services" className="services" aria-labelledby="services-heading">
      <div className="container">
        <header className="section-header">
          <span className="section-label">What We Do</span>
          <h2 id="services-heading" className="section-title">
            Services Built
            <br />
            for Real Business
          </h2>
        </header>
        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <div className="card-header">
                <span className="card-number" aria-hidden="true">
                  {service.number}
                </span>
                {service.badge && <span className="card-badge">{service.badge}</span>}
              </div>
              <h3 className="card-title">{service.title}</h3>
              <p className="card-description">{service.description}</p>
              <ul className="card-features" aria-label="Included features">
                {service.features.map((feature) => (
                  <li key={feature}>
                    <span className="feature-arrow" aria-hidden="true">
                      →
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="card-cta">
                Get a Quote
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
