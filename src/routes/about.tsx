import type { MetaDescriptor } from 'react-router';
import { about, techIntro } from '../content/about';
import { site } from '../content/site';
import { pageMeta } from '../content/seo';
import './about.css';

/** Splits a bundled tech item like "AWS (EKS, EC2, RDS, Lambda, S3)" into a
 * headline label and a de-emphasized detail so a skimming reader sees one
 * concept per line while the specifics stay available. */
function splitTechItem(item: string): { label: string; detail: string | null } {
  const match = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(item);
  return match ? { label: match[1], detail: match[2] } : { label: item, detail: null };
}

export function meta(): MetaDescriptor[] {
  return pageMeta({
    title: 'About — Bit & Byte Ideas',
    description:
      'Bit & Byte Ideas is run by Carlos Barajas, a San Diego-based engineer with 18+ years of experience across fintech, energy, and financial services — bringing enterprise discipline to small business software.',
    path: '/about',
  });
}

export default function About() {
  return (
    <article className="about" aria-label="About Carlos Barajas">
      <div className="mobile-sticky-cta">
        <a
          href={site.calendlyUrl}
          className="btn btn-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a Call
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      </div>

      <section className="about-hero" aria-labelledby="about-heading">
        <div className="atmosphere" aria-hidden="true" />
        <div className="container">
          <div className="hero-label">
            <span className="label-dot" aria-hidden="true" />
            {about.label}
          </div>
          <h1 id="about-heading" className="hero-headline">
            Built by someone who's shipped <em>fintech and energy</em> platforms.
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
            <div className="identity-stat">
              <span className="identity-stat-value">{about.yearsExperience}</span>
              <span className="identity-stat-label">Years Building Software</span>
            </div>
          </div>
          <div className="bio-text">
            {about.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
            <a
              href={site.githubUrl}
              className="github-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Browse our open-source work on GitHub (opens in new tab)"
            >
              Browse our open-source work
              <span aria-hidden="true">↗</span>
            </a>
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
            <p className="tech-intro">{techIntro}</p>
          </header>
          <div className="tech-grid">
            {about.techGroups.map((group) => (
              <div className="tech-group" key={group.title}>
                <h3 className="tech-group-title">{group.title}</h3>
                <p className="tech-group-summary">{group.summary}</p>
                <ul className="tech-list" aria-label={`${group.title} technologies`}>
                  {group.items.map((item) => {
                    const { label, detail } = splitTechItem(item);
                    return (
                      <li key={item}>
                        {label}
                        {detail && <span className="tech-detail"> ({detail})</span>}
                      </li>
                    );
                  })}
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
          <p className="section-label">Ready to build something?</p>
          <h2 className="cta-heading">Let's Talk.</h2>
          <div className="cta-actions">
            <a
              href={site.calendlyUrl}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Call
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <a href="/#contact" className="btn btn-ghost">
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
