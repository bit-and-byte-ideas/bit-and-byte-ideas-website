import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { site } from '../content/site';
import './nav.css';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape closes the mobile nav dialog and returns focus to its trigger,
  // matching standard dialog keyboard behavior.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const closeMenuAndReturnFocus = () => {
    setMenuOpen(false);
    hamburgerRef.current?.focus();
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav className={scrolled ? 'site-nav scrolled' : 'site-nav'}>
        <div className="container nav-inner">
          <Link to="/" className="logo" aria-label="Bit and Byte Ideas home" onClick={closeMenu}>
            <img
              src="/assets/bandb-mark.webp"
              alt=""
              className="logo-icon"
              aria-hidden="true"
              width="24"
              height="35"
            />
            <span className="logo-wordmark">
              Bit <span className="logo-amp">&amp;</span> Byte{' '}
              <span className="logo-ideas">Ideas</span>
            </span>
          </Link>
          <ul className="nav-links" role="list">
            <li>
              <a href="/#services">Services</a>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? 'nav-active' : undefined)}
              >
                About
              </NavLink>
            </li>
            <li className="nav-contact-item">
              <a href="/#contact">Get in Touch</a>
            </li>
            <li>
              <a
                href={site.calendlyUrl}
                className="nav-book"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a Call
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </li>
          </ul>

          <button
            ref={hamburgerRef}
            className="hamburger"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={menuOpen ? 'hamburger-line open' : 'hamburger-line'} />
            <span className={menuOpen ? 'hamburger-line open' : 'hamburger-line'} />
            <span className={menuOpen ? 'hamburger-line open' : 'hamburger-line'} />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={menuOpen ? 'mobile-menu open' : 'mobile-menu'}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <button
          className="mobile-close"
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenuAndReturnFocus}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <nav aria-label="Mobile navigation">
          <ul className="mobile-nav-links" role="list">
            <li>
              <a href="/#services" onClick={closeMenu}>
                Services
              </a>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? 'nav-active' : undefined)}
                onClick={closeMenu}
              >
                About
              </NavLink>
            </li>
            <li>
              <a href="/#contact" onClick={closeMenu}>
                Get in Touch
              </a>
            </li>
            <li>
              <a
                href={site.calendlyUrl}
                className="mobile-book"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
                Book a Call <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
