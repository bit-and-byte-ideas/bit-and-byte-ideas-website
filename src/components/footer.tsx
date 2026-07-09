import { Link } from 'react-router';
import { site } from '../content/site';
import './footer.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="container footer-main">
        <div className="footer-brand">
          <a href="#" className="footer-logo" aria-label="Bit and Byte Ideas — back to top">
            <img
              src="/assets/bandb-mark.webp"
              alt=""
              className="footer-logo-icon"
              aria-hidden="true"
              width="28"
              height="40"
            />
            <span className="footer-logo-wordmark">
              Bit <span className="footer-logo-amp">&amp;</span> Byte{' '}
              <span className="footer-logo-ideas">Ideas</span>
            </span>
          </a>
          <p className="footer-tagline">{site.tagline}</p>
          <p className="footer-location">
            {site.location.display} — serving the {site.location.areaServed}
          </p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <ul role="list">
            <li>
              <a href="/#services">Services</a>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <a href="/#process">Process</a>
            </li>
            <li>
              <a href="/#contact">Contact</a>
            </li>
            <li>
              <a href={site.calendlyUrl} target="_blank" rel="noopener noreferrer">
                Book a Call ↗
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copy">&copy; {year} Bit &amp; Byte Ideas. All rights reserved.</p>
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub — bit-and-byte-ideas (opens in new tab)"
            className="social-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
