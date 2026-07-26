import type { MetaDescriptor } from 'react-router';
import { Link } from 'react-router';
import { businessInfo, mailtoHref, smsHref, telHref, vcardHref } from '../content/business-info';
import { card } from '../content/card';
import { site } from '../content/site';
import { pageMeta } from '../content/seo';
import './connect.css';

export function meta(): MetaDescriptor[] {
  return pageMeta({
    title: "Connect with Carlos Barajas — Bit & Byte Ideas",
    description:
      'Save my contact, call, text, or book a free 30-minute call directly — Carlos Barajas, founder of Bit & Byte Ideas, a San Diego software studio building custom websites and web apps for small businesses.',
    path: '/connect',
  });
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m22 6-10 7L2 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SaveContactIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 10l5 5 5-5M12 15V3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Connect() {
  return (
    <article className="connect" aria-label="Connect with Carlos Barajas">
      <section className="connect-hero" aria-labelledby="connect-heading">
        <div className="atmosphere" aria-hidden="true" />
        <div className="container connect-hero-inner">
          <div className="connect-card">
            <span className="crop-mark crop-tl" aria-hidden="true" />
            <span className="crop-mark crop-tr" aria-hidden="true" />
            <span className="crop-mark crop-bl" aria-hidden="true" />
            <span className="crop-mark crop-br" aria-hidden="true" />

            <div className="connect-label">
              <span className="label-dot" aria-hidden="true" />
              {card.eyebrow}
            </div>
            <h1 id="connect-heading" className="connect-name">
              Carlos Barajas
            </h1>
            <p className="connect-role">Founder &amp; Engineer — Bit &amp; Byte Ideas</p>
            <p className="connect-pitch">{card.pitch}</p>

            <ul className="connect-meta" role="list">
              <li className="meta-item">
                <span className="meta-dot" aria-hidden="true" />
                {businessInfo.availability}
              </li>
              <li className="meta-item">{site.location.display}</li>
            </ul>

            <a
              href={site.calendlyUrl}
              className="btn btn-primary connect-book"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Free Call
              <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        </div>
      </section>

      <section className="connect-actions" aria-label="Quick contact options">
        <div className="container">
          <div className="action-grid">
            <a className="action-tile" href={telHref}>
              <PhoneIcon />
              <span className="action-label">Call</span>
              <span className="action-value">{businessInfo.phoneDisplay}</span>
            </a>
            <a className="action-tile" href={smsHref}>
              <MessageIcon />
              <span className="action-label">Text</span>
              <span className="action-value">{businessInfo.phoneDisplay}</span>
            </a>
            <a className="action-tile action-tile-wide" href={mailtoHref}>
              <MailIcon />
              <span className="action-label">Email</span>
              <span className="action-value">{businessInfo.email}</span>
            </a>
            <a
              className="action-tile action-tile-wide action-tile-accent"
              href={vcardHref}
              download
            >
              <SaveContactIcon />
              <span className="action-label">Save Contact</span>
              <span className="action-value">Add to your phone</span>
            </a>
          </div>
        </div>
      </section>

      <section className="connect-build" aria-labelledby="build-heading">
        <div className="container">
          <header className="section-header">
            <span className="section-label">What I Do</span>
            <h2 id="build-heading" className="section-title">
              Build. Automate. Maintain.
            </h2>
          </header>
          <div className="build-grid">
            {card.buildSteps.map((step) => (
              <div className="build-item" key={step.number}>
                <span className="build-number" aria-hidden="true">
                  {step.number}
                </span>
                <h3 className="build-label">{step.label}</h3>
                <p className="build-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="connect-more" aria-label="Learn more">
        <div className="container connect-more-inner">
          <p className="connect-credential">{card.credentialLine}</p>
          <Link to="/about" className="connect-more-link">
            Read the full story
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
