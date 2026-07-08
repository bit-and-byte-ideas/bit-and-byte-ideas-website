import type { MetaDescriptor } from 'react-router';
import { about } from '../content/about';
import { site } from '../content/site';
import { pageMeta } from '../content/seo';

export function meta(): MetaDescriptor[] {
  return pageMeta({
    title: 'About — Bit & Byte Ideas',
    description:
      'Bit & Byte Ideas is run by Carlos Barajas, an engineer with 18+ years of experience across fintech, energy, and financial services — bringing enterprise discipline to small business software.',
    path: '/about',
  });
}

export default function About() {
  return (
    <article className="about" aria-label="About Carlos Barajas">
      <section className="about-hero" aria-labelledby="about-heading">
        <div className="dot-grid" aria-hidden="true" />
        <div className="container">
          <div className="hero-label">
            <span className="label-dot" aria-hidden="true" />
            {about.label}
          </div>
          <h1 id="about-heading" className="hero-headline">
            Built by
            <br />
            someone
            <br />
            who's been
            <br />
            <em>there.</em>
          </h1>
        </div>
      </section>

      <section className="about-bio" aria-labelledby="bio-heading">
        <div className="container bio-grid">
          <div className="bio-identity">
            <p className="identity-role">{about.role}</p>
            <h2 id="bio-heading" className="identity-name">
              Carlos
              <br />
              Barajas
            </h2>
            <a
              href={site.githubUrl}
              className="github-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub: bit-and-byte-ideas (opens in new tab)"
            >
              github.com/bit-and-byte-ideas
            </a>
          </div>
          <div className="bio-text">
            {about.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="about-expertise" aria-labelledby="expertise-heading">
        <div className="container">
          <header className="section-header">
            <span className="section-label">Technical Range</span>
            <h2 id="expertise-heading" className="section-title">
              What I Work With
            </h2>
          </header>
          <div className="tech-grid">
            {about.techGroups.map((group) => (
              <div className="tech-group" key={group.title}>
                <h3 className="tech-group-title">{group.title}</h3>
                <ul className="tech-list" aria-label={`${group.title} technologies`}>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-clients" aria-labelledby="clients-heading">
        <div className="container">
          <header className="section-header">
            <span className="section-label">Who I Work With</span>
            <h2 id="clients-heading" className="section-title">
              Best Fit For
            </h2>
          </header>
          <div className="clients-grid">
            {about.clients.map((client) => (
              <article className="client-card" key={client.number}>
                <span className="client-number" aria-hidden="true">
                  {client.number}
                </span>
                <h3 className="client-title">{client.title}</h3>
                <p className="client-desc">{client.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta" aria-label="Get in touch">
        <div className="container">
          <p className="cta-label">Ready to build something?</p>
          <h2 className="cta-heading">Let's Talk.</h2>
          <div className="cta-actions">
            <a href="/#contact" className="btn btn-primary">
              Get in Touch
            </a>
            <a
              href={site.calendlyUrl}
              className="btn btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Call
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
